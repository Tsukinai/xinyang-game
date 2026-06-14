/* world.js —— 生活技能/配方 · 坐骑 · 宠物随从（战斗助手） · 公会 · 战场国战 数据
 * 逻辑见 systems2.js
 */
window.DATA = window.DATA || {};

// ===== 生活职业 =====
DATA.professions = {
  blacksmith:{ id:'blacksmith', name:'铁匠', icon:'⚒️', desc:'锻造武器装备，可打造铁器并强化。' },
  alchemist:{ id:'alchemist', name:'药剂师', icon:'⚗️', desc:'炼制血瓶与药剂，星空药店的根基。' },
  enchanter:{ id:'enchanter', name:'附魔师', icon:'📿', desc:'篆刻魔法阵，附魔强化装备。' },
  miner:{ id:'miner', name:'矿工', icon:'⛏️', desc:'采矿获取矿石材料。' },
  tailor:{ id:'tailor', name:'裁缝', icon:'🧵', desc:'缝制布甲与背包。' },
};
DATA.profRanks = ['学徒','初级','中级','高级','大师级','宗师级'];

// 配方（消耗材料产出物品，提升熟练度）
DATA.recipes = [
  { id:'rc_hp_m', prof:'alchemist', rankReq:0, name:'中级回血药剂', mats:{herb:3}, out:{id:'potion_hp_m',qty:2}, exp:10 },
  { id:'rc_hp_l', prof:'alchemist', rankReq:2, name:'高级瞬回药剂', mats:{herb:6}, out:{id:'potion_hp_l',qty:2}, exp:25 },
  { id:'rc_mp_m', prof:'alchemist', rankReq:0, name:'中级法力药剂', mats:{herb:3}, out:{id:'potion_mp_m',qty:2}, exp:10 },
  { id:'rc_gem_str', prof:'enchanter', rankReq:1, name:'力量宝石', mats:{iron_ore:4}, out:{id:'gem_str',qty:1}, exp:20 },
  { id:'rc_gem_agi', prof:'enchanter', rankReq:1, name:'敏捷宝石', mats:{iron_ore:4}, out:{id:'gem_agi',qty:1}, exp:20 },
  { id:'rc_gem_int', prof:'enchanter', rankReq:1, name:'智力宝石', mats:{iron_ore:4}, out:{id:'gem_int',qty:1}, exp:20 },
  { id:'rc_lucky', prof:'enchanter', rankReq:3, name:'幸运宝石', mats:{iron_ore:8,herb:4}, out:{id:'lucky_gem',qty:1}, exp:40 },
  { id:'rc_bandage', prof:'tailor', rankReq:0, name:'战斗绷带', mats:{fine_silk:1}, out:{id:'bandage',qty:3}, exp:8 },
  { id:'rc_ore', prof:'miner', rankReq:0, name:'冶炼铁锭（铁矿石）', mats:{}, out:{id:'iron_ore',qty:2}, exp:6, gather:true },
];

// ===== 坐骑 =====
DATA.mounts = {
  horse:{ id:'horse', name:'战马', icon:'🐎', speed:30, stat:{agi:5}, price:5000, desc:'移动如风，传送费用减少 30%。' },
  warhorse:{ id:'warhorse', name:'福尔克纳战马', icon:'🐴', speed:50, stat:{agi:10,sta:10}, price:50000, reqNoble:'侯爵', desc:'名贵战马，移速极快，传送费 -50%。' },
  griffin:{ id:'griffin', name:'皇家狮鹫', icon:'🦅', speed:60, stat:{agi:12,str:8}, price:120000, desc:'可骑乘往来格林兰与萨特恩两大帝国。传送费 -60%。' },
  phoenix:{ id:'phoenix', name:'烈焰火凤', icon:'🔥', speed:80, stat:{int:15,spi:10}, fly:true, quest:'q_phoenix', desc:'复活的烈焰火凤，飞行坐骑，火抗大增。传送费 -80%。' },
  dragon:{ id:'dragon', name:'紫瞳地龙', icon:'🐲', speed:99, stat:{str:25,agi:25,int:25,sta:25}, fly:true, quest:'q_dragon_mount', desc:'驯服的两百级紫瞳地龙，顶级飞行坐骑，全属性大增。' },
};

// ===== 宠物 / 随从（战斗助手）=====
DATA.allies = {
  silverwolf:{ id:'silverwolf', name:'银狼', icon:'🐺', kind:'pet', atkMul:0.35, price:3000, desc:'忠诚的银狼，战斗中协助撕咬。' },
  whitebear:{ id:'whitebear', name:'白熊', icon:'🐻', kind:'pet', atkMul:0.45, price:8000, desc:'强壮的白熊，攻击更高。' },
  arcane:{ id:'arcane', name:'奥术精灵', icon:'🧚', kind:'pet', atkMul:0.55, ignoreArmor:true, quest:'q_arcane_pet', desc:'忽视等级效果的奥术精灵，无视护甲。' },
  goldworm_pet:{ id:'goldworm_pet', name:'黄金地龙', icon:'🐉', kind:'pet', atkMul:0.7, price:200000, desc:'收服的黄金地龙，强力召唤宠物。' },
  lefus:{ id:'lefus', name:'圣骑士莱弗斯', icon:'⚜️', kind:'follower', atkMul:0.5, healMul:0.6, source:'guild', desc:'神圣雇佣的超级圣骑士，会治疗与战斗。' },
  karenna:{ id:'karenna', name:'守护天使卡伦娜', icon:'😇', kind:'follower', atkMul:0.6, healMul:0.9, quest:'q_karenna', desc:'六翼天使卡伦娜，强力治疗与审判。' },
  yalop:{ id:'yalop', name:'狂战士亚洛普', icon:'🪓', kind:'follower', atkMul:0.8, source:'guild', desc:'赦免收服的狂战士随从，血牛输出。' },
};

// ===== 公会 =====
DATA.guilds = {
  niuren:{ id:'niuren', name:'牛人部落', icon:'🐮', desc:'聂言（匿名）与唐尧创建的超级公会，星空药店为后盾。加入后可领公会任务、用贡献值兑换装备、招募随从。' },
};
// 公会贡献商店
DATA.guildShop = [
  { id:'lefus', type:'ally', cost:200, name:'招募·圣骑士莱弗斯' },
  { id:'yalop', type:'ally', cost:500, name:'招募·狂战士亚洛普' },
  { id:'lucky_gem', type:'item', qty:1, cost:80, name:'幸运宝石' },
  { id:'potion_hp_l', type:'item', qty:5, cost:30, name:'高级回血药剂×5' },
];

// ===== 战场 / 要塞争夺 / 国战 =====
DATA.battlegrounds = {
  bg_hilton:{ id:'bg_hilton', name:'希尔顿要塞·魔物围城', reqLevel:15, icon:'🏰',
    desc:'每年秋季地底魔物围攻希尔顿要塞，守住它！多波敌军 + 魔物领主。',
    waves:['darkelf','treant','darkelf','treant_herd'], boss:'treant_king',
    reward:{xp:5000,gold:300,credit:200,fortress:'hilton'} },
  bg_doom:{ id:'bg_doom', name:'末日峡谷·阵营战场', reqLevel:80, icon:'⚔️',
    desc:'两大阵营在末日峡谷的拉锯战，击溃亡灵骷髅大军。',
    waves:['skel_army','skel_army','silverwing','skel_army'], boss:'goblin_ig',
    reward:{xp:600000,gold:15000,credit:2000,fortress:'doom'} },
  bg_national:{ id:'bg_national', name:'两大阵营·终极国战', reqLevel:150, icon:'🌋',
    desc:'光明与黑暗阵营的全面国战，率牛人部落联军直捣世界壁垒，击杀堕落天使厄普顿！',
    waves:['dilakru','sandgiant','corpse','dilakru'], boss:'upton',
    reward:{xp:15000000,gold:500000,credit:50000,fortress:'worldwall',title:'国战英雄'} },
};
