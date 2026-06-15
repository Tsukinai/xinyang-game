/* content_pack.js —— 内容扩充包 #1：中段（Lv12-40）区域/怪物/副本/可刷套装/任务链
 * 借鉴常见网游：累进任务链 + 部位散件可刷套装（集齐给特殊属性+套装技能）。
 * 必须在 balance.js / loot.js 之前加载：新怪物的 hp/atk 由 balance 规整、掉落表由 loot 生成。
 * 怪物 hp/atk 仅作占位（balance.js 按 level/type 覆盖），关键是 level / type / drops / skills。
 */
window.DATA = window.DATA || {};

// ============ 套装技能（任意职业可用，集齐套装习得） ============
Object.assign(DATA.skills, {
  set_pc_a:{name:'劫掠冲锋',icon:'🐗',type:'active',reqLevel:1,mpCost:24,cooldown:4,
    desc:'套装技能：野蛮冲撞，造成 240% 伤害并吸取生命。',effect:{kind:'damage',mult:2.4,lifesteal:0.2}},
  set_pc_b:{name:'墓园哀嚎',icon:'💀',type:'active',reqLevel:1,mpCost:34,cooldown:5,
    desc:'套装技能：亡者哀嚎震慑目标，260% 伤害并眩晕 1 回合。',effect:{kind:'stun',mult:2.6,stunTurns:1}},
  set_abak:{name:'独裁者威压',icon:'👑',type:'active',reqLevel:1,mpCost:46,cooldown:5,
    desc:'套装技能：独裁者的威压三连重击，必定暴击。',effect:{kind:'multi',hits:3,mult:1.6,guaranteedCrit:true}},
});

// ============ 套装散件 + 材料（饰品不限职业，人人可凑） ============
Object.assign(DATA.items, {
  // —— 兽王劫掠者套（Lv14，白银，3件饰品）——
  pc_a_ring:{name:'劫掠者铁戒',slot:'ring1',quality:'silver',type:'饰品',reqLevel:14,value:120,icon:'💍',
    stats:{agi:8,str:6,atk:16,crit:3},set:'set_pc_a',desc:'兽王劫掠者套·组件。'},
  pc_a_neck:{name:'劫掠者兽牙项链',slot:'neck',quality:'silver',type:'饰品',reqLevel:14,value:120,icon:'📿',
    stats:{atk:18,sta:6,hp:140},set:'set_pc_a',desc:'兽王劫掠者套·组件。'},
  pc_a_seal:{name:'劫掠者战徽',slot:'trinket',quality:'silver',type:'饰品',reqLevel:14,value:120,icon:'🎖️',
    stats:{atk:14,crit:4,hp:80},set:'set_pc_a',desc:'兽王劫掠者套·组件。'},
  // —— 墓园守望套（Lv26，黄金，4件饰品）——
  pc_b_ring:{name:'守望者骨戒',slot:'ring1',quality:'gold',type:'饰品',reqLevel:26,value:240,icon:'💍',
    stats:{agi:12,int:12,crit:4},set:'set_pc_b',desc:'墓园守望套·组件。'},
  pc_b_neck:{name:'守望者寒玉坠',slot:'neck',quality:'gold',type:'饰品',reqLevel:26,value:240,icon:'📿',
    stats:{sta:14,armor:40,hp:300},set:'set_pc_b',desc:'墓园守望套·组件。'},
  pc_b_seal:{name:'守望者徽记',slot:'trinket',quality:'gold',type:'饰品',reqLevel:26,value:240,icon:'🎖️',
    stats:{atk:30,sp:30,crit:5},set:'set_pc_b',desc:'墓园守望套·组件。'},
  pc_b_orb:{name:'守望者魂灯',slot:'offhand',quality:'gold',type:'法器',reqLevel:26,value:240,icon:'🏮',
    stats:{sp:40,armor:50,hp:200},set:'set_pc_b',desc:'墓园守望套·组件。'},
  // —— 独裁者阿巴克套（Lv50，传奇；abak_hand 见 items.js）——
  abak_ring:{name:'独裁者·权戒',slot:'ring1',quality:'legend',type:'饰品',reqLevel:50,value:0,icon:'💍',
    stats:{str:24,sta:24,atk:50,crit:6},set:'abak',desc:'独裁者阿巴克套装组件之一。'},
  abak_amulet:{name:'独裁者·王权项链',slot:'neck',quality:'legend',type:'饰品',reqLevel:50,value:0,icon:'📿',
    stats:{sta:36,armor:120,atk:30,hp:800},set:'abak',desc:'独裁者阿巴克套装组件之一。'},
  abak_seal:{name:'独裁者·暴君之印',slot:'trinket',quality:'legend',type:'饰品',reqLevel:50,value:0,icon:'🏵️',
    stats:{atk:70,crit:9,hp:500},set:'abak',desc:'独裁者阿巴克套装组件之一。'},
  // —— 材料 ——
  plague_sample:{name:'瘟疫脓样',type:'材料',quality:'white',value:4,stackable:true,icon:'🧫',desc:'瘟疫沼泽生物身上提取，医师与炼金师急需。'},
  orc_totem:{name:'兽人图腾碎片',type:'材料',quality:'white',value:5,stackable:true,icon:'🪅',desc:'兽人萨满的图腾碎片。'},
});

// ============ 套装定义（集齐给特殊属性 + 套装技能） ============
Object.assign(DATA.sets, {
  set_pc_a:{ name:'兽王劫掠者套', pieces:['pc_a_ring','pc_a_neck','pc_a_seal'],
    bonus:{ 2:{ stats:{atk:30,hp:200}, desc:'集齐2件：攻击+30 生命+200' },
            3:{ stats:{atk:50,crit:6,hp:400}, skill:'set_pc_a', desc:'集齐3件：攻击+50 暴击+6 生命+400；习得【劫掠冲锋】' } } },
  set_pc_b:{ name:'墓园守望套', pieces:['pc_b_ring','pc_b_neck','pc_b_seal','pc_b_orb'],
    bonus:{ 2:{ stats:{hp:300,crit:4}, desc:'集齐2件：生命+300 暴击+4' },
            3:{ stats:{atk:40,sp:40,hp:500}, desc:'集齐3件：攻击/法强+40 生命+500' },
            4:{ stats:{atk:70,sp:70,crit:8,hp:900}, skill:'set_pc_b', desc:'集齐4件：攻击/法强+70 暴击+8 生命+900；习得【墓园哀嚎】' } } },
});
// abak 重做：原 8 件死内容 → 4 件可凑（3 饰品全职业 + 1 板甲手），技能在 3 件触发
DATA.sets.abak = { name:'独裁者阿巴克套装', pieces:['abak_ring','abak_amulet','abak_seal','abak_hand'],
  bonus:{ 2:{ stats:{atk:60,armor:80,hp:500}, desc:'集齐2件：攻击+60 护甲+80 生命+500' },
          3:{ stats:{atk:120,crit:10,hp:1200}, skill:'set_abak', desc:'集齐3件：攻击+120 暴击+10 生命+1200；习得【独裁者威压】' },
          4:{ stats:{atk:200,sta:60,armor:200,hp:2000}, desc:'集齐4件·大成：全属性飞跃' } } };

// ============ 新怪物（Lv12-40） ============
Object.assign(DATA.monsters, {
  // 希尔顿围城前线 Lv12-18
  pc_orc_raider: M({id:'pc_orc_raider',name:'兽人劫掠者',level:12,hp:520,atk:50,icon:'🪓',skills:['e_cleave'],
    drops:[{item:'orc_totem',chance:0.4},{item:'potion_hp_m',chance:0.15}],desc:'围攻希尔顿要塞的兽人前锋。'}),
  pc_goblin_sapper: M({id:'pc_goblin_sapper',name:'哥布林爆破手',level:13,hp:480,atk:58,icon:'🧨',skills:['e_heavy'],
    drops:[{item:'iron_ore',chance:0.4},{item:'orc_totem',chance:0.3}],desc:'背着火药桶的哥布林。'}),
  pc_siege_wolf: M({id:'pc_siege_wolf',name:'攻城炼狱犬',level:14,hp:560,atk:62,icon:'🐺',skills:['e_stun'],
    drops:[{item:'potion_hp_m',chance:0.2}],desc:'兽人驱使的巨型炼狱犬。'}),
  pc_orc_shaman: M({id:'pc_orc_shaman',name:'兽人萨满',level:15,hp:540,atk:66,icon:'🧙',skills:['e_curse'],
    drops:[{item:'orc_totem',chance:0.6},{item:'potion_mp_m',chance:0.25}],desc:'施放诅咒图腾的兽人术士。'}),
  pc_orc_warlord: M({id:'pc_orc_warlord',name:'兽人战领·古洛尔',level:16,type:'elite',hp:3600,atk:90,icon:'👹',skills:['e_roar','e_cleave'],
    drops:[{item:'pc_a_ring',chance:0.14},{item:'pc_a_seal',chance:0.12},{item:'potion_hp_l',chance:0.5}],desc:'统领围城兽人的战领，劫掠者套碎片的守护者。'}),
  pc_siege_golem: M({id:'pc_siege_golem',name:'攻城魔像',level:18,type:'boss',hp:9000,atk:120,icon:'🗿',skills:['e_stun','e_heavy'],
    drops:[{item:'pc_a_neck',chance:0.35},{item:'lucky_gem',chance:0.25},{item:'potion_hp_l',chance:1.0}],desc:'兽人以亡魂驱动的攻城巨像。'}),
  // 永恒墓园 Lv22-28
  pc_grave_ghoul: M({id:'pc_grave_ghoul',name:'墓园食尸鬼',level:23,hp:1100,atk:96,icon:'🧟',skills:['e_poison'],
    drops:[{item:'bandage',chance:0.3}],desc:'啃食尸骸的食尸鬼。'}),
  pc_bone_archer: M({id:'pc_bone_archer',name:'白骨射手',level:24,hp:1050,atk:104,icon:'🏹',skills:['e_heavy'],
    drops:[{item:'potion_hp_m',chance:0.25}],desc:'墓园上空游弋的骷髅弓手。'}),
  pc_wraith: M({id:'pc_wraith',name:'怨魂',level:25,hp:1200,atk:112,icon:'👻',skills:['e_curse'],
    drops:[{item:'gem_int',chance:0.05},{item:'potion_mp_m',chance:0.3}],desc:'墓园中不散的怨灵。'}),
  pc_crypt_knight: M({id:'pc_crypt_knight',name:'墓穴骑士',level:27,type:'elite',hp:7200,atk:150,icon:'⚔️',skills:['e_cleave','e_stun'],
    drops:[{item:'pc_b_ring',chance:0.1},{item:'pc_b_seal',chance:0.08},{item:'potion_hp_l',chance:0.5}],desc:'永恒墓园的不死骑士，守望者套碎片的持有者。'}),
  pc_lich_acolyte: M({id:'pc_lich_acolyte',name:'巫妖侍祭',level:28,type:'boss',hp:14000,atk:175,icon:'☠️',skills:['e_curse','e_heavy'],
    drops:[{item:'pc_b_neck',chance:0.3},{item:'pc_b_orb',chance:0.2},{item:'lucky_gem',chance:0.3}],desc:'侍奉巫妖的祭司，掌控墓园亡灵。'}),
  // 瘟疫沼泽深处 Lv33-40
  pc_plague_rat: M({id:'pc_plague_rat',name:'瘟疫鼠群',level:33,hp:1800,atk:150,icon:'🐀',skills:['e_poison'],
    drops:[{item:'plague_sample',chance:0.5}],desc:'携带瘟疫的鼠群。'}),
  pc_rot_treant: M({id:'pc_rot_treant',name:'腐烂树人',level:35,hp:2100,atk:165,icon:'🌳',skills:['e_poison','e_heavy'],
    drops:[{item:'plague_sample',chance:0.4},{item:'treant_bark',chance:0.4}],desc:'被瘟疫侵蚀的树人。'}),
  pc_swamp_hag: M({id:'pc_swamp_hag',name:'沼泽巫媪',level:37,type:'elite',hp:11000,atk:210,icon:'🧙‍♀️',skills:['e_curse','e_poison'],
    drops:[{item:'plague_sample',chance:0.8},{item:'pc_b_seal',chance:0.06},{item:'potion_hp_l',chance:0.6}],desc:'沼泽深处熬制瘟疫的老巫媪。'}),
  pc_plague_lord: M({id:'pc_plague_lord',name:'瘟疫领主·腐殁',level:40,type:'boss',hp:30000,atk:300,icon:'🦠',skills:['e_poison','e_curse','e_heavy'],
    drops:[{item:'pc_b_orb',chance:0.3},{item:'abak_ring',chance:0.05},{item:'plague_sample',chance:1.0},{item:'lucky_gem',chance:0.4}],desc:'瘟疫沼泽的源头，腐烂与疫病的化身。'}),
});

// ============ 新区域 ============
Object.assign(DATA.zones, {
  pc_z_siege:{ id:'pc_z_siege', name:'希尔顿围城前线', cityId:'hilton', levelRange:[12,16], icon:'⚔️',
    desc:'兽人大军压境的城墙前线，劫掠者与攻城兽潮水般涌来。',
    encounters:[{m:'pc_orc_raider',w:5},{m:'pc_goblin_sapper',w:4},{m:'pc_siege_wolf',w:3},{m:'pc_orc_shaman',w:2}],
    rare:[{m:'pc_orc_warlord',chance:0.05}] },
  pc_z_cemetery:{ id:'pc_z_cemetery', name:'永恒墓园', cityId:'eternal', levelRange:[22,28], icon:'⚰️',
    desc:'永恒之城外的巨大墓园，亡者夜夜复苏。',
    encounters:[{m:'pc_grave_ghoul',w:5},{m:'pc_bone_archer',w:4},{m:'pc_wraith',w:3}],
    rare:[{m:'pc_crypt_knight',chance:0.05}] },
  pc_z_plague_deep:{ id:'pc_z_plague_deep', name:'瘟疫沼泽深处', cityId:'sogot', levelRange:[33,40], icon:'🟢',
    desc:'特索依镇外瘟疫沼泽的腹地，疫气弥漫、寸草不生。',
    encounters:[{m:'pc_plague_rat',w:5},{m:'pc_rot_treant',w:4}],
    rare:[{m:'pc_swamp_hag',chance:0.05}] },
});

// ============ 新副本 ============
Object.assign(DATA.dungeons, {
  pc_d_siege:{ id:'pc_d_siege', name:'围城地道', cityId:'hilton', levelRange:[16,18], icon:'🛡️',
    desc:'兽人挖掘通往要塞地基的地道，尽头是亡魂驱动的攻城魔像。',
    waves:['pc_orc_raider','pc_goblin_sapper','pc_orc_shaman'], boss:'pc_siege_golem',
    firstClear:{xp:9000,gold:1200,items:[{id:'pc_a_neck',qty:1},{id:'lucky_gem',qty:2}]} },
  pc_d_plague:{ id:'pc_d_plague', name:'瘟疫源头·腐殁祭坛', cityId:'sogot', levelRange:[38,40], icon:'🧪',
    desc:'沼泽深处的祭坛，瘟疫领主腐殁在此散播疫病。',
    waves:['pc_plague_rat','pc_rot_treant','pc_swamp_hag'], boss:'pc_plague_lord',
    firstClear:{xp:60000,gold:6000,items:[{id:'pc_b_seal',qty:1},{id:'lucky_gem',qty:4}]} },
});

// ============ 任务链 ============
Object.assign(DATA.quests, {
  pc_q_siege1:{ id:'pc_q_siege1', name:'围城告急', type:'side', cityId:'hilton', giver:'城防官雷诺', reqLevel:12,
    desc:'兽人劫掠者正猛攻城墙，守军请你阵前杀敌。',
    objective:{kind:'kill',target:'pc_orc_raider',count:15,label:'击杀兽人劫掠者'},
    rewards:{xp:1600,gold:300,items:[{id:'pc_a_ring',qty:1}]} },
  pc_q_siege2:{ id:'pc_q_siege2', name:'地道惊魂', type:'side', cityId:'hilton', giver:'城防官雷诺', reqLevel:16, prereq:['pc_q_siege1'],
    desc:'兽人挖通了地道，深入清剿并摧毁尽头的攻城魔像。',
    objective:{kind:'clear',target:'pc_d_siege',label:'通关围城地道'},
    rewards:{xp:4000,gold:800,items:[{id:'pc_a_seal',qty:1}]} },
  pc_q_crypt:{ id:'pc_q_crypt', name:'墓园镇魂', type:'side', cityId:'eternal', giver:'守墓人格雷', reqLevel:24,
    desc:'永恒墓园怨魂作祟，超度它们以安亡灵。',
    objective:{kind:'kill',target:'pc_wraith',count:15,label:'超度怨魂'},
    rewards:{xp:9000,gold:1500,items:[{id:'pc_b_ring',qty:1}]} },
  pc_q_plague1:{ id:'pc_q_plague1', name:'疫样采集', type:'side', cityId:'sogot', giver:'医师布莱文斯', reqLevel:34,
    desc:'医师需要瘟疫脓样研制解药，从沼泽生物身上采集。',
    objective:{kind:'collect',target:'plague_sample',count:12,label:'瘟疫脓样'},
    rewards:{xp:14000,gold:2000,items:[{id:'potion_hp_l',qty:3}]} },
  pc_q_plague2:{ id:'pc_q_plague2', name:'斩断疫源', type:'side', cityId:'sogot', giver:'医师布莱文斯', reqLevel:40, prereq:['pc_q_plague1'],
    desc:'瘟疫源自祭坛上的领主腐殁，唯有将其铲除方能止疫。',
    objective:{kind:'clear',target:'pc_d_plague',label:'通关瘟疫源头'},
    rewards:{xp:40000,gold:5000,items:[{id:'pc_b_neck',qty:1},{id:'lucky_gem',qty:3}]} },
});

// ============ 挂接到城市 + 给既有 BOSS 补 abak 散件掉落 ============
(function(){
  const attach=(cityId, zones, dungeons, quests)=>{ const c=DATA.cities[cityId]; if(!c) return;
    if(zones) c.zones=(c.zones||[]).concat(zones);
    if(dungeons) c.dungeons=(c.dungeons||[]).concat(dungeons);
    if(quests) c.quests=(c.quests||[]).concat(quests);
  };
  attach('hilton', ['pc_z_siege'], ['pc_d_siege'], ['pc_q_siege1','pc_q_siege2']);
  attach('eternal', ['pc_z_cemetery'], null, ['pc_q_crypt']);
  attach('sogot', ['pc_z_plague_deep'], ['pc_d_plague'], ['pc_q_plague1','pc_q_plague2']);
  // 既有阿巴克相关怪物补充散件掉落，让 4 件套真正可凑齐
  const pushDrop=(mid, item, ch)=>{ const m=DATA.monsters[mid]; if(m){ m.drops=m.drops||[]; m.drops.push({item, chance:ch}); } };
  pushDrop('abak_heir','abak_ring',0.08);
  pushDrop('aina','abak_amulet',0.15);
  pushDrop('aina2','abak_amulet',0.4); pushDrop('aina2','abak_seal',0.4); pushDrop('aina2','abak_ring',0.3);
})();
