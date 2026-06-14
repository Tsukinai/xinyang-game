/* class_quests.js —— 六职业对等任务链 + 转职后专属技能
 * 任务链统一结构：觉醒(Lv10) → 一转(Lv50,tier50) → 二转·终极职业(Lv100,tier100)
 * 由各城「训练师」发放（Act.trainer 列出 classReq 匹配的可接职业任务）。
 * 进阶技能用 advReq:50/100 门控，转职后才会习得。
 */
window.DATA = window.DATA || {};

// ---------- 进阶技能（转职解锁）----------
Object.assign(DATA.skills, {
  // 盗贼
  r_freehand:{name:'反手背刺',icon:'🔁',type:'active',reqLevel:50,advReq:50,mpCost:30,cooldown:2,desc:'大盗贼自由技能：反手切刀扎入背心，280%伤害且无视护甲。',effect:{kind:'damage',mult:2.8,ignoreArmor:true}},
  r_deathdance:{name:'死亡舞步',icon:'💀',type:'active',reqLevel:100,advReq:100,mpCost:50,cooldown:4,desc:'影舞终极技：极致潜匿后绕背连环刺杀，五连击必定暴击。',effect:{kind:'multi',hits:5,mult:1.1,guaranteedCrit:true}},
  // 战士
  w_godbody:{name:'战神护体',icon:'🛡️',type:'active',reqLevel:50,advReq:50,mpCost:30,cooldown:5,desc:'大剑士绝技：金甲护体，攻击与护甲大增4回合。',effect:{kind:'buff',buff:{stat:'atk',amt:90,turns:4}}},
  w_dragonslash:{name:'黑龙斩',icon:'🐉',type:'active',reqLevel:100,advReq:100,mpCost:50,cooldown:4,desc:'神武士终极技：召出金甲巨神一斩，380%伤害并眩晕。',effect:{kind:'stun',mult:3.8,stunTurns:1}},
  // 法师
  m_forbidden:{name:'爆雷烈焰',icon:'🌩️',type:'active',reqLevel:50,advReq:50,mpCost:45,cooldown:3,desc:'大法师禁咒：千码黑色火雨倾泻，360%伤害。',effect:{kind:'damage',mult:3.6}},
  m_resonance:{name:'魔法共鸣',icon:'🔮',type:'active',reqLevel:100,advReq:100,mpCost:30,cooldown:6,desc:'魔导师奥义：与规则共鸣，暴击与法力激增、瞬发连环奥爆。',effect:{kind:'multi',hits:4,mult:1.4,guaranteedCrit:true}},
  // 牧师
  p_divineheal:{name:'神圣复活术',icon:'🕊️',type:'active',reqLevel:50,advReq:50,mpCost:40,cooldown:3,desc:'高阶牧师：神圣之光无损满血，巨量治疗。',effect:{kind:'heal',healMult:4.5,flat:200}},
  p_divinegrace:{name:'神级赐福术',icon:'😇',type:'active',reqLevel:100,advReq:100,mpCost:50,cooldown:5,desc:'神牧奥义：取之不竭的祝福，攻击暴增并护盾加身。',effect:{kind:'buff',buff:{stat:'atk',amt:120,turns:5}}},
  // 圣骑士
  pal_guardward:{name:'守护结界',icon:'🟡',type:'active',reqLevel:50,advReq:50,mpCost:40,cooldown:5,desc:'圣殿骑士：辉煌结界吸收巨量伤害。',effect:{kind:'shield',mult:3.2,flat:150}},
  pal_judgeblade:{name:'审判之剑',icon:'⚔️',type:'active',reqLevel:100,advReq:100,mpCost:50,cooldown:4,desc:'守护骑士奥义：天降审判之剑，380%圣光伤害并回血。',effect:{kind:'damage',mult:3.8,lifesteal:0.3}},
  // 猎魔者
  h_beastward:{name:'索伦斯之翼',icon:'🦅',type:'active',reqLevel:50,advReq:50,mpCost:35,cooldown:5,desc:'精灵游侠：索伦斯之翼加身，攻击与急速大增4回合。',effect:{kind:'buff',buff:{stat:'atk',amt:95,turns:4}}},
  h_starfall:{name:'爆裂箭雨',icon:'🌠',type:'active',reqLevel:100,advReq:100,mpCost:50,cooldown:4,desc:'神射手奥义：漫天爆裂箭雨倾泻，六连击。',effect:{kind:'multi',hits:6,mult:1.0}},
});
// 追加到各职业技能池
DATA.classes.rogue.skills.push('r_freehand','r_deathdance');
DATA.classes.warrior.skills.push('w_godbody','w_dragonslash');
DATA.classes.mage.skills.push('m_forbidden','m_resonance');
DATA.classes.priest.skills.push('p_divineheal','p_divinegrace');
DATA.classes.paladin.skills.push('pal_guardward','pal_judgeblade');
DATA.classes.hunter.skills.push('h_beastward','h_starfall');

// ---------- 转职名映射 DATA.advNames 已在 gear_types.js 提前定义 ----------

// ---------- 任务链定义（数据驱动批量生成）----------
const CHAINS = {
  rogue:{ awakenKill:['darkelf',10], awakenTitle:'暗影学徒', awakenItem:'weaver_ring',
    awakenDesc:'盗贼公会的偷窃术试炼：潜入树妖林，铲除偷走伊恩帕特之笛的黑精灵，证明你的身法。',
    t50Dungeon:'d_arena', t50Desc:'尼兰斗兽场被邪恶盗贼占据，用潜行解救人质、击败邪恶盗贼领主——这是「大盗贼」的转职试炼。',
    t100Dungeon:'d_goldmine', t100Desc:'影舞试炼：唯快不破。在最深的黑暗中绕背一击，证明你已将速度的奥义发挥到极致，晋阶巅峰职业「影舞」。' },
  warrior:{ awakenKill:['treant',12], awakenTitle:'勇士', awakenItem:'courage_armor',
    awakenDesc:'战士的勇气试炼：直面失控的树妖群，以怒气与钢铁证明你配得上「勇士」之名。',
    t50Dungeon:'d_crystal', t50Desc:'盾甲战士的考验：扛住地穴领主贝内特的全部怒火而不退半步，晋阶「大剑士」。',
    t100Dungeon:'d_goldmine', t100Desc:'神武士之路：召出金甲巨神之力，以力量碾碎一切，晋阶终极职业「神武士」。' },
  mage:{ awakenKill:['spider',12], awakenTitle:'奥术学徒', awakenItem:'gem_int',
    awakenDesc:'奥术之章试炼：以元素之力净化岩石蜘蛛洞穴的剧毒蛛群，领悟魔法的真意。',
    t50Dungeon:'d_crystal', t50Desc:'大法师的试炼：在水晶洞窟中以禁咒洗地，晋阶「大法师」。',
    t100Dungeon:'d_goldmine', t100Desc:'魔导师转职：参悟虚拟世界的规则，与魔法共鸣，晋阶终极职业「魔导师」。' },
  priest:{ awakenKill:['murloc',12], awakenTitle:'见习牧师', awakenItem:'gem_spi_q',
    awakenDesc:'圣堂魔法试炼：以圣光净化娜迦后裔鱼人，学会救死扶伤，也学会以光明审判邪恶。',
    t50Dungeon:'d_crystal', t50Desc:'高阶牧师之路：在绝境中以神圣复活术挽救一切，晋阶「高阶牧师」。',
    t100Dungeon:'d_goldmine', t100Desc:'神牧之路：成为取之不竭的生命之源与神级赐福者，晋阶终极职业「神牧」。' },
  paladin:{ awakenKill:['darkelf',10], awakenTitle:'见习圣骑士', awakenItem:'gem_sta',
    awakenDesc:'十字军的祈祷：以圣印与光环讨伐黑暗精灵，踏上守护者之路。',
    t50Dungeon:'d_crystal', t50Desc:'圣殿骑士的试炼：以守护结界扛下地穴领主，晋阶「圣殿骑士」。',
    t100Dungeon:'d_goldmine', t100Desc:'守护骑士之路：领悟圣光奥义，攻防治三位一体，晋阶终极职业「守护骑士」。' },
  hunter:{ awakenKill:['treant',12], awakenTitle:'游猎者', awakenItem:'feather_step',
    awakenDesc:'游猎之章：在树妖林布设陷阱、以箭矢狩猎为祸的树妖，成为合格的猎魔者。',
    t50Dungeon:'d_crystal', t50Desc:'精灵游侠的试炼：以索伦斯之翼的疾速箭术贯穿水晶洞窟，晋阶「精灵游侠」。',
    t100Dungeon:'d_goldmine', t100Desc:'神射手之路：一箭定乾坤，掌握爆裂箭雨，晋阶终极职业「神射手」。' },
};

const monName = id => (DATA.monsters[id]||{}).name || id;
for (const cls in CHAINS){
  const c = CHAINS[cls]; const adv = DATA.advNames[cls];
  const item = DATA.items[c.awakenItem] ? c.awakenItem : 'lucky_gem';
  DATA.quests['cq_'+cls+'_awaken'] = {
    id:'cq_'+cls+'_awaken', name:'【职业】觉醒试炼', type:'class', classReq:cls, cityId:'*', giver:'各职业训练师', reqLevel:8,
    desc:c.awakenDesc,
    objective:{kind:'kill',target:c.awakenKill[0],count:c.awakenKill[1],label:'击杀'+monName(c.awakenKill[0])},
    rewards:{xp:800,gold:80,title:c.awakenTitle,items:[{id:item,qty:1}]} };
  DATA.quests['cq_'+cls+'_t50'] = {
    id:'cq_'+cls+'_t50', name:'【转职·一转】'+adv[50], type:'class', classReq:cls, cityId:'*', giver:'各职业训练师', reqLevel:50, prereq:['cq_'+cls+'_awaken'],
    desc:c.t50Desc,
    objective:{kind:'clear',target:c.t50Dungeon,label:'通关'+(DATA.dungeons[c.t50Dungeon]||{}).name},
    rewards:{xp:200000,gold:6000,advance:{name:adv[50],tier:50},items:[{id:'lucky_gem',qty:5},{id:cls+'_sig50',qty:1}]} };
  DATA.quests['cq_'+cls+'_t100'] = {
    id:'cq_'+cls+'_t100', name:'【转职·二转】'+adv[100], type:'class', classReq:cls, cityId:'*', giver:'各职业训练师', reqLevel:100, prereq:['cq_'+cls+'_t50'],
    desc:c.t100Desc,
    objective:{kind:'clear',target:c.t100Dungeon,label:'通关'+(DATA.dungeons[c.t100Dungeon]||{}).name},
    rewards:{xp:2000000,gold:30000,advance:{name:adv[100],tier:100},items:[{id:'lucky_gem',qty:15},{id:cls+'_sig100',qty:1}]} };
}

// 觉醒奖励用到的精神宝石（补一个）
DATA.items.gem_spi_q = {name:'精神宝石',type:'宝石',quality:'silver',value:40,stackable:true,icon:'⚪',stats:{spi:5},desc:'镶嵌于装备：精神+5。'};
