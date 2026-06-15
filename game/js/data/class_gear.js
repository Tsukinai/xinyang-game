/* class_gear.js —— 六职业专属信仰神装（与盗贼同等丰富）
 * 每职业一把一转暗金武器 + 一件二转传奇胸甲，作为转职任务奖励发放。
 * 名称取自原著各职业代表神装。
 */
window.DATA = window.DATA || {};

// 数值对齐同级同品质随机掉落（暗金武器≈攻击330、传奇胸甲≈护甲730/体质170），作为该阶 BiS。
const SIG = {
  rogue:{
    50:{name:'黑曜之刃',slot:'weapon',q:'dark',stats:{agi:55,atk:345,crit:16}},
    100:{name:'影舞·疾风战衣',slot:'chest',q:'legend',stats:{agi:120,sta:90,armor:300,dodge:16,crit:14,hp:1800}}},
  warrior:{
    50:{name:'怒涛巨剑',slot:'weapon',q:'dark',stats:{str:60,atk:360,armor:50}},
    100:{name:'永恒战铠',slot:'chest',q:'legend',stats:{str:120,sta:150,armor:780,hp:3400}}},
  mage:{
    50:{name:'黑暗初冬法杖',slot:'weapon',q:'dark',stats:{int:60,sp:355,crit:12}},
    100:{name:'格瑞玛元素法袍',slot:'chest',q:'legend',stats:{int:140,sta:85,sp:340,armor:280,hp:1700}}},
  priest:{
    50:{name:'圣女克里斯蒂娜法杖',slot:'weapon',q:'dark',stats:{spi:55,int:30,sp:330,hp:600}},
    100:{name:'谢瑶女神法袍',slot:'chest',q:'legend',stats:{spi:130,int:80,sp:330,armor:300,hp:2200}}},
  paladin:{
    50:{name:'圣堂战锤',slot:'weapon',q:'dark',stats:{str:52,atk:330,spi:30,armor:40}},
    100:{name:'守护骑士铠',slot:'chest',q:'legend',stats:{str:100,sta:150,armor:800,hp:3400}}},
  hunter:{
    50:{name:'帕伦特火鸟长弓',slot:'weapon',q:'dark',stats:{agi:58,atk:350,crit:16}},
    100:{name:'索伦斯之翼皮甲',slot:'chest',q:'legend',stats:{agi:124,sta:95,armor:360,crit:14,dodge:10,hp:1900}}},
};
const LORE = {
  rogue:'盗贼巅峰职业「影舞」的标志装备，将速度的奥义发挥到极致。',
  warrior:'盾甲战士梦寐以求的永恒套装核心，防御一身永恒、寸步不退。',
  mage:'奥法顶级套装「黑暗初冬」与元素传奇「格瑞玛」，毁城之力。',
  priest:'神牧的圣女与女神套装，取之不竭的生命之源。',
  paladin:'守护骑士的圣堂神装，攻防治三位一体。',
  hunter:'昂翼天使手持的帕伦特火鸟长弓与索伦斯之翼，疾速贯穿。',
};
for(const cls in SIG){
  for(const tier of [50,100]){
    const s=SIG[cls][tier];
    const cg = DATA.classGear[cls] || {};
    DATA.items[cls+'_sig'+tier] = {
      name:s.name, slot:s.slot, quality:s.q, reqLevel:tier,
      type: s.slot==='weapon' ? DATA.weaponTypes[cg.weapons[0]] : DATA.armorTypes[cg.armor],
      weaponType: s.slot==='weapon' ? cg.weapons[0] : undefined,
      armorType: s.slot==='chest' ? cg.armor : undefined,
      classes:[cls], set:cls+'_set', stats:s.stats, value:tier*200, icon: s.slot==='weapon'?'🗡️':'🦺',
      desc:`${DATA.classes[cls].name}专属神装（${tier===50?'一转':'二转'}）·【${DATA.advNames[cls][100]}套装】组件。${LORE[cls]}`,
    };
  }
}

// ---------- 套装：双件特殊效果 + 套装技能 ----------
Object.assign(DATA.skills, {
  set_rogue:{name:'影舞·千幻',icon:'🌌',type:'active',reqLevel:1,mpCost:40,cooldown:5,desc:'套装技能：分化千道幻影绕背连刺，四连击且必定暴击。',effect:{kind:'multi',hits:4,mult:1.5,guaranteedCrit:true}},
  set_warrior:{name:'永恒·黑龙怒斩',icon:'🐲',type:'active',reqLevel:1,mpCost:45,cooldown:5,desc:'套装技能：召金甲巨神一斩，造成 380% 伤害并眩晕。',effect:{kind:'stun',mult:3.8,stunTurns:1}},
  set_mage:{name:'格瑞玛·元素崩裂',icon:'🌋',type:'active',reqLevel:1,mpCost:55,cooldown:5,desc:'套装技能：引动元素本源崩裂，造成 430% 法术伤害。',effect:{kind:'damage',mult:4.3}},
  set_priest:{name:'女神·圣恩普照',icon:'🕊️',type:'active',reqLevel:1,mpCost:45,cooldown:4,desc:'套装技能：女神圣恩普照，巨量治疗自身。',effect:{kind:'heal',healMult:5.2,flat:300}},
  set_paladin:{name:'守护·辉煌审判',icon:'⚖️',type:'active',reqLevel:1,mpCost:50,cooldown:5,desc:'套装技能：辉煌圣光审判，360% 伤害并汲取生命。',effect:{kind:'damage',mult:3.6,lifesteal:0.35}},
  set_hunter:{name:'索伦斯·箭暴',icon:'🌠',type:'active',reqLevel:1,mpCost:48,cooldown:5,desc:'套装技能：索伦斯之翼倾泻箭暴，六连击。',effect:{kind:'multi',hits:6,mult:1.15}},
});
const SET_STATS = {
  rogue:{agi:50,crit:8,hp:600}, warrior:{str:50,sta:40,armor:120,hp:1200},
  mage:{int:55,sp:90,crit:6}, priest:{spi:55,int:30,hp:900},
  paladin:{str:45,sta:45,armor:140,hp:1200}, hunter:{agi:55,crit:8,hp:700},
};
const STATNAME={str:'力量',agi:'敏捷',int:'智力',sta:'体质',spi:'精神',atk:'攻击',sp:'法强',armor:'护甲',hp:'生命',crit:'暴击%'};
DATA.sets = DATA.sets || {};
for(const cls in DATA.advNames){
  const sk=DATA.skills['set_'+cls]; const st=SET_STATS[cls];
  const statDesc=Object.keys(st).map(k=>(STATNAME[k]||k)+'+'+st[k]).join('、');
  DATA.sets[cls+'_set'] = {
    name: DATA.advNames[cls][100]+'套装', cls,
    pieces:[cls+'_sig50', cls+'_sig100'],
    bonus:{ 2:{ stats:st, skill:'set_'+cls, desc:`集齐2件：${statDesc}；习得套装技能【${sk.name}】` } },
  };
}
