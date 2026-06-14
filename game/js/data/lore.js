/* lore.js —— 世界观文本与全局枚举
 * 建立 window.DATA 命名空间（各数据文件均 DATA = window.DATA || {}）
 */
window.DATA = window.DATA || {};

DATA.meta = {
  title: '信仰',
  subtitle: '亚特兰大陆 · 第二世界',
  version: '0.1',
};

DATA.intro = `公元二〇XX年，全息虚拟网游《信仰》开服。
它由名为「主脑」的人工智能掌控，模拟出一个规则严密、历史可考的世界——亚特兰大陆。
人们称它为「人类的第二世界」。

你戴上头盔，意识沉入那片大陆。
善良守序的光明阵营与盘踞地底的黑暗阵营战火不熄；
散落世间的「秩序之章」与「混乱之章」，是改写大陆命运的神物。
有人为神装厮杀，有人为信仰而战。

每个人心中，都有一个指引他的神。
现在，轮到你书写自己的传说了。`;

// 阵营 / 帝国
DATA.empires = {
  greenland: { id:'greenland', name:'格林兰帝国', camp:'light', race:'人类',
    desc:'光明阵营·长老议会制的人类国度，都城卡罗尔城（天空之城），守护神法神乔比亚大帝。' },
  saturn:    { id:'saturn', name:'萨特恩帝国', camp:'light', race:'兽人/精灵/矮人',
    desc:'光明阵营·部落联盟，人类的盟友，第一公会天使霸业雄踞于此。' },
  undead:    { id:'undead', name:'亡灵帝国', camp:'dark', race:'亡灵',
    desc:'邪恶阵营·地底的亡灵国度，都城亡者墓园，亡灵法师与巫妖盛行。' },
  demon:     { id:'demon', name:'魔裔部落', camp:'dark', race:'魔裔/地精/堕落人类',
    desc:'邪恶阵营·地底首领独裁的魔裔部落，顶级职业「银翼」晋阶「金翼」。' },
  giant:     { id:'giant', name:'巨人部落', camp:'neutral', race:'巨人',
    desc:'善良守序中立·爱好和平的巨人国度。' },
};
DATA.camps = {
  light:{ name:'光明（善良守序）', color:'#e0b34c' },
  dark:{ name:'黑暗（邪恶守序）', color:'#b65cff' },
  neutral:{ name:'中立', color:'#5fa84a' },
};

// 装备品质
DATA.qualities = {
  white:  { key:'white',  name:'普通', cls:'q-white',  affixMax:0, tier:0 },
  bronze: { key:'bronze', name:'青铜', cls:'q-green',  affixMax:1, tier:1 },
  silver: { key:'silver', name:'白银', cls:'q-blue',   affixMax:2, tier:2 },
  gold:   { key:'gold',   name:'黄金', cls:'q-gold',   affixMax:3, tier:3, sockets:2 },
  dark:   { key:'dark',   name:'暗金', cls:'q-dark',   affixMax:4, tier:4, sockets:3 },
  epic:   { key:'epic',   name:'亚传奇', cls:'q-purple', affixMax:4, tier:5, sockets:3 },
  legend: { key:'legend', name:'传奇', cls:'q-purple', affixMax:5, tier:6, sockets:5 },
  divine: { key:'divine', name:'神物', cls:'q-dark',   affixMax:6, tier:7, sockets:5 },
};
DATA.qualityOrder = ['white','bronze','silver','gold','dark','epic','legend','divine'];

// 装备槽
DATA.slots = {
  weapon:'武器', offhand:'副手', head:'头部', shoulder:'肩部', chest:'胸甲',
  hand:'护手', waist:'腰带', legs:'腿甲', feet:'鞋靴', cloak:'披风',
  neck:'项链', ring1:'戒指', ring2:'戒指', trinket:'勋章',
};

// 历史编年（图书馆/典籍可读）
DATA.codex = [
  { t:'黑暗之年代', d:'龙族建立帝国奴役各族。巨人、人类、精灵、兽人、矮人联军最终推翻龙族，龙族四散凋零。' },
  { t:'共治之年代（873–1235）', d:'各族共治，秩序之章与混乱之章于此年代流传至今，各六卷三十六章，散落世界。' },
  { t:'秩序之章', d:'第一卷六章为正义、善良、勇气、智慧、公正、自由。集齐秩序之章者可重建神之秩序、成为各地光明神殿共主——伟大的教皇。' },
  { t:'十光明圣骑士', d:'黑暗年代，十位圣骑士反抗龙族、建立光明修道院。因龙族姑娘贝妮塔而分裂，野心家布鲁因背弃信仰屠戮战友。集齐十枚圣骑士勋章可与大天使泰洛德对话。' },
  { t:'战神克罗', d:'人类战神克罗与龙王泽恩纳德交战陨落，黑暗力量轰开罪域。泽恩纳德之剑封印于罪域最深处，唯有圣灵之心者可驾驭。' },
  { t:'独裁者阿巴克', d:'共治年代人类独裁者阿巴克，残暴统治后被督军布鲁克击杀，其神装套装从此遗失人间。' },
];
