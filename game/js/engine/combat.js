/* combat.js —— 回合制战斗引擎
 * Combat.start(spec) / Combat.act(action) / Combat.state() / Combat.logLines
 * spec: { enemies:[monsterId|def...], dungeonId, zoneId, isBoss, onEnd(result) }
 *   result: { outcome:'win'|'flee'|'death', xp, gold, loot:[{id,qty}], dungeonId }
 */
(function () {
  let C = null;            // 当前战斗
  const SKILLBONUS = { rogue: 2.0, assassin: 2.0 }; // 暴击倍率（盗贼系更高，致敬原著）

  function mkEnemy(ref) {
    const def = typeof ref === 'string' ? DATA.monsters[ref] : ref;
    if (!def) return null;
    return {
      def, id: def.id, name: def.name, icon: def.icon || '👹',
      level: def.level, type: def.type || 'normal',
      hp: def.hp, maxHp: def.hp, atk: def.atk, armor: def.def || def.armor || 0,
      dots: [], debuffs: [], stun: 0, skills: def.skills || [],
    };
  }

  function start(spec) {
    const queue = (spec.enemies || []).map(mkEnemy).filter(Boolean);
    C = {
      spec, queue, idx: 0, cur: queue[0] || null,
      turn: 0, over: false, result: null,
      pBuffs: [], pShield: 0, pStun: 0, cooldowns: {},
      acc: { xp: 0, gold: 0, loot: {}, genLoot: [] },   // 累计奖励
      logLines: [],
    };
    pushLog('sys', `遭遇 ${C.cur ? C.cur.name + (C.cur.type==='boss'?' [BOSS]':C.cur.type==='elite'?' [精英]':'') : '虚空'}！`);
    return state();
  }

  // ---------- 玩家行动 ----------
  function act(action) {
    if (!C || C.over) return state();
    // 玩家被眩晕
    if (C.pStun > 0) {
      pushLog('miss', `你被控制，无法行动！`);
      C.pStun--; enemyTurn(); tickEnd(); return state();
    }
    if (action.type === 'flee') return tryFlee();
    if (action.type === 'item') { useItem(action.id); }
    else if (action.type === 'skill') { if (!castSkill(action.id)) return state(); }
    else { autoAttack(); }

    if (!C.cur || C.cur.hp <= 0) { advance(); if (C.over) return state(); }
    else enemyTurn();
    allyTurn();
    tickEnd();
    return state();
  }

  function autoAttack() {
    const dmg = computeDamage(G.power, 1.0, 0, false);
    applyToEnemy(dmg, '你普通攻击');
    decCooldowns();
  }

  function castSkill(id) {
    const sk = DATA.skills[id]; if (!sk || sk.type !== 'active') return false;
    if ((C.cooldowns[id]||0) > 0) { Toast.show('技能冷却中'); return false; }
    if (G.mpCur < (sk.mpCost||0)) { Toast.show('法力不足'); return false; }
    G.mpCur -= (sk.mpCost||0);
    const e = sk.effect || {};
    const base = (DATA.classes[G.classId].magic ? (G.sp||G.power) : G.power);

    switch (e.kind) {
      case 'damage': {
        const dmg = computeDamage(base, e.mult||1, e.flat||0, e.guaranteedCrit, e.ignoreArmor);
        applyToEnemy(dmg, `你使用【${sk.name}】`);
        if (e.lifesteal) heal(Math.round(dmg.amount * e.lifesteal), '吸血');
        break;
      }
      case 'multi': {
        const hits = e.hits || 2;
        for (let i=0;i<hits;i++) { if(!C.cur||C.cur.hp<=0) break;
          const dmg = computeDamage(base, e.mult||0.6, e.flat||0, e.guaranteedCrit, e.ignoreArmor);
          applyToEnemy(dmg, `【${sk.name}】第${i+1}击`);
        }
        break;
      }
      case 'dot': {
        const inst = computeDamage(base, e.mult||0.5, e.flat||0, false, e.ignoreArmor);
        applyToEnemy(inst, `你使用【${sk.name}】`);
        C.cur.dots.push({ name: sk.name, dmg: Math.round(base*(e.dotMult||0.4)+ (e.dotFlat||0)), turns: e.dotTurns||3 });
        pushLog('sys', `${C.cur.name} 陷入【${sk.name}】持续效果。`);
        break;
      }
      case 'stun': {
        const dmg = computeDamage(base, e.mult||0.8, e.flat||0, e.guaranteedCrit, e.ignoreArmor);
        applyToEnemy(dmg, `你使用【${sk.name}】`);
        if (C.cur) { C.cur.stun += (e.stunTurns||1); pushLog('sys', `${C.cur.name} 被【${sk.name}】控制！`); }
        break;
      }
      case 'heal': {
        heal(Math.round(base*(e.healMult||1)+(e.flat||0)), sk.name);
        break;
      }
      case 'shield': {
        C.pShield += Math.round(base*(e.mult||0.8)+(e.flat||0));
        pushLog('heal', `你张开【${sk.name}】护盾 (${C.pShield})。`);
        break;
      }
      case 'buff': {
        C.pBuffs.push({ name: sk.name, stat:e.buff.stat, amt:e.buff.amt, turns:e.buff.turns||3 });
        pushLog('heal', `你获得增益【${sk.name}】。`);
        break;
      }
      case 'debuff': {
        if (e.mult) { const dmg=computeDamage(base,e.mult,e.flat||0,false); applyToEnemy(dmg,`你使用【${sk.name}】`); }
        if (C.cur) { C.cur.debuffs.push({ name:sk.name, stat:e.debuff.stat, amt:e.debuff.amt, turns:e.debuff.turns||3 });
          pushLog('sys', `${C.cur.name} 被削弱（${sk.name}）。`); }
        break;
      }
      case 'drain': {
        const dmg = computeDamage(base, e.mult||0.9, e.flat||0, false, e.ignoreArmor);
        applyToEnemy(dmg, `你使用【${sk.name}】`);
        heal(Math.round(dmg.amount*(e.lifesteal||0.5)), '汲取');
        G.mpCur = Math.min(G.maxMp, G.mpCur + Math.round(dmg.amount*0.2));
        break;
      }
      default: { const dmg=computeDamage(base,e.mult||1,e.flat||0,false); applyToEnemy(dmg,`你使用【${sk.name}】`); }
    }
    if (sk.cooldown) C.cooldowns[id] = sk.cooldown + 1; // +1 因本回合末会-1
    decCooldowns();
    return true;
  }

  function useItem(id) {
    const def = DATA.items[id]; if (!def || !def.use) { Toast.show('无法使用'); return; }
    if (Systems.countItem(id) <= 0) return;
    const u = def.use;
    if (u.hp) heal(u.hp, def.name);
    if (u.mp) { G.mpCur = Math.min(G.maxMp, G.mpCur + u.mp); pushLog('heal', `恢复 ${u.mp} 法力。`); }
    if (u.hpPct) heal(Math.round(G.maxHp*u.hpPct), def.name);
    Systems.removeItem(id, 1);
    decCooldowns();
  }

  // ---------- 敌方回合 ----------
  function enemyTurn() {
    const e = C.cur; if (!e || e.hp<=0) return;
    // DOT 结算
    runEnemyDots();
    if (e.hp<=0) { advance(); return; }
    if (e.stun > 0) { pushLog('miss', `${e.name} 被控制，无法行动。`); e.stun--; return; }
    // 闪避
    if (Math.random()*100 < G.dodge) { pushLog('miss', `你闪避了 ${e.name} 的攻击！`); return; }
    // 敌人技能/普攻
    let mult = 1.0, label = `${e.name} 攻击`;
    if (e.skills.length && Math.random() < 0.3) {
      const sid = e.skills[Systems.rand(0,e.skills.length-1)];
      const esk = DATA.skills[sid];
      if (esk) { mult = (esk.effect&&esk.effect.mult)||1.3; label = `${e.name} 使用【${esk.name}】`;
        if (esk.effect && esk.effect.stunTurns && Math.random()<0.5) { C.pStun += esk.effect.stunTurns; } }
    }
    let raw = Math.round(effAtk(e) * mult * (0.9 + Math.random()*0.2));
    // 百分比减伤（上限75%）——避免高护甲后期被怪只打1点而无脑平推
    const red = Math.min(0.75, G.armor / (G.armor + 220 + e.level*16));
    raw = Math.max(1, Math.round(raw * (1 - red)));
    // 暴击
    let crit = Math.random() < 0.08;
    if (crit) raw = Math.round(raw*1.5);
    // 护盾吸收
    if (C.pShield > 0) { const ab = Math.min(C.pShield, raw); C.pShield -= ab; raw -= ab;
      if (ab>0) pushLog('sys', `护盾吸收 ${ab} 伤害。`); }
    G.hpCur = Math.max(0, G.hpCur - raw);
    pushLog(crit?'crit':'dmg', `${label}，对你造成 ${raw} 伤害${crit?'（暴击）':''}。`);
    if (G.hpCur <= 0) death();
  }

  // ---- 宠物/随从协助 ----
  function allyTurn() {
    if (C.over || !G.pet || !C.cur || C.cur.hp<=0) return;
    const a = DATA.allies && DATA.allies[G.pet]; if (!a) return;
    if (a.healMul && G.hpCur < G.maxHp*0.5) {
      const h = Math.round((G.sp||G.power) * a.healMul + 20);
      G.hpCur = Math.min(G.maxHp, G.hpCur + h);
      pushLog('heal', `${a.icon||''}${a.name} 施法治疗你 ${h} 生命。`);
      return;
    }
    let dmg = Math.round(G.power * a.atkMul * (0.85 + Math.random()*0.3));
    if (!a.ignoreArmor) { const arm = enemyArmor(C.cur); dmg = Math.round(dmg * (1 - arm/(arm+60+C.cur.level*10))); }
    dmg = Math.max(1, dmg);
    C.cur.hp = Math.max(0, C.cur.hp - dmg);
    pushLog('dmg', `${a.icon||''}${a.name} 协助攻击，造成 ${dmg} 伤害。`);
    if (C.cur.hp<=0) { pushLog('sys', `${C.cur.name} 被击败！`); advance(); }
  }

  function effAtk(e) {
    let a = e.atk;
    for (const d of e.debuffs) if (d.stat==='atk') a -= d.amt;
    return Math.max(1, a);
  }

  // ---------- 伤害/治疗核心 ----------
  function computeDamage(base, mult, flat, forceCrit, ignoreArmor) {
    let amount = base * mult + (flat||0);
    // 玩家增益
    for (const b of C.pBuffs) if (b.stat==='atk') amount += b.amt;
    amount *= (0.92 + Math.random()*0.16);
    const cls = DATA.classes[G.classId];
    let isCrit = forceCrit || (Math.random()*100 < critChance());
    const cm = SKILLBONUS[G.classId] || 1.8;
    if (isCrit) amount *= cm;
    amount = Math.round(amount);
    if (!ignoreArmor && C.cur) {
      const arm = enemyArmor(C.cur);
      const red = arm / (arm + 60 + C.cur.level*10);
      amount = Math.round(amount * (1 - red));
    }
    amount = Math.max(1, amount);
    return { amount, crit: isCrit };
  }
  function critChance() {
    let c = G.crit;
    for (const b of C.pBuffs) if (b.stat==='crit') c += b.amt;
    return Math.min(75, c);
  }
  function enemyArmor(e){ let a=e.armor; for(const d of e.debuffs) if(d.stat==='armor') a-=d.amt; return Math.max(0,a); }

  function applyToEnemy(dmg, label) {
    if (!C.cur) return;
    C.cur.hp = Math.max(0, C.cur.hp - dmg.amount);
    pushLog(dmg.crit?'crit':'dmg', `${label}，造成 ${dmg.amount} 伤害${dmg.crit?'（暴击！）':''}。`);
    if (C.cur.hp<=0) pushLog('sys', `${C.cur.name} 被击败！`);
  }
  function heal(amt, src) {
    amt = Math.max(0, Math.round(amt * (G.healMul||1)));
    const before = G.hpCur;
    G.hpCur = Math.min(G.maxHp, G.hpCur + amt);
    pushLog('heal', `${src} 恢复 ${G.hpCur-before} 生命。`);
  }

  function runEnemyDots() {
    const e = C.cur; if (!e) return;
    for (const d of e.dots) { if (d.turns>0) {
      e.hp = Math.max(0, e.hp - d.dmg); d.turns--;
      pushLog('dmg', `${e.name} 受到【${d.name}】 ${d.dmg} 持续伤害。`);
    }}
    e.dots = e.dots.filter(d=>d.turns>0);
    if (e.hp<=0) pushLog('sys', `${e.name} 因持续伤害倒下！`);
  }

  function decCooldowns() {
    for (const k in C.cooldowns) if (C.cooldowns[k]>0) C.cooldowns[k]--;
    for (const b of C.pBuffs) b.turns--;
    C.pBuffs = C.pBuffs.filter(b=>b.turns>0);
    if (C.cur) { for (const d of C.cur.debuffs) d.turns--; C.cur.debuffs = C.cur.debuffs.filter(d=>d.turns>0); }
  }

  // ---------- 流程 ----------
  function advance() {
    // 当前敌人死亡：结算奖励，进入下一个
    const dead = C.cur;
    if (dead) {
      C.acc.xp += xpFor(dead);
      const g = Systems.rand(dead.def.goldMin||0, dead.def.goldMax||0);
      C.acc.gold += g;
      G.kills[dead.id] = (G.kills[dead.id]||0)+1;
      G.stats.monstersKilled++;
      if (dead.type==='boss') G.stats.bossKills++;
      const loot = Systems.rollLoot(dead.def);
      for (const l of loot) { C.acc.loot[l.id] = (C.acc.loot[l.id]||0)+l.qty; }
      Quests.onKill(dead.id);
      if (loot.length) pushLog('loot', `掉落：${loot.map(l=>itemName(l.id)+(l.qty>1?'×'+l.qty:'')).join('，')}`);
      // 按怪物专属掉落表生成装备（类型限职业、数值浮动，无花哨词缀）
      const gl = dead.def.gearLoot;
      if (window.Items && gl) {
        for (let i=0;i<(gl.n||1);i++){
          if (Math.random() >= gl.chance) continue;
          const inst = Items.gen(dead.level, { luck: gl.luck||0, forClass: G.classId,
            theme: { armor: gl.themeArmor, weapons: gl.themeWeapons } });
          C.acc.genLoot.push(inst);
          pushLog('loot', `掉落：<span class="${DATA.qualities[inst.quality].cls}">${inst.name}</span>`);
        }
      }
    }
    C.idx++;
    if (C.idx < C.queue.length) {
      C.cur = C.queue[C.idx];
      pushLog('sys', `下一个：${C.cur.name}${C.cur.type==='boss'?' [BOSS]':''} 出现！`);
    } else {
      win();
    }
  }

  function win() {
    C.over = true;
    // 胜利后喘息：恢复部分生命与资源（连续探索仍有损耗压力，但不至于死亡螺旋）
    G.hpCur = Math.min(G.maxHp, G.hpCur + Math.round(G.maxHp*0.12) + G.regenHp);
    G.mpCur = Math.min(G.maxMp, G.mpCur + Math.round(G.maxMp*0.12) + G.regenMp);
    // 发放累计奖励
    Systems.addGold(C.acc.gold);
    const xpres = Systems.gainXp(C.acc.xp);
    const lootArr = Object.keys(C.acc.loot).map(id=>({id,qty:C.acc.loot[id]}));
    for (const l of lootArr) Systems.addItem(l.id, l.qty);
    for (const inst of C.acc.genLoot) Systems.addInstance(inst);
    const genArr = C.acc.genLoot.slice();
    let dgReward = null;
    if (C.spec.dungeonId) {
      const dg = DATA.dungeons[C.spec.dungeonId];
      const first = !G.dungeonClears[C.spec.dungeonId];
      G.dungeonClears[C.spec.dungeonId] = (G.dungeonClears[C.spec.dungeonId]||0)+1;
      Quests.onClearDungeon(C.spec.dungeonId);
      if (window.World && G.guild) World.addContribution(dg && dg.levelRange ? Math.max(10, Math.round(dg.levelRange[0]/2)) : 20);
      if (first && dg && dg.firstClear) {
        dgReward = dg.firstClear;
        if (dgReward.xp) Systems.gainXp(dgReward.xp);
        if (dgReward.gold) Systems.addGold(dgReward.gold);
        if (dgReward.items) for (const it of dgReward.items) Systems.addItem(it.id, it.qty||1);
      }
    }
    Save.save();
    const result = { outcome:'win', xp:C.acc.xp, gold:C.acc.gold, loot:lootArr, genLoot:genArr,
      leveled: xpres.leveled, gained: xpres.gained, dungeonId:C.spec.dungeonId, dgReward };
    if (C.spec.onEnd) C.spec.onEnd(result);
    C.result = result;
  }

  function tryFlee() {
    if (C.spec.dungeonId && C.cur && C.cur.type==='boss') { Toast.show('无法从BOSS战中逃离！'); return state(); }
    const ok = Math.random() < (C.cur && C.cur.type==='boss' ? 0 : 0.55 + G.dodge*0.01);
    if (ok) { C.over=true; pushLog('sys','你成功脱离了战斗。');
      Save.save();
      const r={outcome:'flee'}; if(C.spec.onEnd) C.spec.onEnd(r); C.result=r; }
    else { pushLog('miss','逃跑失败！'); enemyTurn(); tickEnd(); }
    return state();
  }

  function death() {
    C.over = true;
    G.stats.deaths++;
    // 死亡惩罚：副本/战场较轻（掉经验不掉钱）；野外较重（掉更多经验+铜币）
    const inInstance = !!(C.spec.dungeonId || C.spec.bgId);
    const xpPct = inInstance ? 0.10 : 0.15;
    const lossXp = Math.round(Systems.xpToNext(G.level) * xpPct);
    G.xp = Math.max(0, G.xp - lossXp);
    const lossGold = inInstance ? 0 : Math.round(G.gold * 0.06);
    G.gold -= lossGold;
    pushLog('sys', `你倒下了……损失 ${lossXp} 经验${lossGold?`、${lossGold} 铜币`:''}，将在主城墓地复活（虚弱）。`);
    G.hpCur = Math.round(G.maxHp*0.3); G.mpCur = Math.round(G.maxMp*0.3);
    Save.save();
    const r = { outcome:'death', lossXp, lossGold };
    if (C.spec.onEnd) C.spec.onEnd(r); C.result = r;
  }

  function tickEnd() { C.turn++; }

  // ---------- 取数 ----------
  function xpFor(e){ const base = e.def.xp || (e.level*8); return Math.round(base); }
  function itemName(id){ const d=DATA.items[id]; return d?d.name:id; }

  // ---------- 日志 ----------
  function pushLog(cls, text) { C.logLines.push({cls,text}); }
  function state() {
    return {
      over: C.over, result: C.result,
      enemy: C.cur ? { name:C.cur.name, icon:C.cur.icon, level:C.cur.level, type:C.cur.type,
        hp:C.cur.hp, maxHp:C.cur.maxHp, dots:C.cur.dots, debuffs:C.cur.debuffs, stun:C.cur.stun } : null,
      remaining: C.queue.length - C.idx - 1,
      total: C.queue.length,
      cooldowns: C.cooldowns, pBuffs: C.pBuffs, pShield: C.pShield, pStun: C.pStun,
      log: C.logLines,
    };
  }

  window.Combat = {
    start, act, state,
    cooldown(id){ return (C&&C.cooldowns[id])||0; },
    active(){ return C && !C.over; },
    get logLines(){ return C?C.logLines:[]; },
  };
})();
