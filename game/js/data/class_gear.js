/* class_gear.js —— 六职业专属信仰神装（与盗贼同等丰富）
 * 每职业一把一转暗金武器 + 一件二转传奇胸甲，作为转职任务奖励发放。
 * 名称取自原著各职业代表神装。
 */
window.DATA = window.DATA || {};

const SIG = {
  rogue:{
    50:{name:'黑曜之刃',slot:'weapon',q:'dark',stats:{agi:30,atk:120,crit:10}},
    100:{name:'影舞·疾风战衣',slot:'chest',q:'legend',stats:{agi:60,sta:40,dodge:12,crit:10,hp:800}}},
  warrior:{
    50:{name:'怒涛巨剑',slot:'weapon',q:'dark',stats:{str:32,atk:150,armor:20}},
    100:{name:'永恒战铠',slot:'chest',q:'legend',stats:{str:60,sta:70,armor:180,hp:1600}}},
  mage:{
    50:{name:'黑暗初冬法杖',slot:'weapon',q:'dark',stats:{int:35,sp:135,crit:8}},
    100:{name:'格瑞玛元素法袍',slot:'chest',q:'legend',stats:{int:75,sta:40,sp:120,hp:800}}},
  priest:{
    50:{name:'圣女克里斯蒂娜法杖',slot:'weapon',q:'dark',stats:{spi:32,int:18,sp:120,hp:300}},
    100:{name:'谢瑶女神法袍',slot:'chest',q:'legend',stats:{spi:65,int:40,sp:120,hp:1000}}},
  paladin:{
    50:{name:'圣堂战锤',slot:'weapon',q:'dark',stats:{str:28,atk:120,spi:18}},
    100:{name:'守护骑士铠',slot:'chest',q:'legend',stats:{str:50,sta:75,armor:200,hp:1700}}},
  hunter:{
    50:{name:'帕伦特火鸟长弓',slot:'weapon',q:'dark',stats:{agi:32,atk:135,crit:10}},
    100:{name:'索伦斯之翼皮甲',slot:'chest',q:'legend',stats:{agi:62,sta:45,crit:10,dodge:8,hp:900}}},
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
      classes:[cls], stats:s.stats, value:tier*200, icon: s.slot==='weapon'?'🗡️':'🦺',
      desc:`${DATA.classes[cls].name}专属神装（${tier===50?'一转':'二转'}）。${LORE[cls]}`,
    };
  }
}
