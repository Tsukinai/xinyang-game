/* dungeons.js —— 副本
 * {id,name,cityId,levelRange:[lo,hi],icon,desc, waves:[monsterId...], boss:monsterId,
 *  firstClear:{xp,gold,items:[{id,qty}]}, story?}
 * 难度：DATA.difficulties，scales hp/atk/reward/dropLuck
 */
window.DATA = window.DATA || {};

DATA.difficulties = {
  easy:   { key:'easy',   name:'简单', hp:0.7, atk:0.8, reward:0.7, luck:0 },
  normal: { key:'normal', name:'普通', hp:1.0, atk:1.0, reward:1.0, luck:0 },
  hard:   { key:'hard',   name:'困难', hp:1.5, atk:1.3, reward:1.6, luck:10 },
  master: { key:'master', name:'高手', hp:1.9, atk:1.45, reward:2.1, luck:18, minClear:1 },
  expert: { key:'expert', name:'专家级', hp:2.4, atk:1.65, reward:2.9, luck:32, minClear:1 },
};

DATA.dungeons = {
  d_tomb:{ id:'d_tomb', name:'勇士墓穴', cityId:'tracker', levelRange:[3,6], icon:'⚰️',
    desc:'特拉克小镇外的古老墓穴，新手试炼。', waves:['rat','wildcat','bull'], boss:'bulllord',
    firstClear:{ xp:300, gold:30, items:[{id:'potion_hp_m',qty:3}] } },
  d_treant:{ id:'d_treant', name:'树妖林', cityId:'hilton', levelRange:[10,15], icon:'🌳',
    story:'格林兰长老会招募勇士进入树妖林，杀掉为害最深的失控树妖王，夺回伊恩帕特之笛。',
    desc:'郁郁葱葱却杀机四伏的丛林。专家级可触发树妖放牧者剧情。',
    waves:['treant','treant','darkelf','treant_herd'], boss:'treant_king',
    firstClear:{ xp:2500, gold:120, items:[{id:'courage_armor',qty:1},{id:'lucky_gem',qty:2}] } },
  d_sogot:{ id:'d_sogot', name:'索哥特壁垒', cityId:'sogot', levelRange:[13,18], icon:'🏛️',
    story:'黑暗年代古城索哥特，城主赛里斯托特死后化为亡灵领主，金字塔中黄金棺木长眠。',
    desc:'纳特兰沼泽中的黑暗年代古城。', waves:['skeleton_g','skeleton_g','swamp_undead'], boss:'serisotot',
    firstClear:{ xp:4000, gold:200, items:[{id:'feather_step',qty:1}] } },
  d_soth:{ id:'d_soth', name:'索斯山谷', cityId:'eternal', levelRange:[22,26], icon:'🏔️',
    desc:'月光林地深处的低级副本群，狼人布索盘踞。', waves:['moonbear','moonbear','golem'], boss:'werewolf',
    firstClear:{ xp:6000, gold:300, items:[{id:'lucky_gem',qty:3}] } },
  d_eternal:{ id:'d_eternal', name:'永恒之城开荒', cityId:'eternal', levelRange:[38,44], icon:'🏚️',
    desc:'地精机械的远古废墟，开荒难度极高。', waves:['golem','goblin_cut','goblin_cut'], boss:'goldworm',
    firstClear:{ xp:20000, gold:800, items:[{id:'gem_crit',qty:1},{id:'lucky_gem',qty:3}] } },
  d_crystal:{ id:'d_crystal', name:'水晶洞窟', cityId:'element', levelRange:[48,54], icon:'💎',
    story:'地穴领主贝内特为蜘蛛女皇菲娜斯守护着通灵之物，吸收其不灭精魂可开通往地底的黑暗传送门。',
    desc:'幽深水晶洞穴，地穴领主之巢。', waves:['spider','spider','abak_heir'], boss:'benet',
    firstClear:{ xp:50000, gold:1500, items:[{id:'gem_int',qty:1},{id:'lucky_gem',qty:4}] } },
  d_goldmine:{ id:'d_goldmine', name:'黄金之城地底矿洞', cityId:'element', levelRange:[58,64], icon:'⛏️',
    desc:'熔炉铁匠把守的地底矿洞，祭炼之火含黑暗腐蚀。', waves:['goblin_cut','goblin_cut','plague'], boss:'furnace',
    firstClear:{ xp:90000, gold:2500, items:[{id:'gem_crit',qty:2}] } },
  d_arena:{ id:'d_arena', name:'尼兰斗兽场', cityId:'element', levelRange:[68,74], icon:'🏟️',
    story:'尼兰斗兽场被邪恶盗贼光顾，关押人质索要赎金——大盗贼转职任务的舞台。',
    desc:'销金窟斗兽场，邪恶盗贼领主盘踞。', waves:['evil_rogue','plague','plague'], boss:'evil_rogue',
    firstClear:{ xp:160000, gold:5000, items:[{id:'lucky_gem',qty:5},{id:'gem_agi',qty:2}] } },
};
