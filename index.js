const axios = require('axios');
const mc = require('minecraft-protocol');
const merge = require('deepmerge');
const unzipper = require('unzipper');
const fs = require('fs');
const puppeteer = require('puppeteer');
const urls = require('./urls');
const path = require('path');
const { normalizeObject } = require('./cleanObject.js');

require('dotenv').config();
const apiKey = process.env.HYPIXEL_API_KEY || '';

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const wait = util.promisify(setTimeout);

const logprefix = {
  info: '[ INFO\x1b[0m ]',
  ok: '[  \x1b[32mOK\x1b[0m  ]',
  warn: '[ \x1b[33mWARN\x1b[0m ]',
  error: '[\x1b[31mFAILED\x1b[0m]'
};

function log(msg = '', level = 'info', timer) {
  let timeStr = '';
  if (timer) {
    const stop = process.hrtime(timer);
    timeStr = `\x1b[32m+${Math.round((stop[0] * 1e9 + stop[1]) / 1e6)}ms\x1b[0m`;
  }
  console.log(`${logprefix[level]} ${msg} ${timeStr}`);
}

function uniqueArrayElements(target, source) {
  const destination = target.slice().concat(source);
  return [...new Set(destination)];
}

async function get(url) {
  try {
    const urlString = url.replace('KEY', apiKey);
    const response = await axios.get(urlString);
    log(`Fetched ${url}`, 'ok');
    return response.data;
  } catch (error) {
    log(`Fetching ${url}: ${error}`, 'error');
  }
}

const leaderboardValues = {};

async function getEntryValues(entry) {
  const leaderboard = entry.valuesLeaderboard;
  if (!leaderboard) return entry.values;

  if (!leaderboardValues[leaderboard]) {
    const url = `https://api.eliteskyblock.com/leaderboard/${leaderboard}`;
    const [data, ironmanData] = await Promise.all([
      get(`${url}?limit=100`),
      get(`${url}?limit=20&mode=ironman`)
    ]);
    // Grab 7 UUIDs and 3 guaranteed ironman UUIDs
    const ironmanValues = ironmanData?.entries
      ?.sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((entry) => entry.uuid);
    const generalValues = data?.entries
      ?.filter((entry) => !ironmanValues?.includes(entry.uuid))
      .sort(() => Math.random() - 0.5)
      .slice(0, 7)
      .map((entry) => entry.uuid);
    leaderboardValues[leaderboard] = [...(ironmanValues || []), ...(generalValues || [])];
  }

  return leaderboardValues[leaderboard]?.length === 10 ? leaderboardValues[leaderboard] : entry.values;
}

const tasks = [
  {
    name: 'Generate API resources',
    func: async () => {
      for (const entry of urls) {
        let obj = {};
        const { type, url, dest } = entry;
        let results = [];
        log(`Generating resource '${type}'`);

        const path = dest || `./API/${type}.json`;

        if (Object.hasOwn(entry, 'values')) {
          // Load previous data
          obj = require(path) || {};
          const values = await getEntryValues(entry);
          for (const value of values) {
            results.push(await get(url.replace('VALUE', value), type));
          }
        } else {
          results.push(await get(url));
        }

        try {
          if (Object.hasOwn(entry, 'transform')) {
            results = results.map((result) => entry.transform(result, { merge, uniqueArrayElements }));
          }

          if (results.length > 1) {
            results.forEach((result) => {
              obj = merge(obj, result, { arrayMerge: uniqueArrayElements });
            });
            // Anonymize data & remove extra array entries
            obj = normalizeObject(obj);
          } else {
            obj = results[0];
          }

          // Sometimes resources return old data, so we need to discard the changes
          if (url.includes('resources')) {
            const { lastUpdated } = require(path);

            if (lastUpdated > obj.lastUpdated) {
              log(
                `Resource '${type}' returned data from ${lastUpdated}, which is older than ${obj.lastUpdated}! Discarding...`,
                'warn'
              );
              continue;
            }
          }

          await fs.promises.writeFile(path, JSON.stringify(obj, null, 2));
        } catch (error) {
          log(`Failed resource ${type}: ${error}`, 'error');
        }
      }
    }
  },
  {
    name: 'Discard trivial changes',
    func: async () => {
      await exec('bash ./update.sh');
    }
  },
  {
    name: 'Get server list ping',
    func: async () => {
      const data = await mc.ping({ host: 'mc.hypixel.net', version: '1.8.9' });
      data.players.online = 0;
      data.latency = 0;
      data.description = data.description
        .replace(/\d DAYS? [\d]{2}:[\d]{2}:[\d]{2}/g, 'd DAYS HH:MM:SS')
        .replace(/[\d]{2}:[\d]{2}:[\d]{2}/g, 'HH:MM:SS');
      return fs.writeFileSync('./ServerListPing/slp.json', JSON.stringify(data, null, 2));
    }
  },
  {
    name: 'Update resource packs',
    func: async () => {
      const packs = require('./API/resource_packs.json');
      for (const mode of packs.packs) {
        const { id, versions } = mode;
        log(`Downloading pack for ${id}`)
        const latest_url = versions.sort((a, b) => b.packFormat - a.packFormat)[0].url;
        console.log(latest_url);
        const response = await axios.get(latest_url, { responseType: 'stream' })

        await response.data
            .pipe(unzipper.Extract( { path: `./ResourcePacks/${id}` }))
            .promise();
      }
    }
  },
  {
    name: 'Get OpenAPI schema',
    func: async () => {
      log('Starting Puppeteer...');
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      const page = await browser.newPage();
      await page.goto('https://api.hypixel.net', { waitUntil: 'networkidle2' });

      const client = await page.target().createCDPSession();
      await client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: path.resolve('./API/')
      });

      const downloadSelector = 'a[download="swagger.json"]';
      await page.waitForSelector(downloadSelector);

      await page.click(downloadSelector);
      log('Downloading OpenAPI spec...');
      await wait(1000);
      await browser.close();
      try {
        await fs.promises.rename('./API/swagger.json', './API/docs.json');
      } catch (e) {
        // idc
      }
      try {
        await fs.promises.unlink('./API/swagger.json.crdownload');
      } catch (e) {
        //
      }
    }
  }
];

async function doTask(task) {
  const { name } = task;
  log(`Running task ${name}`);
  const start = process.hrtime();
  return task
    .func()
    .then(() => log(`Finished task ${name}`, 'ok', start))
    .catch((error) => log(`Failed task ${name}: ${error}`, 'error', start));
}

(async () => {
  const start = Date.now();
  log('Started HypixelTracking script');
  if (apiKey.length === 0) {
    log('No API key set!', 'warn');
  }
  for (const task of tasks) {
    await doTask(task);
  }
  log(`Finished all tasks in ${(Date.now() - start) / 1000}s`);
})();
