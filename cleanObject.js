const whiteListedArrays = [
  'packages',
  'cakes_found_by_name',
  'unlockedColors',
  'unlockedParts',
  'custom_titles',
  'bridgeMapWins',
  'tutorial',
  'visited_zones',
  'crafted_minions',
  'achievement_spawned_island_types',
  'unlocked_coll_tiers'
];

const blacklistedValues = ['contract_choices', 'currently_upgrading', 'bats_spawned', 'oldItem'];

function containsBadKey(key) {
  return (
    blacklistedValues.includes(key) ||
    key.startsWith('fetchur-') ||
    key.startsWith('spooky_festival_') ||
    key.startsWith('layout_items_') ||
    key.startsWith('claimed_solo_bank_') ||
    key.startsWith('claimed_coop_bank_') ||
    key.startsWith('given_cookies_') ||
    /\d+:\d+_\d+:/.test(key) ||
    /^[0-9a-fA-F]{32}$/.test(key)
  );
}

function containsBadValue(key) {
  return !(
      /\d+_\d+/.test(key) ||
      /st_jerry(_reward)?_\d+/.test(key) ||
      /ADVENT_.+:.+/.test(key)
  )
}

function shouldHideObject(key) {
  return (
      /\w+inventory/i.test(key) ||
      key.includes('_layout') || key.includes('layout_')
  )
}

function normalizeObject(object) {
  const o = { ...object };
  const keys = Object.keys(o).filter((key) => {
    if (containsBadKey(key)) {
      delete o[key];
      return false;
    }
    return true;
  });
  keys.forEach((key) => {
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
              entry = [{ ...normalizeObject(entry[0]) }];
              break;
            }
            entry = [];
          } else {
            entry = entry.filter(containsBadValue);
          }
        } else if (entry === null) {
          entry = '';
        } else if (shouldHideObject(key)) {
          entry = {}
        } else {
          entry = normalizeObject(entry);
        }
    }
    o[key] = entry;
  });
  return o;
}

module.exports = { containsBadKey, normalizeObject };
