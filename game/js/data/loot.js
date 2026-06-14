/* loot.js —— 每个怪物的装备掉落表（按生态分类生成，BOSS/精英更优）
 * 在 balance.js 之前加载（仅设置 m.gearLoot，不影响 hp/atk）。
 * gearLoot: { chance, n(件数), luck(品质幸运), themeArmor, themeWeapons }
 * 既有的 m.drops（材料/任务/签名物）保持不变，由 rollLoot 处理。
 */
window.DATA = window.DATA || {};

// 怪物生态分类（决定主题装备类型）
const CAT = {
  rat:'beast', wildcat:'beast', bull:'beast', bulllord:'beast', deerlord:'beast', lion:'beast',
  eel:'beast', murloc:'beast', banim:'beast', moonbear:'beast', werewolf:'beast', blackdog:'beast', bull_brute:'beast', blackserp:'beast',
  wizard_f:'caster', siren:'caster',
  darkelf:'humanoid', evil_rogue:'humanoid', silverwing:'humanoid', sandgiant:'humanoid',
  treant:'nature', treant_herd:'nature', treant_king:'nature', spider:'nature',
  skeleton_g:'undead', serisotot:'undead', swamp_undead:'undead', plague:'undead', abak_heir:'undead',
  corpse:'undead', skel_army:'undead', lich:'undead', pharaoh:'undead', aina:'undead', aina2:'undead', headless:'undead',
  golem:'mech', goblin_cut:'mech', goblin_ig:'mech', furnace:'mech',
  goldworm:'demon', dilakru:'demon', upton:'demon', brosth:'demon', purpledragon:'demon', medusa:'demon',
};
// 分类 → 主题装备（themeArmor / themeWeapons），决定该怪偏向掉落的类型
const CATGEAR = {
  beast:    { themeArmor:'leather', themeWeapons:['dagger','bow'] },
  nature:   { themeArmor:'leather', themeWeapons:['staff','dagger'] },
  caster:   { themeArmor:'cloth',   themeWeapons:['staff'] },
  undead:   { themeArmor:'cloth',   themeWeapons:['mace','staff'] },
  mech:     { themeArmor:'plate',   themeWeapons:['mace','sword'] },
  humanoid: { themeWeapons:['sword','dagger','bow'] },
  demon:    {},   // 高级怪不限主题，纯按品质
};

(function(){
  for(const id in DATA.monsters){
    const m = DATA.monsters[id];
    const g = CATGEAR[CAT[id]||'humanoid'] || {};
    let chance, n, luck;
    if(m.type==='boss'){ chance=0.9; n=2; luck=25; }
    else if(m.type==='elite'){ chance=0.34; n=1; luck=10; }
    else { chance=0.09; n=1; luck=0; }
    // 高等级怪幸运略增（出货品质随等级稍好）
    luck += Math.min(12, Math.floor((m.level||1)/18));
    m.gearLoot = { chance, n, luck, themeArmor:g.themeArmor, themeWeapons:g.themeWeapons };
  }
})();
