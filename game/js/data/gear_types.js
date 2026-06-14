/* gear_types.js —— 装备类型与职业穿戴限制
 * 武器类型：匕首/单手剑/巨剑/法杖/战锤/长弓
 * 护甲类型：布甲/皮甲/板甲（饰品/副手不限职业）
 * 每个职业只能穿戴对应类型的护甲与武器。
 */
window.DATA = window.DATA || {};

DATA.weaponTypes = { dagger:'匕首', sword:'单手剑', greatsword:'巨剑', staff:'法杖', mace:'战锤', bow:'长弓' };
DATA.armorTypes  = { cloth:'布甲', leather:'皮甲', plate:'板甲' };
// 护甲各槽位名（材质词 + 槽位名）
DATA.armorWord = { cloth:'布', leather:'皮', plate:'板' };
DATA.armorSlotName = { head:'盔', shoulder:'护肩', chest:'胸甲', hand:'护手', waist:'腰带', legs:'护腿', feet:'战靴', cloak:'披风' };
DATA.accSlotName = { offhand:'副手', neck:'项链', ring1:'戒指', ring2:'戒指', trinket:'勋章' };
// 品质材质词（无随机花哨前缀，仅按品质标识）
DATA.qualityWord = { white:'粗制', bronze:'青铜', silver:'白银', gold:'黄金', dark:'暗金', epic:'秘银', legend:'龙纹', divine:'神圣', artifact:'神器' };

// 职业可穿戴：armor=单一护甲类型，weapons=可用武器类型
DATA.classGear = {
  rogue:   { armor:'leather', weapons:['dagger','sword'],            statByWeapon:'agi' },
  warrior: { armor:'plate',   weapons:['greatsword','sword','mace'], statByWeapon:'str' },
  mage:    { armor:'cloth',   weapons:['staff'],                     statByWeapon:'int' },
  priest:  { armor:'cloth',   weapons:['staff','mace'],              statByWeapon:'spi' },
  paladin: { armor:'plate',   weapons:['sword','mace'],              statByWeapon:'str' },
  hunter:  { armor:'leather', weapons:['bow','dagger'],              statByWeapon:'agi' },
};
// 武器类型对应主属性（生成时附带的少量属性）
DATA.weaponStat = { dagger:'agi', sword:'str', greatsword:'str', staff:'int', mace:'str', bow:'agi' };
DATA.armorStat  = { cloth:'int', leather:'agi', plate:'str' };

// 转职名映射（一转/二转·终极职业）—— 提前定义，供装备/套装/职业任务共用
DATA.advNames = {
  rogue:{50:'大盗贼',100:'影舞'}, warrior:{50:'大剑士',100:'神武士'},
  mage:{50:'大法师',100:'魔导师'}, priest:{50:'高阶牧师',100:'神牧'},
  paladin:{50:'圣殿骑士',100:'守护骑士'}, hunter:{50:'精灵游侠',100:'神射手'},
};

// 判断职业能否穿戴某装备定义
DATA.canClassUse = function(def, classId){
  if(!def) return false;
  if(def.classes) return def.classes.indexOf(classId) >= 0; // 专属装备以 classes 为准
  const cg = DATA.classGear[classId]; if(!cg) return true;
  if(def.weaponType) return cg.weapons.indexOf(def.weaponType) >= 0;
  if(def.armorType)  return cg.armor === def.armorType;
  return true; // 饰品/副手/无类型 不限
};
