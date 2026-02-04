module.exports = [
  // API
  {
    url: "https://api.hypixel.net/v2/player?key=KEY&uuid=VALUE",
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
  },
  /*
  {
    url: "https://api.hypixel.net/skyblock/profile?key=KEY&profile=VALUE",
    type: 'skyblock_profile',
    values: [
      'd05a0e80fa024f5a9367ca66135b7347', // LeaPhant/Grapes (Ironman)
      '683a9f50cc9146f7b752839165c1245e', // Akinsoft/Not Allowed To Quit Skyblock Ever Again
      // '64722047f9b34e69b67b76a62351eb05', // Technoblade/Mango
      '739c8592161c47d2a61f25f246041967', // ThirtyVirus/Strawberry (Ironman)
      'd3df3cccffd3473fbbba311d5329bd25', // Refraction/Apple
      'fb3d96498a5b4d5b91b763db14b195ad', // DeathStreeks/Blueberry
      '1277d71f338046e298d90c9fe4055f00', // 56ms/Strawberry
      '7c207917505f4b48bab6631f2953151f', // Dueces/Kiwi
      'a7da9276d9fa49a18e770a0509584780', // TheOriginalAce/Mango
      'cf8e438488834985bae1749013de6db1', // 15h/Coconut
      'fad90e13ff44441c8c5e1dbe489fd44f', // Nemqnja/Tomato
    ],
    transform: (obj, { merge, uniqueArrayElements }) => {
      let uuid = {};
      Object.keys(obj.profile.members).forEach(profile => {
        try {
          delete obj.profile.members[profile].jacob2.contests;
        } catch (e) {}
        uuid = merge(uuid, obj.profile.members[profile], { arrayMerge: uniqueArrayElements });
        delete obj.profile.members[profile];
      });
      obj.profile.members.uuid = uuid;
      return obj;
    },
  },
  */
  {
    url: "https://api.hypixel.net/v2/skyblock/profile?key=KEY&profile=VALUE",
    type: 'skyblock_profile_v2',
    values: [
      'd05a0e80fa024f5a9367ca66135b7347', // LeaPhant/Grapes (Ironman)
      '683a9f50cc9146f7b752839165c1245e', // Akinsoft/Not Allowed To Quit Skyblock Ever Again
      // '64722047f9b34e69b67b76a62351eb05', // Technoblade/Mango
      '739c8592161c47d2a61f25f246041967', // ThirtyVirus/Strawberry (Ironman)
      'd3df3cccffd3473fbbba311d5329bd25', // Refraction/Apple
      'fb3d96498a5b4d5b91b763db14b195ad', // DeathStreeks/Blueberry
      '1277d71f338046e298d90c9fe4055f00', // 56ms/Strawberry
      '7c207917505f4b48bab6631f2953151f', // Dueces/Kiwi
      'a7da9276d9fa49a18e770a0509584780', // TheOriginalAce/Mango
      'cf8e438488834985bae1749013de6db1', // 15h/Coconut
      'fad90e13ff44441c8c5e1dbe489fd44f', // Nemqnja/Tomato
    ],
    transform: (obj, { merge, uniqueArrayElements }) => {
      let uuid = {};
      Object.keys(obj.profile.members).forEach(profile => {
        try {
          delete obj.profile.members[profile].jacob2.contests;
        } catch (e) {}
        uuid = merge(uuid, obj.profile.members[profile], { arrayMerge: uniqueArrayElements });
        delete obj.profile.members[profile];
      });
      obj.profile.members.uuid = uuid;
      return obj;
    },
  },
  {
    url: "https://api.hypixel.net/v2/skyblock/garden?key=KEY&profile=VALUE",
    type: 'skyblock_garden',
    values: [
      'd05a0e80fa024f5a9367ca66135b7347', // LeaPhant/Grapes (Ironman)
      '683a9f50cc9146f7b752839165c1245e', // Akinsoft/Not Allowed To Quit Skyblock Ever Again
      // '64722047f9b34e69b67b76a62351eb05', // Technoblade/Mango
      '739c8592161c47d2a61f25f246041967', // ThirtyVirus/Strawberry (Ironman)
      'd3df3cccffd3473fbbba311d5329bd25', // Refraction/Apple
      'fb3d96498a5b4d5b91b763db14b195ad', // DeathStreeks/Blueberry
      '1277d71f338046e298d90c9fe4055f00', // 56ms/Strawberry
      '7c207917505f4b48bab6631f2953151f', // Dueces/Kiwi
      'a7da9276d9fa49a18e770a0509584780', // TheOriginalAce/Mango
      'cf8e438488834985bae1749013de6db1', // 15h/Coconut
      'fad90e13ff44441c8c5e1dbe489fd44f', // Nemqnja/Tomato
    ],
  },
  {
    url: "https://api.hypixel.net/v2/guild?key=KEY&id=VALUE",
    type: 'guild',
    values: [
      '5687d71c0cf245173363d973', // Chimera
      '53bd67d7ed503e868873eceb', // Rebel
      '5320667aed50f531e5de4f5b', // Rawr
    ],
    transform: (obj) => {
      obj.guild.members[0].expHistory = {};
      return obj;
    },
  },
  {
    url: 'https://api.hypixel.net/v2/resources/achievements',
    type: 'achievements',
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
    url: 'https://api.hypixel.net/v2/skyblock/bazaar',
    type: 'skyblock_bazaar_products',
    transform: (obj) => {
      return Object.keys(obj.products).sort();
    },
  },
  {
    url: 'https://api.hypixel.net/v2/resources/challenges',
    type: 'challenges',
  },
  {
    url: 'https://api.hypixel.net/v2/resources/quests',
    type: 'quests',
  },
  {
    url: 'https://api.hypixel.net/v2/resources/games',
    type: 'games',
  },
  {
    url: 'https://api.hypixel.net/v2/resources/vanity/pets',
    type: 'pets',
  },
  {
    url: 'https://api.hypixel.net/v2/resources/vanity/companions',
    type: 'companions',
  },
  {
    url: 'https://api.hypixel.net/v2/resources/guilds/achievements',
    type: 'guild_achievements',
  },
  {
    url: 'https://api.hypixel.net/v2/resources/skyblock/collections',
    type: 'skyblock_collections',
  },
  {
    url: 'https://api.hypixel.net/v2/resources/skyblock/skills',
    type: 'skyblock_skills',
  },
  {
    url: 'https://api.hypixel.net/v2/resources/skyblock/items',
    type: 'skyblock_items',
  },
];
