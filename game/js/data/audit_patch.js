/* audit_patch.js —— 审计落地：神器品质 / 命运物品·三连命骰 / 潘多拉合成 / 图书馆语言
 * 在 balance.js 之前加载（不新增怪物，仅补品质/物品/掉落/配置）。
 */
window.DATA = window.DATA || {};

// ===== 第 9 级品质：神器（神物之上）=====
DATA.qualities.artifact = { key:'artifact', name:'神器', cls:'q-dark', affixMax:6, tier:8, sockets:6 };
if (DATA.qualityOrder.indexOf('artifact')<0) DATA.qualityOrder.push('artifact');
if (window.Items && Items.QMUL) Items.QMUL.artifact = 6.6;

// ===== 神器物品 =====
DATA.items.si_reaper = { name:'死神之刃', slot:'offhand', quality:'artifact', type:'神器', reqLevel:150,
  stats:{atk:280, sp:200, crit:20, str:40, agi:40}, value:0, icon:'🗡️',
  desc:'哈迪斯之瑰宝、开启地狱之门的钥匙。神器级——与传奇有本质差别，死亡掉落、不可入仓库。' };

// ===== 命运物品：被诅咒的骷髅（三连命骰）=====
DATA.items.cursed_skull = { name:'被诅咒的骷髅', type:'命运物品', quality:'dark', stackable:true, value:0, icon:'💀',
  desc:'命运物品。捏碎可投掷三次命骰：>3 得奖励、≤3 遭诅咒，数字越极端结果越剧烈。由主脑掌控，无法作弊。' };

// 让命运物品/神器从相应 BOSS 掉落
(function(){
  const push=(id,drop)=>{ if(DATA.monsters[id]){ DATA.monsters[id].drops=DATA.monsters[id].drops||[]; DATA.monsters[id].drops.push(drop); } };
  push('serisotot',{item:'cursed_skull',chance:0.4});
  push('lich',{item:'cursed_skull',chance:0.6});
  push('aina2',{item:'cursed_skull',chance:0.5});
  push('dilakru',{item:'si_reaper',chance:0.25});
  push('upton',{item:'cursed_skull',chance:0.8});
})();

// ===== 图书馆 / 语言学习配置 =====
DATA.library = {
  attrs:[['str','力量'],['agi','敏捷'],['int','智力'],['sta','体质'],['spi','精神']],
  maxPerAttr:10, baseCost:2000,           // 研读典籍：永久 +1 属性，费用随次数递增
  langs:['通用语','龙族语','古通用语','科沙特巨人语','精灵语'], langCost:1500,
};
