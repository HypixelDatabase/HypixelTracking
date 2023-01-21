module.exports = [
  // API
  {
    url: "https://api.hypixel.net/player?key=KEY&uuid=VALUE",
    type: 'player',
    values: [
      '5409757b87344c0394b10bf966a2d594', // huntz
      '3abe2f6bd45a4e2282d4f9014569db25', // anrie
      '1f15c58cdf3c419bba39b89e256d8a86', // Chevio
      '31b5211af8b64ea8abc6b16d6dddb07b', // Nemqnja
      '9cc15d802eb44f2aaf2075604ce452d5', // Dexyz
      'b26feed824264432b765dd64c3ab0ff8', // Tyler_P13
      'f025c1c7f55a4ea0b8d93f47d17dfe0f', // Plancke
      '20934ef9488c465180a78f861586b4cf', // Minikloon
      'ef962ec2df6e48a2ac9d6062c1b84652', // builder_247
      '04cd3f240c7f42009b3398fba995c3a6', // Ealman
    ],
    dest: "./API/player.json"
  },
  {
    url: "https://api.hypixel.net/skyblock/profile?key=KEY&profile=VALUE",
    type: 'skyblock_profile',
    values: [
      'd05a0e80fa024f5a9367ca66135b7347', // LeaPhant/Grapes (Ironman)
      '683a9f50cc9146f7b752839165c1245e', // Akinsoft/Not Allowed To Quit Skyblock Ever Again
      '64722047f9b34e69b67b76a62351eb05', // Technoblade/Mango
      '739c8592161c47d2a61f25f246041967', // ThirtyVirus/Strawberry (Ironman)
      'd3df3cccffd3473fbbba311d5329bd25', // Refraction/Apple
      'fb3d96498a5b4d5b91b763db14b195ad', // DeathStreeks/Blueberry
      '1277d71f338046e298d90c9fe4055f00', // 56ms/Strawberry
      '7c207917505f4b48bab6631f2953151f', // Dueces/Kiwi
      'a7da9276d9fa49a18e770a0509584780', // TheOriginalAce/Mango
    ],
    dest: "./API/skyblock_profile.json"
  },
  {
    url: "https://api.hypixel.net/guild?key=KEY&id=VALUE",
    type: 'guild',
    values: [
      '5687d71c0cf245173363d973', // Chimera
      '53bd67d7ed503e868873eceb', // Rebel
      '5320667aed50f531e5de4f5b', // Rawr
      '5ac8a3780cf2d841f8a664ad', // The Abyss
      '5363aa4eed50df539dca00ad', // Dominance
      '56ece7c40cf2e4f9ffcc284e', // Cronos
    ],
    dest: "./API/guild.json"
  },
  {
    url: 'https://api.hypixel.net/resources/achievements',
    dest: './API/achievements.json',
    transform: (obj) => {
      const o = { ...obj };
      Object.keys(obj.achievements).forEach((game) => {
        Object.keys(obj.achievements[game].one_time || {}).forEach((achievement) => {
          if (o.achievements[game].one_time[achievement].hasOwnProperty('gamePercentUnlocked')) {
            o.achievements[game].one_time[achievement].gamePercentUnlocked = 1;
          }
          if (o.achievements[game].one_time[achievement].hasOwnProperty('globalPercentUnlocked')) {
            o.achievements[game].one_time[achievement].globalPercentUnlocked = 1;
          }
        });
      });
      return o;
    }
  },
  {
    url: 'https://api.hypixel.net/resources/challenges',
    dest: './API/challenges.json'
  },
  //{
  //  url: 'https://api.hypixel.net/resources/quests',
  //  dest: './API/quests.json'
  //},
  {
    url: 'https://api.hypixel.net/resources/games',
    dest: './API/games.json'
  },
  {
    url: 'https://api.hypixel.net/resources/vanity/pets',
    dest: './API/pets.json'
  },
  {
    url: 'https://api.hypixel.net/resources/vanity/companions',
    dest: './API/companions.json'
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
  {
    url: 'https://api.hypixel.net/resources/skyblock/items',
    dest: './API/skyblock_items.json'
  },
];
