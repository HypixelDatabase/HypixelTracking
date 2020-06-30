module.exports = [
  // API
  {
    url: "https://api.hypixel.net/player?key=KEY&uuid=VALUE",
    type: 'player',
    values: [
      '5409757b87344c0394b10bf966a2d594',
      '3abe2f6bd45a4e2282d4f9014569db25',
      '1f15c58cdf3c419bba39b89e256d8a86',
      '31b5211af8b64ea8abc6b16d6dddb07b',
      '9cc15d802eb44f2aaf2075604ce452d5',
      'b26feed824264432b765dd64c3ab0ff8',
      'f025c1c7f55a4ea0b8d93f47d17dfe0f'
    ],
    dest: "./API/player.json"
  },
  {
    url: "https://api.hypixel.net/skyblock/profile?key=KEY&profile=VALUE",
    type: 'skyblock_profile',
    values: [
      '83eeafe88f68419a8192406efe69fd86',
      '683a9f50cc9146f7b752839165c1245e',
      '64722047f9b34e69b67b76a62351eb05',
      '70ec14b3155643f8a5d14ec37fb1bb35'
    ],
    dest: "./API/skyblock_profile.json"
  },
  {
    url: "https://api.hypixel.net/guild?key=KEY&id=VALUE",
    type: 'guild',
    values: [
      '5687d71c0cf245173363d973',
      '53bd67d7ed503e868873eceb',
      '5320667aed50f531e5de4f5b'
    ],
    dest: "./API/guild.json"
  },
  {
    url: 'https://api.hypixel.net/resources/achievements',
    dest: './API/achievements.json'
  },
  {
    url: 'https://api.hypixel.net/resources/challenges',
    dest: './API/challenges.json'
  },
  {
    url: 'https://api.hypixel.net/resources/quests',
    dest: './API/quests.json'
  },
  {
    url: 'https://api.hypixel.net/resources/guilds/achievements',
    dest: './API/guild_achievements.json'
  },
  {
    url: 'https://api.hypixel.net/resources/guilds/permissions',
    dest: './API/guild_permissions.json'
  },
  {
    url: 'https://api.hypixel.net/resources/skyblock/collections',
    dest: './API/skyblock_collections.json'
  },
  {
    url: 'https://api.hypixel.net/resources/skyblock/skills',
    dest: './API/skyblock_skills.json'
  },
  // hypixel.net
  {
    url: 'https://hypixel.net/js/hypixel/general.js',
    dest: './hypixel.net/public/js/general.js'
  },
  {
    url: 'https://hypixel.net/js/hypixel/forums.js',
    dest: './hypixel.net/public/js/forums.js'
  },
  {
    url: 'https://hypixel.net/css.php?css=EWRblock_RecentNews',
    dest: './hypixel.net/public/css/EWRblock_RecentNews.css'
  },
  {
    url: 'https://hypixel.net/css.php?css=message_user_info',
    dest: './hypixel.net/public/css/message_user_info.css'
  },
  {
    url: 'https://hypixel.net/css.php?css=public',
    dest: './hypixel.net/public/css/public.css'
  },
  {
    url: 'https://hypixel.net/css.php?css=home',
    dest: './hypixel.net/public/css/home.css'
  },
  {
    url: 'https://hypixel.net/css.php?css=moderator_bar',
    dest: './hypixel.net/public/css/moderator_bar.css'
  },
  // rewards.hypixel.net
  {
    url: 'https://rewards.hypixel.net/claim-reward/12345678',
    dest: './rewards.hypixel.net/public/index.html'
  },
  {
    url: 'https://rewards.hypixel.net/claim-reward/app.js',
    dest: './rewards.hypixel.net/public/js/app.js'
  },
  {
    url: 'https://rewards.hypixel.net/claim-reward/app.css',
    dest: './rewards.hypixel.net/public/css/app.css'
  },
  // store.hypixel.net
  {
    url: 'https://store.hypixel.net/assets/js/site.js',
    dest: './store.hypixel.net/public/js/site.js'
  },
  {
    url: 'https://storeassets.hypixel.net/store.js',
    dest: './store.hypixel.net/public/js/store.js'
  }
];
