/* balance.js —— 战斗数值规整（最后加载）
 * 原著 BOSS 动辄数百万血是为 200 人团队设计；本作为单人 WAP，统一按
 * 「玩家预估战力」重算全体怪物 血量/攻击/护甲，保证单人 5-30 回合可解。
 * 保留 name/icon/level/type/xp/gold/drops/skills，仅覆盖 hp/atk/maxHp/def。
 */
(function(){
  function estPower(L){ return 12*L + 18; }   // 玩家在该等级带成型时的近似战力
  for(const id in DATA.monsters){
    const m=DATA.monsters[id]; const L=m.level||1; const P=estPower(L);
    let hpMul, atkMul;
    // 调难：BOSS/精英显著提攻击与血量，普通本需嗑药、困难+有死亡风险，不再平推
    if(m.type==='boss'){ hpMul = (L>=150?34:22); atkMul=0.62; }
    else if(m.type==='elite'){ hpMul=4.6; atkMul=0.42; }
    else { hpMul=2.0; atkMul=0.27; }
    m.hp = m.maxHp = Math.max(24, Math.round(P*hpMul));
    m.atk = Math.max(3, Math.round(P*atkMul));
    m.def = Math.round(L*1.4);
    // 经济收紧：怪物金币掉落下调
    if(m.goldMin) m.goldMin = Math.round(m.goldMin*0.75);
    if(m.goldMax) m.goldMax = Math.round(m.goldMax*0.75);
  }
})();
