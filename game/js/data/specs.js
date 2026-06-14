/* specs.js —— 流派（专长）真实生效：每个流派提供实质战斗加成（不再只是标签）
 * 审计修正：原著专长改变战斗形态与属性走向，本文件让流派落到数值。
 * bonus 字段：powerPct(技能/攻击倍率) crit(暴击%) dodge(闪避%) armorPct hpPct healPct(治疗加成)
 */
window.DATA = window.DATA || {};

DATA.specBonus = {
  // 盗贼
  assassin:{ powerPct:0.12, crit:10, note:'爆发+12%、暴击+10%' },
  combat:{ powerPct:0.05, crit:5, dodge:8, note:'暴击+5%、闪避+8%、攻击+5%' },
  // 战士
  guardian:{ armorPct:0.32, hpPct:0.16, note:'护甲+32%、生命+16%（坦克）' },
  berserker:{ powerPct:0.20, note:'攻击+20%（输出）' },
  // 法师
  elementalist:{ powerPct:0.13, crit:4, note:'法术+13%、暴击+4%（群攻）' },
  arcanist:{ powerPct:0.08, crit:11, note:'法术+8%、暴击+11%（单体高爆）' },
  divine:{ powerPct:0.10, healPct:0.5, note:'神术+10%、治疗量+50%' },
  // 牧师
  holy:{ healPct:0.6, hpPct:0.10, note:'治疗量+60%、生命+10%' },
  shadow:{ powerPct:0.16, crit:6, note:'暗影/诅咒+16%、暴击+6%' },
  // 圣骑士
  protection:{ armorPct:0.26, healPct:0.3, hpPct:0.12, note:'护甲+26%、生命+12%、治疗+30%' },
  retribution:{ powerPct:0.15, crit:6, note:'圣光输出+15%、暴击+6%' },
  // 猎魔者
  marksman:{ powerPct:0.15, crit:8, note:'射击+15%、暴击+8%' },
  ranger:{ powerPct:0.06, crit:5, dodge:6, note:'攻击+6%、暴击+5%、闪避+6%' },
};

// 审计修正：法师补「圣言法师」第三流派（神术系，原著三系之一，最强最难练）
if (DATA.classes && DATA.classes.mage && !DATA.classes.mage.specs.some(s=>s.id==='divine')) {
  DATA.classes.mage.specs.push({ id:'divine', name:'圣言法师', desc:'三系中最强最难练：施展圣裁/圣言/璀璨光华等神术，兼具治疗与对黑暗生物增伤。' });
}
