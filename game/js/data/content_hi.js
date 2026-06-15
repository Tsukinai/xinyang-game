/* content_hi.js —— 高等级 / 多帝国内容（Lv70-200）
 * 复用 monsters.js 的全局 M() 构造器。扩充 怪物/区域/副本/城市/主线 与终局 raid。
 */
window.DATA = window.DATA || {};

// ================= 高级怪物 =================
Object.assign(DATA.monsters, {
  goblin_ig:   M({id:'goblin_ig',name:'矿奴伊格林',level:90,hp:900000,atk:780,type:'boss',skills:['e_heavy','e_roar'],icon:'🦾',drops:[{item:'lucky_gem',chance:1},{item:'gem_crit',chance:0.8}],desc:'黄金之城九十级六臂金甲巨人领主。'}),
  silverwing:  M({id:'silverwing',name:'魔裔银翼',level:110,hp:8000,atk:900,type:'elite',skills:['e_poison','e_cleave'],icon:'🦇',drops:[{item:'lucky_gem',chance:0.4}],desc:'魔裔部落顶级职业银翼，敏捷奔袭速战速决。'}),
  blackserp:   M({id:'blackserp',name:'沼泽黑蛇',level:120,hp:14000,atk:1100,icon:'🐍',skills:['e_poison'],drops:[{item:'lucky_gem',chance:0.3}],desc:'荒冥沼泽的一百二十级黑蛇。'}),
  siren:       M({id:'siren',name:'海妖维丽娜',level:120,hp:3000000,atk:1300,type:'boss',skills:['e_curse','e_stun'],icon:'🧜',drops:[{item:'lucky_gem',chance:1}],desc:'海妖之歌令人沉睡的强化精英领主。'}),
  lich:        M({id:'lich',name:'巫妖王英索尔',level:130,hp:5000000,atk:1500,type:'boss',skills:['e_curse','e_heavy'],icon:'🧙‍♂️',drops:[{item:'lucky_gem',chance:1},{item:'gem_int',chance:1}],desc:'最接近神的亡灵法师，沉睡前藏匿全部宝藏。'}),
  sandgiant:   M({id:'sandgiant',name:'黄沙巨人',level:155,hp:60000,atk:1700,type:'elite',skills:['e_heavy'],icon:'🗿',drops:[{item:'lucky_gem',chance:0.5}],desc:'失落的巴特尔城刷新的黄沙巨人精英。'}),
  pharaoh:     M({id:'pharaoh',name:'法老布兰尼根',level:140,hp:6000000,atk:1800,type:'boss',skills:['e_curse','e_roar'],icon:'⚱️',drops:[{item:'lucky_gem',chance:1}],desc:'法纳斯法老墓地地宫之主。'}),
  aina2:       M({id:'aina2',name:'游魂公主艾娜·章鱼形态',level:150,hp:7000000,atk:2000,type:'boss',skills:['e_curse','e_heavy','e_stun'],icon:'🐙',drops:[{item:'abak_hand',chance:0.5},{item:'lucky_gem',chance:1}],desc:'变异成章鱼形态的一百五十级恶魔化领主，六百多万血。'}),
  dilakru:     M({id:'dilakru',name:'背叛者迪拉克鲁',level:180,hp:12000000,atk:2600,type:'boss',skills:['e_heavy','e_roar','e_curse'],icon:'😈',drops:[{item:'lucky_gem',chance:1}],desc:'被恶魔操控的一百八十级恶魔化领主，最后需帕特诺斯特战锤雷击绝杀。'}),
  upton:       M({id:'upton',name:'堕落天使厄普顿',level:200,hp:30000000,atk:3600,type:'boss',skills:['e_heavy','e_roar','e_curse'],icon:'👼',drops:[{item:'zennard_sword',chance:0.3},{item:'lucky_gem',chance:1}],desc:'世界壁垒终极BOSS，两百级恶魔化领主。'}),
  purpledragon:M({id:'purpledragon',name:'紫瞳地龙',level:200,hp:25000000,atk:3400,type:'boss',skills:['e_roar','e_heavy'],icon:'🐲',drops:[{item:'lucky_gem',chance:1}],desc:'命运河谷山崖洞窟的七只两百级变异领主之一，精通雷/土/精神系魔法。'}),
  corpse:      M({id:'corpse',name:'死亡平原腐尸',level:160,hp:30000,atk:1500,icon:'🧟',skills:['e_poison'],drops:[{item:'herb',chance:0.4}],desc:'死亡平原的腐尸，净化它们可积累圣者之心进度。'}),
  skel_army:   M({id:'skel_army',name:'亡灵复仇·骷髅兵',level:80,hp:1200,atk:600,icon:'💀',drops:[],desc:'冲出地底的骷髅大军，格林兰拯救任务目标。'}),
});

// ================= 高级区域 =================
Object.assign(DATA.zones, {
  z_orcmtn:{ id:'z_orcmtn', name:'兽王山脉', cityId:'saturn', levelRange:[70,90], icon:'⛰️',
    desc:'萨特恩兽人王城外的云雾山脉。', encounters:[{m:'silverwing',w:2},{m:'evil_rogue',w:1}], rare:[{m:'goblin_ig',chance:0.02}] },
  z_blackelf:{ id:'z_blackelf', name:'黑精灵部落集结地', cityId:'saturn', levelRange:[150,180], icon:'🕷️',
    desc:'每天清晨大量冒险者在此结队前往黑精灵部落。', encounters:[{m:'sandgiant',w:3},{m:'silverwing',w:2}], rare:[{m:'dilakru',chance:0.01}] },
  z_mireswamp:{ id:'z_mireswamp', name:'荒冥沼泽', cityId:'underdark', levelRange:[110,125], icon:'🐍',
    desc:'地底魔裔部落一侧的潮湿泥潭，黑蛇遍布。', encounters:[{m:'blackserp',w:5},{m:'silverwing',w:3}], rare:[{m:'lich',chance:0.01}] },
  z_deathplain:{ id:'z_deathplain', name:'死亡平原', cityId:'underdark', levelRange:[155,170], icon:'💀',
    desc:'地底深处的腐尸乐园，净化它们可积累「圣者之心」进度。', encounters:[{m:'corpse',w:6}], rare:[{m:'pharaoh',chance:0.01}] },
  z_doomvalley:{ id:'z_doomvalley', name:'末日峡谷', cityId:'caroll', levelRange:[80,100], icon:'🌑',
    desc:'格林兰北部边境，两大阵营猎杀的战场，中央有通往地底的入口。', encounters:[{m:'skel_army',w:4},{m:'silverwing',w:2}], rare:[{m:'goblin_ig',chance:0.02}] },
  z_dragoncliff:{ id:'z_dragoncliff', name:'命运河谷·龙崖', cityId:'element', levelRange:[190,200], icon:'🐲',
    desc:'七只两百级紫瞳地龙盘踞的山崖洞窟。', encounters:[{m:'sandgiant',w:2},{m:'corpse',w:2}], rare:[{m:'purpledragon',chance:0.02}] },
});

// ================= 高级副本 / 终局 raid =================
Object.assign(DATA.dungeons, {
  d_goldcity:{ id:'d_goldcity', name:'黄金之城·伊格林宝库', cityId:'element', levelRange:[88,95], icon:'🏛️',
    desc:'黄金之城内的宝库，六臂金甲巨人矿奴伊格林把守。', waves:['goblin_cut','goblin_cut','silverwing'], boss:'goblin_ig',
    firstClear:{xp:400000,gold:10000,items:[{id:'lucky_gem',qty:6}]} },
  d_lichtomb:{ id:'d_lichtomb', name:'巫妖王英索尔墓穴', cityId:'underdark', levelRange:[125,135], icon:'⚰️',
    story:'巫妖英索尔沉睡前藏匿全部宝藏并绘制加持咒语的藏宝图——传奇级寻宝。',
    desc:'地底亡灵帝国的巫妖墓穴。', waves:['blackserp','silverwing','corpse'], boss:'lich',
    firstClear:{xp:1500000,gold:40000,items:[{id:'lucky_gem',qty:10},{id:'gem_int',qty:2}]} },
  d_pharaoh:{ id:'d_pharaoh', name:'法纳斯法老墓地地宫', cityId:'saturn', levelRange:[110,145], icon:'🔺',
    desc:'萨特恩北部沙漠的法老地宫，游魂公主艾娜亦在此现身。', waves:['sandgiant','corpse','silverwing'], boss:'pharaoh',
    firstClear:{xp:1800000,gold:50000,items:[{id:'lucky_gem',qty:10}]} },
  d_battle:{ id:'d_battle', name:'失落的巴特尔城', cityId:'saturn', levelRange:[150,160], icon:'🏯',
    story:'地底密密麻麻的远古法师塔，魔法元素浓郁（魔法伤害+300%），游魂公主艾娜化为章鱼形态盘踞内城。',
    desc:'深埋黄沙之下、新近被开启的地底古城，黄沙巨人成群。', waves:['sandgiant','sandgiant','silverwing'], boss:'aina2',
    firstClear:{xp:3000000,gold:80000,items:[{id:'abak_hand',qty:1},{id:'lucky_gem',qty:12}]} },
  d_dragon:{ id:'d_dragon', name:'紫瞳地龙巢穴', cityId:'element', levelRange:[195,200], icon:'🐉',
    desc:'命运河谷山崖洞窟，七只两百级紫瞳地龙盘踞。', waves:['sandgiant','corpse','sandgiant'], boss:'purpledragon',
    firstClear:{xp:8000000,gold:200000,items:[{id:'lucky_gem',qty:20}]} },
  d_worldwall:{ id:'d_worldwall', name:'世界壁垒', cityId:'underdark', levelRange:[180,200], icon:'🌌',
    story:'原是大天使关押犯人之地，终极BOSS堕落天使厄普顿镇守。集齐力量者方可问鼎。',
    desc:'两大阵营公共区域的终局副本群。', waves:['dilakru','corpse','sandgiant'], boss:'upton',
    firstClear:{xp:15000000,gold:500000,items:[{id:'zennard_sword',qty:1},{id:'lucky_gem',qty:30}]} },
});

// ================= 充实后期城市 =================
(function(){
  const s=DATA.cities.saturn;
  s.zones=['z_orcmtn','z_blackelf']; s.dungeons=['d_pharaoh','d_battle'];
  s.quests=['q_assassin_heart','q_order_justice'];
  const u=DATA.cities.underdark;
  u.zones=['z_mireswamp','z_deathplain']; u.dungeons=['d_lichtomb','d_worldwall'];
  u.quests=['q_order_wisdom','q_holyheart'];
  const e=DATA.cities.element;
  e.zones.push('z_dragoncliff'); e.dungeons.push('d_goldcity','d_dragon');
  e.quests.push('q_main_abak','q_order_fairness');
  const c=DATA.cities.caroll;
  c.zones=['z_doomvalley']; c.quests.push('q_main_pope','q_undead_revenge');
})();

// ================= 主线续章 + 剩余秩序之章 =================
Object.assign(DATA.quests, {
  q_main_abak:{ id:'q_main_abak', name:'【主线】独裁者阿巴克套装', type:'main', cityId:'element', giver:'探索触发', reqLevel:60,
    desc:'共治年代独裁者阿巴克的八件神装散落人间。一次次击败游魂公主艾娜直至她恶魔化的章鱼形态，方能集齐组件，凑成180级传奇套装。',
    objective:{kind:'kill',target:'aina',count:3,label:'击败游魂公主艾娜'},
    rewards:{xp:300000,gold:8000,items:[{id:'abak_hand',qty:1}],unlockFlag:'abak_progress'} },
  q_main_krodeliver:{ id:'q_main_krodeliver', name:'【主线】解救战神克罗', type:'main', cityId:'element', giver:'战神克罗', reqLevel:100, prereq:['q_main_zennard'],
    desc:'圣灵之心已成，泽恩纳德之剑封印全开。前往罪域峡谷斩断铁链解救被囚的战神克罗，开放新种族职业「野蛮人狂战士」。',
    objective:{kind:'clear',target:'d_dragon',label:'通过试炼（紫瞳地龙巢穴）'},
    rewards:{xp:5000000,gold:200000,title:'战神解放者',items:[{id:'zennard_sword',qty:1}]} },
  q_main_pope:{ id:'q_main_pope', name:'【主线·终章】教皇之路', type:'main', cityId:'caroll', giver:'乔比亚大帝', reqLevel:120, prereq:['q_main_order'],
    desc:'集齐秩序之章第一卷全部六章（正义/善良/勇气/智慧/公正/自由），向乔比亚大帝复命，重建神之秩序，成为各地光明神殿共主——伟大的教皇。',
    objective:{kind:'special',label:'集齐秩序之章第一卷·六章'}, requireAllOrder:true,
    rewards:{xp:8000000,gold:300000,title:'教皇',unlockFlag:'pope'} },
  q_undead_revenge:{ id:'q_undead_revenge', name:'【主线】亡灵复仇', type:'main', cityId:'caroll', giver:'格林兰长老会', reqLevel:80,
    desc:'亡灵大军冲出地底，将死亡与瘟疫带进格林兰。在末日峡谷击退骷髅大军，守护帝国。',
    objective:{kind:'kill',target:'skel_army',count:50,label:'击杀骷髅兵'},
    rewards:{xp:600000,gold:15000,rep:{caroll:20},title:'帝国卫士'} },
  // 剩余秩序之章
  q_order_justice:{ id:'q_order_justice', name:'【隐藏】正义之章', type:'hidden', cityId:'saturn', giver:'探索触发', reqLevel:110,
    desc:'正义之章曾为天使霸业会长所持。在法纳斯法老地宫的最深处可寻得其踪迹。',
    objective:{kind:'clear',target:'d_pharaoh',label:'通关法纳斯法老地宫'},
    rewards:{xp:1500000,gold:40000,orderChapter:'正义'} },
  q_order_wisdom:{ id:'q_order_wisdom', name:'【隐藏】智慧之章', type:'hidden', cityId:'underdark', giver:'探索触发', reqLevel:130,
    desc:'智慧之章随圣言法师始皇killer的传说流落地底，巫妖王英索尔的墓穴藏有线索。',
    objective:{kind:'clear',target:'d_lichtomb',label:'通关巫妖王英索尔墓穴'},
    rewards:{xp:2000000,gold:50000,orderChapter:'智慧'} },
  q_order_fairness:{ id:'q_order_fairness', name:'【隐藏】公正之章', type:'hidden', cityId:'element', giver:'探索触发', reqLevel:95, langReq:'龙族语',
    desc:'公正之章附带群体治疗术的神力，藏于黄金之城伊格林宝库。需通晓龙族语方能解读石台铭文。',
    objective:{kind:'clear',target:'d_goldcity',label:'通关黄金之城宝库'},
    rewards:{xp:800000,gold:20000,orderChapter:'公正'} },
  // 终局传奇
  q_assassin_heart:{ id:'q_assassin_heart', name:'【传奇】寻找刺客之心', type:'side', cityId:'saturn', giver:'布莱兹酋长', reqLevel:150, langReq:'精灵语',
    desc:'刺客之心的线索在黑精灵部落的中央祭坛——需通晓精灵语方能与黑精灵周旋。夺取帕特诺斯特战锤，于失落的巴特尔城以雷击绝杀迪拉克鲁，方得刺客之心。',
    objective:{kind:'clear',target:'d_battle',label:'通关失落的巴特尔城'},
    rewards:{xp:3500000,gold:100000,title:'刺客之心',items:[{id:'lucky_gem',qty:15}]} },
  q_holyheart:{ id:'q_holyheart', name:'【主线】圣者之心', type:'main', cityId:'underdark', giver:'死亡的意志', reqLevel:155, prereq:['q_main_zennard'],
    desc:'在死亡平原持续净化腐尸，累积神圣力量至圆满，铸成圣者之心——解开泽恩纳德之剑封印的最后一环。',
    objective:{kind:'kill',target:'corpse',count:100,label:'净化死亡平原腐尸'},
    rewards:{xp:4000000,gold:120000,title:'圣者',unlockFlag:'holyheart'} },
});
