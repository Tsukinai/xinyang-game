/* monsters.js —— 怪物库 + 敌方技能
 * 怪物契约：{id,name,level,hp,atk,def,xp,goldMin,goldMax,icon,type('normal'|'elite'|'boss'),
 *   skills:[skillId],drops:[{item,chance,qtyMin?,qtyMax?}],desc}
 */
window.DATA = window.DATA || {};

// 敌方技能（供怪物引用，combat 读取 effect.mult / stunTurns）
Object.assign(DATA.skills, {
  e_cleave:{name:'横扫',effect:{mult:1.5}},
  e_heavy:{name:'重击',effect:{mult:1.8}},
  e_stun:{name:'猛撞',effect:{mult:1.2,stunTurns:1}},
  e_poison:{name:'毒液',effect:{mult:1.3}},
  e_curse:{name:'诅咒',effect:{mult:1.4}},
  e_roar:{name:'狂暴怒吼',effect:{mult:1.6,stunTurns:1}},
});

function M(o){ // 便捷构造，补默认
  o.type = o.type||'normal';
  o.def = o.def!=null?o.def:Math.round(o.level*1.4);
  o.xp = o.xp!=null?o.xp:Math.round((o.level*6+8)*(o.type==='boss'?12:o.type==='elite'?4:1));
  o.goldMin = o.goldMin!=null?o.goldMin:Math.round(o.level*0.6);
  o.goldMax = o.goldMax!=null?o.goldMax:Math.round(o.level*1.6)+2;
  o.skills = o.skills||[];
  o.drops = o.drops||[];
  return o;
}

DATA.monsters = {
  // ---- 卡罗尔草原 Lv1-9 ----
  rat:        M({id:'rat',name:'银灰巨鼠',level:1,hp:55,atk:7,icon:'🐀',drops:[{item:'rat_tail',chance:0.6},{item:'rat_skull',chance:0.4}],desc:'特拉克小镇郊外成群出没的灰鼠。'}),
  wildcat:    M({id:'wildcat',name:'野猫',level:2,hp:80,atk:11,icon:'🐈',drops:[{item:'potion_hp_s',chance:0.1}],desc:'草原上的野猫，动作敏捷。'}),
  bat:        M({id:'bat',name:'吸血蝙蝠',level:3,hp:95,atk:14,icon:'🦇',drops:[{item:'bat_tooth',chance:0.7,qtyMin:1,qtyMax:2}],desc:'摩多小镇附近成片的蝙蝠，牙齿被铁匠卡迪收购。'}),
  bull:       M({id:'bull',name:'野牛',level:4,hp:140,atk:18,icon:'🐂',drops:[{item:'potion_hp_s',chance:0.15}],desc:'体格壮硕的草原野牛。'}),
  bulllord:   M({id:'bulllord',name:'野牛头领',level:6,hp:520,atk:30,type:'elite',skills:['e_stun'],icon:'🐃',drops:[{item:'potion_hp_m',chance:0.4},{item:'iron_ore',chance:0.5}],desc:'牛群首领，越级击杀经验丰厚。'}),
  wizard_f:   M({id:'wizard_f',name:'沉沦巫师',level:5,hp:170,atk:22,icon:'🧙',skills:['e_curse'],drops:[{item:'herb',chance:0.3},{item:'potion_mp_s',chance:0.2}],desc:'林克小镇外沉沦巫师营地的法师。'}),
  deerlord:   M({id:'deerlord',name:'角鹿头领',level:7,hp:680,atk:34,type:'elite',icon:'🦌',drops:[{item:'weaver_ring',chance:0.05}],desc:'林间角鹿之王。'}),
  lion:       M({id:'lion',name:'狮王卡多',level:7,hp:900,atk:40,type:'elite',skills:['e_roar'],icon:'🦁',drops:[{item:'potion_hp_m',chance:0.5}],desc:'草原狮群之王，凶猛异常。'}),
  eel:        M({id:'eel',name:'黄金电鳗',level:8,hp:1200,atk:46,type:'boss',skills:['e_stun'],icon:'🐍',drops:[{item:'lucky_gem',chance:0.3},{item:'potion_hp_l',chance:0.6}],desc:'然多湖中的黄金电鳗，能放电麻痹。'}),
  murloc:     M({id:'murloc',name:'鱼人',level:8,hp:240,atk:30,icon:'🐟',skills:['e_poison'],drops:[{item:'murloc_fin',chance:0.6}],desc:'娜迦后代，鱼身人肢，以鱼叉为武器。'}),
  spider:     M({id:'spider',name:'岩石蜘蛛',level:9,hp:270,atk:34,icon:'🕷️',skills:['e_poison'],drops:[{item:'weaver_ring',chance:0.06},{item:'fine_silk',chance:0.3}],desc:'岩石蜘蛛洞穴里的剧毒蜘蛛。'}),

  // ---- 树妖林 / 希尔顿 Lv10-15 ----
  treant:     M({id:'treant',name:'树妖',level:10,hp:340,atk:40,icon:'🌲',drops:[{item:'treant_bark',chance:0.5}],desc:'失控的树妖，原本与人类和睦。'}),
  treant_herd:M({id:'treant_herd',name:'树妖放牧者',level:12,hp:900,atk:52,type:'elite',skills:['e_cleave'],icon:'🌳',drops:[{item:'treant_bark',chance:0.8}],desc:'树妖林的守护者伊恩帕特之同类。'}),
  darkelf:    M({id:'darkelf',name:'黑精灵卓尔',level:12,hp:480,atk:56,icon:'🧝',skills:['e_poison'],drops:[{item:'potion_mp_m',chance:0.3}],desc:'偷走伊恩帕特之笛的卓尔部落黑精灵。'}),
  treant_king:M({id:'treant_king',name:'失控树妖王',level:15,hp:10000,atk:80,type:'boss',skills:['e_cleave','e_roar'],icon:'🌳',drops:[{item:'courage_armor',chance:0.5},{item:'lucky_gem',chance:0.6}],desc:'被黑精灵之笛操控、为害最深的树妖王。'}),
  skeleton_g: M({id:'skeleton_g',name:'骷髅角斗士',level:10,hp:1500,atk:60,type:'elite',icon:'💀',drops:[{item:'iron_ore',chance:0.6}],desc:'关在索哥特竞技场地牢中的龙族角斗士尸骨。'}),
  serisotot:  M({id:'serisotot',name:'亡灵·赛里斯托特',level:15,hp:50000,atk:100,type:'boss',skills:['e_curse','e_heavy'],icon:'☠️',drops:[{item:'feather_step',chance:0.3},{item:'lucky_gem',chance:0.8}],desc:'黑暗年代索哥特城主，死后埋于金字塔黄金棺，化为亡灵领主。'}),

  // ---- 永恒之城 / 月光 Lv20-30 ----
  golem:      M({id:'golem',name:'机械魔偶',level:20,hp:620,atk:78,icon:'🤖',skills:['e_heavy'],drops:[{item:'iron_ore',chance:0.7}],desc:'永恒之城里成群游荡的地精机械魔偶。'}),
  moonbear:   M({id:'moonbear',name:'月熊',level:22,hp:760,atk:88,icon:'🐻',skills:['e_roar'],drops:[{item:'potion_hp_l',chance:0.3}],desc:'索尼娅月光林地的栖居野兽。'}),
  werewolf:   M({id:'werewolf',name:'巡回者狼人布索',level:24,hp:6000,atk:120,type:'boss',skills:['e_cleave','e_poison'],icon:'🐺',drops:[{item:'lucky_gem',chance:0.7}],desc:'索斯山谷副本最终BOSS，惊怖剧毒。'}),
  abak_heir:  M({id:'abak_heir',name:'亚伯拉罕的后裔',level:25,hp:4200,atk:130,type:'elite',skills:['e_curse'],icon:'🧛',drops:[{item:'gem_int',chance:0.4}],desc:'守护亚伯拉罕水晶棺的吸血鬼后裔。'}),

  // ---- 沼泽 / 瘟疫 Lv30-45 ----
  swamp_undead:M({id:'swamp_undead',name:'沼泽亡魂',level:32,hp:980,atk:150,icon:'👻',skills:['e_curse'],drops:[{item:'herb',chance:0.4}],desc:'纳特兰沼泽里的怨灵。'}),
  plague:     M({id:'plague',name:'瘟疫行尸',level:35,hp:1200,atk:170,icon:'🧟',skills:['e_poison'],drops:[{item:'potion_hp_l',chance:0.25}],desc:'特索依瘟疫镇外终日不愈的行尸。'}),
  goldworm:   M({id:'goldworm',name:'黄金地龙',level:40,hp:60000,atk:260,type:'boss',skills:['e_heavy','e_roar'],icon:'🐉',drops:[{item:'lucky_gem',chance:0.9},{item:'gem_crit',chance:0.4}],desc:'恶魔化的野外领主，黄金鳞甲坚不可摧。'}),
  goblin_cut: M({id:'goblin_cut',name:'地精切割者',level:40,hp:5000,atk:240,type:'elite',skills:['e_cleave'],icon:'⚙️',drops:[{item:'iron_ore',chance:0.8}],desc:'永恒之城开荒副本的地精精英。'}),

  // ---- 高级 Lv50-70 ----
  benet:      M({id:'benet',name:'地穴领主贝内特',level:50,hp:120000,atk:360,type:'boss',skills:['e_curse','e_heavy'],icon:'🕸️',drops:[{item:'gem_crit',chance:0.6},{item:'lucky_gem',chance:1.0}],desc:'水晶洞窟之主，对蜘蛛女皇菲娜斯怀有卑微的爱情。'}),
  banim:      M({id:'banim',name:'暗黑海妖班尼姆',level:50,hp:90000,atk:340,type:'boss',skills:['e_stun','e_curse'],icon:'🧜',drops:[{item:'gem_int',chance:0.6}],desc:'海妖之歌能令听者沉睡。'}),
  furnace:    M({id:'furnace',name:'熔炉铁匠',level:60,hp:160000,atk:460,type:'boss',skills:['e_heavy','e_roar'],icon:'🔨',drops:[{item:'lucky_gem',chance:1.0},{item:'gem_crit',chance:0.7}],desc:'黄金之城地底矿洞最终BOSS，祭炼之火含黑暗腐蚀。'}),
  aina:       M({id:'aina',name:'游魂公主艾娜',level:60,hp:200000,atk:480,type:'boss',skills:['e_curse','e_heavy'],icon:'👸',drops:[{item:'abak_hand',chance:0.2},{item:'lucky_gem',chance:1.0}],desc:'科林戈壁的游魂公主，越杀越强，最终化为恶魔化领主。'}),
  evil_rogue: M({id:'evil_rogue',name:'邪恶盗贼领主',level:70,hp:240000,atk:560,type:'boss',skills:['e_poison','e_stun'],icon:'🥷',drops:[{item:'lucky_gem',chance:1.0},{item:'gem_agi',chance:0.7}],desc:'尼兰斗兽场的邪恶盗贼领主，大盗贼转职任务目标。'}),
};
