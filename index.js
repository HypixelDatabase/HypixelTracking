const axios = require('axios');
const mc = require('minecraft-protocol');
const merge = require('deepmerge');
const fs = require('fs');
const puppeteer = require('puppeteer');
const urls = require('./urls');
const path = require("path");

require('dotenv').config();
const apiKey = process.env.HYPIXEL_API_KEY || '';

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const wait = util.promisify(setTimeout);

const logprefix = {
  info: '[ INFO\x1b[0m ]',
  ok: '[  \x1b[32mOK\x1b[0m  ]',
  warn: '[ \x1b[33mWARN\x1b[0m ]',
  error: '[\x1b[31mFAILED\x1b[0m]',
};

function log(msg = '', level = 'info', timer) {
  let timeStr = '';
  if (timer) {
    const stop = process.hrtime(timer);
    timeStr = `\x1b[32m+${Math.round((stop[0] * 1e9 + stop[1])/1e6)}ms\x1b[0m`
  }
  console.log(`${logprefix[level]} ${msg} ${timeStr}`);
}

const whiteListedArrays = [
  'packages', 'cakes_found_by_name', 'unlockedColors', 'unlockedParts', 'custom_titles', 'bridgeMapWins',
  'tutorial', 'visited_zones', 'crafted_minions', 'achievement_spawned_island_types', 'unlocked_coll_tiers'
];

const blacklistedValues = ['contract_choices', 'currently_upgrading', 'bats_spawned', 'oldItem'];

function uniqueArrayElements(target, source) {
  const destination = target.slice().concat(source);
  return [...new Set(destination)];
}

function containsBadKey(key) {
  return (blacklistedValues.includes(key))
    || key.startsWith('fetchur-')
    || key.startsWith('spooky_festival_')
    || /\d+:\d+_\d+:/.test(key)
    || /^[0-9a-fA-F]{32}$/.test(key);
}

function normalizeObject(object) {
  const o = { ...object  };
  const keys = Object.keys(o).filter((key) => {
    if (containsBadKey(key)) {
      delete o[key];
      return false;
    }
    return true;
  })
  keys.forEach(key => {
    let entry = o[key];
    switch (typeof entry) {
      case 'number':
        entry = 0;
        break;
      case 'string':
        entry = '';
        break;
      case 'boolean':
        entry = true;
        break;
      default:
        if (Array.isArray(entry)) {
          if (!whiteListedArrays.includes(key)) {
            if (typeof entry[0] === 'object') {
              entry = [{...normalizeObject(entry[0])}]
              break;
            }
            entry = [];
          }
        } else if (entry === null) {
          entry = '';
        } else {
          entry = normalizeObject(entry);
        }
    }
    o[key] = entry;
  })
  return o;
}

async function get(url) {
  try {
    const urlString = url.replace('KEY', apiKey);
    const response = await axios.get(urlString);
    log(`Fetched ${url}`, 'ok');
    return response.data;
  } catch (error) {
    log(`Fetching ${url}: ${error}`,'error');
  }
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
          for (const value of entry.values) {
            results.push(await get(url.replace('VALUE', value), type));
          }
        } else {
          results.push(await get(url));
        }

        try {
          if (Object.hasOwn(entry, 'transform')) {
            results = results.map((result) => entry.transform(result, { merge, uniqueArrayElements }))
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
              log(`Resource '${type}' returned data from ${lastUpdated}, which is older than ${obj.lastUpdated}! Discarding...`, 'warn');
              continue;
            }
          }

          await fs.promises.writeFile(path, JSON.stringify(obj, null, 2));
        } catch (error) {
          log(`Failed resource ${type}: ${error}`, 'error')
        }
      }
    },
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
      data.description = data.description.replace(/\d DAYS? [\d]{2}:[\d]{2}:[\d]{2}/g, 'd DAYS HH:MM:SS')
        .replace(/[\d]{2}:[\d]{2}:[\d]{2}/g, 'HH:MM:SS');
      return fs.writeFileSync('./ServerListPing/slp.json', JSON.stringify(data, null, 2));
    }
  },
  {
    name: 'Get OpenAPI schema',
    func: async () => {
      log('Starting Puppeteer...');
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();
      await page.goto('https://api.hypixel.net', { waitUntil: 'networkidle2' });

      const client = await page.target().createCDPSession();
      await client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: path.resolve('./API/'),
      });

      const downloadSelector = 'a[download="swagger.json"]';
      await page.waitForSelector(downloadSelector);

      await page.click(downloadSelector);
      log('Downloading OpenAPI spec...');
      await wait(1000);
      await browser.close();
      try {
        await fs.promises.rename('./API/swagger.json', './API/docs.json')
      } catch (e) {
        // idc
      }
      try {
        await fs.promises.unlink('./API/swagger.json.crdownload')
      } catch (e) {
        //
      }
    },
  }
];

async function doTask(task) {
  const { name } = task;
  log(`Running task ${name}`);
  const start = process.hrtime();
  return task.func()
    .then(() => log(`Finished task ${name}`, 'ok', start))
    .catch((error) => log(`Failed task ${name}: ${error}`, 'error', start))
}

(async () => {
  const start = Date.now();
  log('Started HypixelTracking script');
  if (apiKey.length === 0) {
    log('No API key set!', 'warn')
  }
  for (const task of tasks) {
    await doTask(task);
  }
  log(`Finished all tasks in ${(Date.now() - start) / 1000}s`)
})();
