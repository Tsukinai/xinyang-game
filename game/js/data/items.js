/* items.js —— 物品库 + 随机词缀生成
 * 固定物品 DATA.items[id] = {name,slot?,quality,type,reqLevel,classes?,stats{},value,desc,use?,stackable?}
 * 生成实例（背包中）：{gen:true,name,slot,quality,reqLevel,stats{},value,sockets,gems[],plus,affixes[]}
 * Items.def(itemOrId) 返回有效定义（兼容固定与生成物品）。
 */
window.DATA = window.DATA || {};

// ---------- 固定物品：消耗品 / 材料 / 宝石 / 钥匙 ----------
DATA.items = {
  // 消耗
  potion_hp_s:{name:'初级回血药剂',type:'消耗品',quality:'white',value:8,stackable:true,icon:'🧪',desc:'立即恢复 120 生命。',use:{hp:120}},
  potion_hp_m:{name:'中级回血药剂',type:'消耗品',quality:'bronze',value:24,stackable:true,icon:'🧪',desc:'立即恢复 380 生命。',use:{hp:380}},
  potion_hp_l:{name:'高级瞬间回复药剂',type:'消耗品',quality:'silver',value:70,stackable:true,icon:'🧪',desc:'立即恢复 40% 生命。',use:{hpPct:0.4}},
  potion_mp_s:{name:'初级法力药剂',type:'消耗品',quality:'white',value:8,stackable:true,icon:'🔷',desc:'立即恢复 80 法力。',use:{mp:80}},
  potion_mp_m:{name:'中级法力药剂',type:'消耗品',quality:'bronze',value:24,stackable:true,icon:'🔷',desc:'立即恢复 240 法力。',use:{mp:240}},
  bandage:{name:'战斗绷带',type:'消耗品',quality:'white',value:5,stackable:true,icon:'🩹',desc:'恢复 90 生命（盗贼/通用）。',use:{hp:90}},
  scroll_tp:{name:'回城卷轴',type:'卷轴',quality:'bronze',value:20,stackable:true,icon:'📜',desc:'立即传送回最近主城（脱战时使用）。'},
  scroll_random_tp:{name:'随机传送卷轴',type:'卷轴',quality:'silver',value:50,stackable:true,icon:'📜',desc:'随机传送逃离危险（战斗中可逃）。'},
  // 材料
  bat_tooth:{name:'蝙蝠牙齿',type:'材料',quality:'white',value:2,stackable:true,icon:'🦷',desc:'铁匠卡迪为希尔顿要塞前线无限收购。'},
  rat_tail:{name:'银灰巨鼠尾巴',type:'材料',quality:'white',value:1,stackable:true,icon:'🐀',desc:'药剂师收集用。'},
  rat_skull:{name:'银灰巨鼠头骨',type:'材料',quality:'white',value:1,stackable:true,icon:'💀',desc:'猎人克劳斯收集用。'},
  fine_silk:{name:'精丝',type:'材料',quality:'bronze',value:6,stackable:true,icon:'🧵',desc:'然多湖盛产，医师布莱文斯急需。'},
  murloc_fin:{name:'鱼人鳍',type:'材料',quality:'white',value:3,stackable:true,icon:'🐟',desc:'鱼人掉落的材料。'},
  treant_bark:{name:'树妖树皮',type:'材料',quality:'bronze',value:5,stackable:true,icon:'🪵',desc:'树妖林材料。'},
  iron_ore:{name:'铁矿石',type:'材料',quality:'white',value:4,stackable:true,icon:'⛏️',desc:'铁匠锻造原料。'},
  herb:{name:'药草',type:'材料',quality:'white',value:3,stackable:true,icon:'🌿',desc:'药剂师炼药原料。'},
  // 宝石（镶嵌）
  gem_str:{name:'力量宝石',type:'宝石',quality:'silver',value:40,stackable:true,icon:'🔴',stats:{str:5},desc:'镶嵌于装备：力量+5。'},
  gem_agi:{name:'敏捷宝石',type:'宝石',quality:'silver',value:40,stackable:true,icon:'🟢',stats:{agi:5},desc:'镶嵌于装备：敏捷+5。'},
  gem_int:{name:'智力宝石',type:'宝石',quality:'silver',value:40,stackable:true,icon:'🔵',stats:{int:5},desc:'镶嵌于装备：智力+5。'},
  gem_sta:{name:'体质宝石',type:'宝石',quality:'silver',value:40,stackable:true,icon:'🟣',stats:{sta:6},desc:'镶嵌于装备：体质+6。'},
  gem_crit:{name:'烈焰宝石',type:'宝石',quality:'gold',value:90,stackable:true,icon:'🔶',stats:{crit:4},desc:'镶嵌于装备：暴击+4%。'},
  lucky_gem:{name:'幸运宝石',type:'强化',quality:'gold',value:60,stackable:true,icon:'💠',desc:'用于强化装备（砸级）：成功+1阶，高阶有失败风险。'},
  lockpick:{name:'开锁器',type:'工具',quality:'white',value:5,stackable:true,icon:'🗝️',desc:'开启上锁宝箱（盗贼无需）。'},
  // 钥匙/任务物
  dark_key:{name:'暗金钥匙',type:'任务物品',quality:'dark',value:0,stackable:true,icon:'🔑',desc:'开启暗金宝箱。'},
  // 签名/套装/传奇（部分作为任务奖励或稀有掉落）
  feather_step:{name:'快速回转步靴',slot:'feet',quality:'gold',type:'皮甲',armorType:'leather',reqLevel:10,value:300,icon:'👢',stats:{agi:8,haste:10,dodge:5},desc:'医师布莱文斯精丝任务奖励。移动如风。'},
  weaver_ring:{name:'织丝者之戒',slot:'ring1',quality:'silver',type:'戒指',reqLevel:8,value:120,icon:'💍',stats:{agi:6,crit:3},desc:'蜘蛛洞穴出产的精致戒指。'},
  pandora_box:{name:'潘多拉之盒',slot:'trinket',quality:'dark',type:'勋章',reqLevel:1,value:0,icon:'🎁',stats:{spi:10,crit:5},desc:'命运之盒，可投掷命骰改变命运。'},
  courage_armor:{name:'勇气坚甲',slot:'chest',quality:'gold',type:'板甲',armorType:'plate',reqLevel:12,value:400,icon:'🦺',stats:{str:6,sta:10,armor:40},desc:'树妖林/黑焰森林专家级产出。'},
  // 终极神装组件（主线收集）
  abak_hand:{name:'独裁者·封印之手',slot:'hand',quality:'legend',type:'板甲',armorType:'plate',reqLevel:50,value:0,icon:'🧤',stats:{str:20,sta:25,armor:80,atk:40},set:'abak',desc:'独裁者阿巴克套装组件之一。'},
  zennard_sword:{name:'泽恩纳德之剑',slot:'weapon',quality:'divine',type:'巨剑',weaponType:'greatsword',reqLevel:60,value:0,icon:'🗡️',stats:{str:40,atk:200,crit:15,hp:500},desc:'封印于罪域的龙王之剑，35%概率发动十倍暴击。需圣灵之心驾驭。'},
};

// 套装效果
DATA.sets = {
  abak:{ name:'独裁者阿巴克套装', pieces:8, bonus:{ 4:{atk:60,armor:80,desc:'4件：攻击+60 护甲+80'}, 8:{atk:200,crit:20,hp:2000,desc:'8件：成为终极神装，全属性飞跃'} } },
};

// ---------- Items 模块 ----------
(function(){
  const QMUL = { white:1.0, bronze:1.28, silver:1.62, gold:2.1, dark:2.8, epic:3.4, legend:4.2, divine:5.4 };
  const ARMOR_SLOTS = ['head','shoulder','chest','hand','waist','legs','feet','cloak','offhand'];

  function def(it){
    if (!it) return null;
    if (typeof it === 'string') return DATA.items[it] || null;
    if (it.gen) return it;            // 生成实例自带定义
    return DATA.items[it.id] || it;   // 固定物品
  }
  function rand(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
  function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

  // 根据等级与幸运随机出品质（调难：高品质显著收紧，幸运主要提升中低档）
  function rollQuality(level, luck){
    luck = luck||0;
    const r = Math.random()*100;
    if (r < 0.4 + luck*0.10) return 'dark';   // BOSS(luck25)≈2.9% 暗金（原26%）
    if (r < 3   + luck*0.32) return 'gold';   // BOSS≈11% 黄金
    if (r < 14  + luck*0.70) return 'silver'; // BOSS≈31.5% 白银
    if (r < 48  + luck*0.40) return 'bronze';
    return 'white';
  }

  const TYPED_ARMOR = ['head','shoulder','chest','hand','waist','legs','feet','cloak'];
  const V = () => 0.86 + Math.random()*0.28;   // 数值浮动 ±14%

  // 生成一件装备（无花哨词缀；按类型限职业；数值上下浮动）
  // opts: {slot, quality, luck, weaponType, armorType, forClass(掉落时偏向该职业可用)}
  function gen(level, opts){
    opts = opts || {};
    const slot = opts.slot || pick(['weapon','head','shoulder','chest','hand','waist','legs','feet','cloak','neck','ring1','trinket']);
    const quality = opts.quality || rollQuality(level, opts.luck||0);
    const mul = QMUL[quality] || 1;
    const stats = {};
    const it = { gen:true, uid:'g'+rand(100000,999999), slot, quality, reqLevel: Math.max(1, level - rand(0,2)),
      value: Math.max(2, Math.round((level*2+6)*mul)), sockets: (DATA.qualities[quality]||{}).sockets||0, gems:[], plus:0 };
    const bias = opts.forClass && DATA.classGear[opts.forClass];

    if (slot === 'weapon'){
      let wt = opts.weaponType;
      if (!wt){ const th=opts.theme;
        if (th && th.weapons && th.weapons.length && Math.random()<0.45) wt = pick(th.weapons);
        else if (bias && Math.random()<0.6) wt = pick(bias.weapons);
        else wt = pick(Object.keys(DATA.weaponTypes)); }
      it.weaponType = wt; it.type = DATA.weaponTypes[wt];
      const p = (6 + level*2.2) * mul;
      stats.atk = Math.round(p * V()); stats.sp = Math.round(p*0.9 * V());
      const ws = DATA.weaponStat[wt]; if(ws) stats[ws] = Math.max(1, Math.round((2+level*0.4)*mul*V()));
      if (quality!=='white' && Math.random()<0.5) stats.crit = Math.max(1, Math.round((1+level*0.05)*mul*V()));
      it.name = DATA.qualityWord[quality] + DATA.weaponTypes[wt];
    } else if (TYPED_ARMOR.includes(slot)){
      let at = opts.armorType;
      if (!at){ const th=opts.theme;
        if (th && th.armor && Math.random()<0.45) at = th.armor;
        else if (bias && Math.random()<0.6) at = bias.armor;
        else at = pick(Object.keys(DATA.armorTypes)); }
      it.armorType = at; it.type = DATA.armorTypes[at];
      stats.armor = Math.round((4+level*1.7)*mul*V()); stats.sta = Math.round((1+level*0.4)*mul*V());
      const as = DATA.armorStat[at]; if(as) stats[as] = Math.max(1, Math.round((1+level*0.35)*mul*V()));
      it.name = DATA.qualityWord[quality] + DATA.armorWord[at] + DATA.armorSlotName[slot];
    } else {
      // 副手/项链/戒指/勋章：不限职业
      it.type = DATA.slots[slot] || '饰品';
      stats.crit = Math.max(1, Math.round((1+level*0.06)*mul*V()));
      const attr = pick(['str','agi','int','sta','spi']); stats[attr] = Math.max(1, Math.round((1+level*0.4)*mul*V()));
      if (slot==='offhand'){ stats.armor = Math.round((3+level*1.0)*mul*V()); stats.sp = Math.round((3+level*1.0)*mul*V()); }
      it.name = DATA.qualityWord[quality] + (DATA.accSlotName[slot]||'饰品');
    }
    it.stats = stats;
    return it;
  }

  window.Items = { def, gen, rollQuality, QMUL, ARMOR_SLOTS, TYPED_ARMOR };
})();
