/* extras.js —— 技能书可学技能 / 技能书物品 / 开锁书 / 彩蛋稀有装备
 * 在 audit_patch.js 之后、loot.js/events.js 之前加载。
 */
window.DATA = window.DATA || {};

// ---------- 技能书可教授的额外技能 ----------
Object.assign(DATA.skills, {
  s_steal:{name:'偷窃术',icon:'🤏',type:'active',reqLevel:1,mpCost:14,cooldown:3,desc:'背刺偷袭，造成160%伤害并偷取目标钱财（技能书习得·盗贼）。',effect:{kind:'damage',mult:1.6,steal:true}},
  s_assassinate:{name:'暗杀',icon:'🗡️',type:'active',reqLevel:1,mpCost:28,cooldown:4,desc:'一击必杀的暗杀，260%伤害且必定暴击（技能书习得·盗贼）。',effect:{kind:'damage',mult:2.6,guaranteedCrit:true,ignoreArmor:true}},
  s_warcry:{name:'战吼',icon:'📣',type:'active',reqLevel:1,mpCost:16,cooldown:4,desc:'激昂战吼，提升攻击3回合（技能书习得·通用）。',effect:{kind:'buff',buff:{stat:'atk',amt:45,turns:3}}},
  s_firstaid:{name:'急救',icon:'🩹',type:'active',reqLevel:1,mpCost:14,cooldown:2,desc:'紧急包扎，恢复生命（技能书习得·通用）。',effect:{kind:'heal',healMult:1.8,flat:60}},
  s_necrosacrifice:{name:'亡灵祭礼',icon:'💀',type:'active',reqLevel:1,mpCost:30,cooldown:5,desc:'献祭亡灵之力，造成230%暗影伤害并吸血（技能书习得·通用·亡灵暗殿）。',effect:{kind:'drain',mult:2.3,lifesteal:0.5}},
});

// ---------- 技能书 / 开锁书（物品，使用即学）----------
DATA.items.book_lockpick = {name:'开锁专家·技能书',type:'技能书',quality:'gold',value:200,stackable:false,icon:'📘',use:{learnLife:'lockpick'},desc:'习得「开锁」生活技能（盗贼天生掌握）。开宝箱积累熟练度，越练成功率与开出品质越高。'};
DATA.items.book_steal = {name:'偷窃术·技能书',type:'技能书',quality:'gold',value:300,stackable:false,icon:'📕',use:{learnSkill:'s_steal'},classReq:'rogue',icon:'📕',desc:'盗贼专属。习得「偷窃术」：伤害并偷取目标钱财。'};
DATA.items.book_assassinate = {name:'刺杀·技能书',type:'技能书',quality:'dark',value:600,stackable:false,icon:'📕',use:{learnSkill:'s_assassinate'},classReq:'rogue',desc:'盗贼专属·稀有。习得「暗杀」：必定暴击、无视护甲的致命一击。'};
DATA.items.book_warcry = {name:'战吼·技能书',type:'技能书',quality:'silver',value:150,stackable:false,icon:'📗',use:{learnSkill:'s_warcry'},desc:'通用。习得「战吼」增益技能。'};
DATA.items.book_firstaid = {name:'急救·技能书',type:'技能书',quality:'silver',value:150,stackable:false,icon:'📗',use:{learnSkill:'s_firstaid'},desc:'通用。习得「急救」自我治疗（无治疗职业也能续命）。'};
DATA.items.book_necro = {name:'亡灵祭礼·技能书',type:'技能书',quality:'dark',value:800,stackable:false,icon:'📓',use:{learnSkill:'s_necrosacrifice'},desc:'稀有·亡灵暗殿传承。习得「亡灵祭礼」：暗影吸血强力技能。'};
// 可从宝箱开出的技能书池
DATA.skillBookPool = ['book_lockpick','book_warcry','book_firstaid','book_steal','book_assassinate','book_necro'];

// ---------- 彩蛋：超低爆率特殊装备（神器，纪念/玩梗）----------
DATA.items.egg_snail = {name:'发飙的蜗牛',type:'神器·彩蛋',slot:'trinket',quality:'artifact',reqLevel:1,value:0,icon:'🐌',
  stats:{str:60,agi:60,int:60,sta:60,spi:60,crit:25,hp:2000},egg:true,
  desc:'传说中本书作者的化身。全属性大幅提升……据说移动速度-99%（毕竟是只蜗牛）。纪念心中永不褪色的 WOW 与 DND。'};
DATA.items.egg_shell = {name:'永不磨损的蜗牛壳',type:'神器·彩蛋',slot:'offhand',quality:'artifact',reqLevel:1,value:0,icon:'🐚',
  stats:{armor:600,sta:80,hp:3000},egg:true,desc:'蜗牛背上那只壳。坚不可摧，再凶的怪也咬不动。'};
DATA.items.egg_keyboard = {name:'程序员的机械键盘',type:'神器·彩蛋',slot:'trinket',quality:'artifact',reqLevel:1,value:0,icon:'⌨️',
  stats:{int:80,sp:200,crit:20},egg:true,desc:'敲下回车，便能改写主脑的规则。Ctrl+S 已保存你的命运。'};
DATA.items.egg_mastermind = {name:'主脑的彩蛋',type:'神器·彩蛋',slot:'trinket',quality:'artifact',reqLevel:1,value:0,icon:'🥚',
  stats:{crit:30,agi:40,int:40},egg:true,desc:'掌控第二世界的「主脑」藏起的彩蛋。找到它的人，运气好得不像话。'};
DATA.items.egg_wowdnd = {name:'WOW与DND纪念徽章',type:'神器·彩蛋',slot:'trinket',quality:'artifact',reqLevel:1,value:0,icon:'🎖️',
  stats:{str:40,agi:40,int:40,sta:40,spi:40,crit:15,hp:1500},egg:true,desc:'献给永不褪色的两座丰碑。佩戴它，仿佛回到了最初热血的夜晚。'};
DATA.items.egg_nieyan = {name:'涅炎的染血匕首',type:'神器·彩蛋',slot:'weapon',weaponType:'dagger',quality:'artifact',reqLevel:1,value:0,icon:'🔪',
  stats:{agi:80,atk:300,crit:30},egg:true,desc:'狂贼涅炎用过的匕首，刃上血迹永不干涸。盗贼/猎魔者梦寐以求。'};
DATA.eggItems = ['egg_snail','egg_shell','egg_keyboard','egg_mastermind','egg_wowdnd','egg_nieyan'];

// ---------- 技能书来源：商店 / BOSS 掉落 / 任务 ----------
(function(){
  // 卡罗尔城/克里普斯 商店上架基础技能书
  if(DATA.cities.caroll) DATA.cities.caroll.shop.push('book_lockpick','book_warcry','book_firstaid');
  // BOSS 掉落对应技能书
  const drop=(id,book,ch)=>{ if(DATA.monsters[id]){ DATA.monsters[id].drops=DATA.monsters[id].drops||[]; DATA.monsters[id].drops.push({item:book,chance:ch}); } };
  drop('evil_rogue','book_steal',0.5); drop('aina','book_assassinate',0.25);
  drop('lich','book_necro',0.4); drop('serisotot','book_necro',0.2);
})();
