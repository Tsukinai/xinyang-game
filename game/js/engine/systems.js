/* systems.js —— 属性派生 / 升级 / 装备 / 背包 / 经济 / 技能 / 任务 引擎
 * 全局：Systems, Skills, Quests, Econ
 */
(function () {
  const LEVEL_CAP = 150;
  const STAT_PER_LEVEL = 3;          // 每级可手动分配点数
  const QUALITY_ORDER = ['white','green','blue','purple','silver','gold','dark'];

  // ===== 等级与经验 =====
  function xpToNext(level) { return Math.floor(60 + 70 * level + 14 * level * level); }

  // ===== 最终属性（基础+成长+加点+装备） =====
  function finalAttr() {
    const a = { str:0, agi:0, int:0, sta:0, spi:0 };
    for (const k in a) a[k] = (G.base[k] || 0) + (G.alloc[k] || 0);
    // 装备加成
    for (const slot in G.equip) {
      const it = G.equip[slot]; if (!it) continue;
      const st = itemStats(it);
      for (const k in a) if (st[k]) a[k] += st[k];
    }
    // 坐骑属性加成
    if (G.mount && DATA.mounts && DATA.mounts[G.mount] && DATA.mounts[G.mount].stat) {
      const ms = DATA.mounts[G.mount].stat;
      for (const k in a) if (ms[k]) a[k] += ms[k];
    }
    return a;
  }

  // 取得物品（含实例）的属性表
  function itemStats(it) {
    const def = (window.Items ? Items.def(it) : (DATA.items[it.id])) || {};
    const s = Object.assign({}, def.stats || {});
    // 宝石镶嵌加成
    if (it.gems) for (const g of it.gems) {
      const gd = DATA.items[g]; if (gd && gd.stats) for (const k in gd.stats) s[k] = (s[k]||0) + gd.stats[k];
    }
    // 强化加成
    if (it.plus) { const m = it.plus; s.atk = (s.atk||0) + Math.round((def.stats&&def.stats.atk||0)*0.1*m);
      s.armor = (s.armor||0) + Math.round((def.stats&&def.stats.armor||0)*0.1*m); }
    return s;
  }

  // ===== 套装：统计已装备套装件数与生效加成 =====
  function equippedSetCounts() {
    const c = {};
    for (const slot in G.equip) { const it=G.equip[slot]; if(!it) continue;
      const def = window.Items ? Items.def(it) : DATA.items[it.id];
      if (def && def.set) c[def.set] = (c[def.set]||0)+1;
    }
    return c;
  }
  function setBonuses() {
    const counts = equippedSetCounts(); const stats={}, skills=[], info=[];
    for (const sid in counts) { const set=(DATA.sets||{})[sid]; if(!set) continue; const n=counts[sid];
      for (const thr in (set.bonus||{})) { const b=set.bonus[thr]; const on = n>=(+thr);
        if (on) { if(b.stats) for(const k in b.stats) stats[k]=(stats[k]||0)+b.stats[k];
          if(b.skill && skills.indexOf(b.skill)<0) skills.push(b.skill); }
        info.push({ name:set.name, thr:+thr, have:n, total:(set.pieces||[]).length, desc:b.desc, active:on });
      }
    }
    return { stats, skills, info };
  }

  // ===== 重算派生战斗属性 =====
  function recompute() {
    const cls = DATA.classes[G.classId];
    const a = finalAttr();
    const setB = setBonuses();
    // 套装属性加成（先并入主属性，再驱动派生）
    for (const k of ['str','agi','int','sta','spi']) if (setB.stats[k]) a[k] = (a[k]||0) + setB.stats[k];
    G.attr = a;
    G.setSkills = setB.skills;
    G.activeSets = setB.info;
    let atk=setB.stats.atk||0, sp=setB.stats.sp||0, armor=setB.stats.armor||0, hp=setB.stats.hp||0,
        mp=setB.stats.mp||0, crit=setB.stats.crit||0, dodge=setB.stats.dodge||0, haste=setB.stats.haste||0;
    for (const slot in G.equip) { const it=G.equip[slot]; if(!it) continue;
      const st=itemStats(it);
      atk+=st.atk||0; sp+=st.sp||0; armor+=st.armor||0; hp+=st.hp||0; mp+=st.mp||0;
      crit+=st.crit||0; dodge+=st.dodge||0; haste+=st.haste||0;
    }
    // 主属性驱动攻击力
    const primary = a[cls.power] || 0;
    const physBase = primary * 2 + a.str * 0.5;
    const spellBase = a.int * 2 + a.spi * (cls.role==='healer'?1.2:0.5);
    G.atk = Math.round(cls.magic ? 0 : physBase) + atk + G.level*2;
    G.sp  = Math.round(cls.magic ? spellBase : 0) + sp;
    G.power = cls.magic ? G.sp + atk : G.atk;       // 技能伤害基准
    G.maxHp = Math.round(40 + a.sta * 9 + G.level * 8 + hp);
    G.maxMp = Math.round(30 + a.int * 6 + a.spi * 4 + G.level * 5 + mp);
    G.armor = Math.round(armor + a.agi * 0.4);
    G.crit  = Math.min(60, 3 + a.agi * 0.05 + crit);       // %
    G.dodge = Math.min(40, 2 + a.agi * 0.06 + dodge);      // %
    G.haste = haste;                                       // 影响出手/冷却（简化）
    G.regenHp = Math.round(2 + a.spi * 0.4 + G.level * 0.3);
    G.regenMp = Math.round(2 + a.spi * 0.5 + a.int * 0.2);
    // 被动技能加成
    for (const sid of (G.skills||[])) {
      const sk = DATA.skills[sid];
      if (sk && sk.type==='passive' && sk.effect && sk.effect.stats) {
        const st = sk.effect.stats;
        G.crit += st.crit||0; G.dodge += st.dodge||0; G.armor += st.armor||0;
        G.atk += st.atk||0; G.maxHp += st.hp||0;
      }
    }
    // 流派（专长）加成 —— 让流派真实生效
    G.healMul = 1;
    const sb = G.spec && DATA.specBonus && DATA.specBonus[G.spec];
    if (sb) {
      if (sb.powerPct) { G.power = Math.round(G.power*(1+sb.powerPct)); G.atk = Math.round(G.atk*(1+sb.powerPct)); G.sp = Math.round(G.sp*(1+sb.powerPct)); }
      if (sb.armorPct) G.armor = Math.round(G.armor*(1+sb.armorPct));
      if (sb.hpPct) G.maxHp = Math.round(G.maxHp*(1+sb.hpPct));
      if (sb.crit) G.crit += sb.crit;
      if (sb.dodge) G.dodge += sb.dodge;
      if (sb.healPct) G.healMul = 1 + sb.healPct;
    }
    G.crit = Math.min(75, G.crit); G.dodge = Math.min(50, G.dodge);
    if (G.hpCur > G.maxHp) G.hpCur = G.maxHp;
    if (G.mpCur > G.maxMp) G.mpCur = G.maxMp;
  }

  function fullHeal() { G.hpCur = G.maxHp; G.mpCur = G.maxMp; }
  function restTick() { // 城镇/野外回复
    G.hpCur = Math.min(G.maxHp, G.hpCur + G.regenHp);
    G.mpCur = Math.min(G.maxMp, G.mpCur + G.regenMp);
  }

  // ===== 升级 =====
  function gainXp(n) {
    if (G.level >= LEVEL_CAP) return { leveled:false };
    G.xp += n;
    let leveled = false, gained = 0;
    while (G.level < LEVEL_CAP && G.xp >= xpToNext(G.level)) {
      G.xp -= xpToNext(G.level);
      levelUp(); leveled = true; gained++;
    }
    if (G.level >= LEVEL_CAP) G.xp = 0;
    return { leveled, gained };
  }
  function levelUp() {
    const cls = DATA.classes[G.classId];
    G.level++;
    for (const k in cls.growth) G.base[k] = (G.base[k]||0) + cls.growth[k];
    G.statPoints += STAT_PER_LEVEL;
    if (G.level % 5 === 0 && G.level <= 30) { G.talentPoints++; G.skillPoints++; }
    Skills.syncLearned();
    recompute(); fullHeal();
    Quests.autoOffer();
  }
  function allocate(stat, n) {
    n = n || 1;
    if (G.statPoints < n) return false;
    G.alloc[stat] = (G.alloc[stat]||0) + n;
    G.statPoints -= n;
    recompute();
    return true;
  }
  function resetAlloc() {
    let pts = 0; for (const k in G.alloc) { pts += G.alloc[k]; G.alloc[k]=0; }
    G.statPoints += pts; recompute();
  }

  // ===== 背包/装备 =====
  function addItem(id, qty) {
    qty = qty || 1;
    const def = DATA.items[id]; if (!def) return;
    if (def.stackable !== false && !def.slot) { // 可堆叠（消耗/材料）
      const e = G.bag.find(x => x.id === id && !x.gen);
      if (e) e.qty += qty; else G.bag.push({ id, qty });
    } else {
      for (let i=0;i<qty;i++) G.bag.push({ id, qty:1, uid: uid() });
    }
  }
  // 加入一件生成实例（随机词缀装备等）
  function addInstance(inst){ if (inst) { inst.qty = 1; G.bag.push(inst); } }
  function removeItem(id, qty) {
    qty = qty || 1;
    const i = G.bag.findIndex(x => x.id === id);
    if (i < 0) return false;
    if (G.bag[i].qty > qty) G.bag[i].qty -= qty; else G.bag.splice(i,1);
    return true;
  }
  function countItem(id){ let n=0; for(const e of G.bag) if(e.id===id) n+=e.qty; return n; }

  function canEquip(it) {
    const def = window.Items ? Items.def(it) : DATA.items[it.id]; if (!def || !def.slot) return false;
    if (def.reqLevel && G.level < def.reqLevel) return { ok:false, why:'等级不足' };
    if (def.classes && def.classes.indexOf(G.classId) < 0) return { ok:false, why:'职业不符' };
    // 装备类型限制：护甲/武器只能由对应职业穿戴
    if (DATA.canClassUse && !DATA.canClassUse(def, G.classId)) {
      const cg = DATA.classGear[G.classId];
      if (def.weaponType) return { ok:false, why:'武器不符（'+DATA.classes[G.classId].name+'只能用'+cg.weapons.map(w=>DATA.weaponTypes[w]).join('/')+'）' };
      if (def.armorType) return { ok:false, why:'护甲不符（'+DATA.classes[G.classId].name+'只能穿'+DATA.armorTypes[cg.armor]+'）' };
      return { ok:false, why:'无法穿戴' };
    }
    return { ok:true };
  }
  function equip(bagIndex) {
    const it = G.bag[bagIndex]; if (!it) return false;
    const def = window.Items ? Items.def(it) : DATA.items[it.id]; if (!def || !def.slot) return false;
    const chk = canEquip(it); if (chk.ok===false) return chk;
    let slot = def.slot;
    if (slot === 'ring1' && G.equip.ring1 && !G.equip.ring2) slot = 'ring2'; // 双戒指位
    const old = G.equip[slot];
    G.equip[slot] = it;
    G.bag.splice(bagIndex,1);
    if (old) G.bag.push(old);
    recompute();
    return { ok:true };
  }
  function unequip(slot) {
    const it = G.equip[slot]; if (!it) return false;
    delete G.equip[slot];
    G.bag.push(it);
    recompute();
    return true;
  }

  // ===== 经济 =====
  function addGold(n){ G.gold = Math.max(0, G.gold + n); }
  function buy(id) {
    const def = DATA.items[id]; if (!def) return { ok:false, why:'无此物品' };
    const price = def.value ? Math.round(def.value * 1.4) : 10;
    if (G.gold < price) return { ok:false, why:'铜币不足' };
    G.gold -= price; addItem(id,1);
    return { ok:true, price };
  }
  function sell(bagIndex) {
    const it = G.bag[bagIndex]; if (!it) return false;
    const def = window.Items ? Items.def(it) : DATA.items[it.id];
    const unit = def && def.value ? Math.max(1, Math.round(def.value*0.25)) : 1;
    const gain = unit * (it.qty||1);
    addGold(gain);
    G.bag.splice(bagIndex,1);
    return gain;
  }

  // ===== 掉落 =====
  function rollLoot(monster) {
    const out = [];
    const drops = monster.drops || [];
    for (const d of drops) {
      if (Math.random() < d.chance) {
        const qty = d.qtyMax ? rand(d.qtyMin||1, d.qtyMax) : 1;
        out.push({ id: d.item, qty });
      }
    }
    return out;
  }

  // ===== 强化（幸运宝石砸级）=====
  function enhance(item) {
    if (!item) return { ok:false, why:'无装备' };
    if (countItem('lucky_gem') <= 0) return { ok:false, why:'缺少幸运宝石' };
    const plus = item.plus || 0;
    if (plus >= 20) return { ok:false, why:'已达强化上限 +20' };
    removeItem('lucky_gem', 1);
    let rate, onFail;
    if (plus < 5) { rate = 0.6; onFail = () => { item.plus = Math.max(0, plus - 1); }; }
    else if (plus < 10) { rate = 0.5; onFail = () => { item.plus = 5; }; }
    else if (plus < 15) { rate = 0.5; onFail = () => { item.__broke = true; }; }   // 失败爆装
    else { rate = 0.35; onFail = () => { item.__broke = true; }; }
    if (Math.random() < rate) { item.plus = plus + 1; recompute();
      return { ok:true, result:'success', plus:item.plus }; }
    onFail();
    if (item.__broke) return { ok:true, result:'broke' };
    recompute();
    return { ok:true, result:'fail', plus:item.plus };
  }
  function socketCount(it){ const def = window.Items?Items.def(it):DATA.items[it.id]; if(!def) return 0;
    return def.sockets != null ? def.sockets : ((DATA.qualities[def.quality]||{}).sockets||0); }
  function socketGem(item, gemId) {
    if (!item) return { ok:false, why:'无装备' };
    item.gems = item.gems || [];
    if (item.gems.length >= socketCount(item)) return { ok:false, why:'没有空余凹槽' };
    if (countItem(gemId) <= 0) return { ok:false, why:'没有该宝石' };
    removeItem(gemId, 1);
    item.gems.push(gemId);
    recompute();
    return { ok:true };
  }

  // ===== 一键售卖 =====
  // kind: 'nonclass'(非本职业可用装备) | 'lowlevel'(需求等级≤当前-8的低级装备)
  function _bulkMatch(kind, def){
    if (!def || !def.slot || !def.value) return false;       // 仅可装备且有价值的装备
    // 本职业专属神装（带 classes 限定且本职业可用）：任何一键卖都保护
    const special = def.classes && DATA.canClassUse && DATA.canClassUse(def, G.classId);
    if (kind==='nonclass') return DATA.canClassUse && !DATA.canClassUse(def, G.classId);
    if (kind==='lowlevel'){
      if (special) return false;
      const q = def.quality || 'white';
      if (['gold','dark','epic','legend','divine','artifact'].includes(q)) return false; // 保护金色以上
      if ((q==='white'||q==='bronze') && (def.reqLevel||1) < G.level) return true;        // 白/青铜杂物（已过当前等级）
      if ((def.reqLevel||0) <= G.level - 5) return true;                                   // 明显过时的装备
      return false;
    }
    return false;
  }
  function bulkSellPreview(kind){
    let gold=0,count=0;
    for (const it of G.bag){ const def = window.Items?Items.def(it):DATA.items[it.id];
      if(!_bulkMatch(kind,def)) continue;
      gold += Math.max(1, Math.round(def.value*0.25)) * (it.qty||1); count++;
    }
    return { count, gold };
  }
  function bulkSell(kind){
    let gold=0,count=0;
    for (let i=G.bag.length-1;i>=0;i--){ const it=G.bag[i]; const def = window.Items?Items.def(it):DATA.items[it.id];
      if(!_bulkMatch(kind,def)) continue;
      gold += Math.max(1, Math.round(def.value*0.25)) * (it.qty||1); count++; G.bag.splice(i,1);
    }
    if(count) addGold(gold);
    return { count, gold };
  }

  // ===== 工具 =====
  function rand(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
  function uid(){ return (G.__uc=(G.__uc||0)+1); }
  function qualityRank(q){ return QUALITY_ORDER.indexOf(q); }

  // ===== 战力评分 =====
  const SCORE_W = {str:2,agi:2,int:2,sta:2,spi:2,atk:1,sp:1,armor:1.5,hp:0.2,mp:0.1,crit:10,dodge:8,haste:5};
  function statScore(s){ let v=0; for(const k in SCORE_W) v+=(s[k]||0)*SCORE_W[k]; return Math.round(v); }
  function powerScore(){ return statScore({atk:G.atk,sp:G.sp,hp:G.maxHp,mp:G.maxMp,armor:G.armor,crit:G.crit,dodge:G.dodge,haste:G.haste}); }

  window.Systems = {
    LEVEL_CAP, xpToNext, recompute, fullHeal, restTick, gainXp, levelUp,
    allocate, resetAlloc, addItem, addInstance, removeItem, countItem, equip, unequip, canEquip,
    addGold, buy, sell, rollLoot, itemStats, finalAttr, rand, qualityRank, QUALITY_ORDER,
    enhance, socketGem, socketCount, setBonuses, equippedSetCounts,
    bulkSell, bulkSellPreview, statScore, powerScore,
  };

  // ===================== 技能 =====================
  window.Skills = {
    syncLearned() {
      const cls = DATA.classes[G.classId];
      for (const sid of cls.skills) {
        const sk = DATA.skills[sid];
        if (!sk) continue;
        if (sk.advReq && !G.flags['adv'+sk.advReq]) continue; // 转职后才能学
        if (G.level >= (sk.reqLevel||1) && !G.learned[sid]) {
          G.learned[sid] = true;
          if (G.skills.indexOf(sid) < 0) G.skills.push(sid);
        }
      }
    },
    list() { return G.skills.map(id => DATA.skills[id]).filter(Boolean); },
    actives() { return this.list().filter(s => s.type === 'active'); },
    // 技能熟练度/练级：用技能积累熟练度，升级增强威力（上限10级）
    profLv(id){ const p=(G.skillProf||{})[id]; return (p&&p.lv)||1; },
    profMul(id){ return 1 + (this.profLv(id)-1)*0.03; },   // 每级 +3% 威力，10级 +27%
    gainProf(id, amt){
      G.skillProf = G.skillProf||{};
      const p = G.skillProf[id] = G.skillProf[id]||{lv:1,exp:0};
      if(p.lv>=10) return false;
      p.exp += amt||1; const need = p.lv*8;
      if(p.exp>=need){ p.exp-=need; p.lv++; return p.lv; }
      return false;
    },
    // 技能书习得
    learnBook(skillId){
      if(!DATA.skills[skillId]) return false;
      if(G.skills.indexOf(skillId)>=0 || (G.bookSkills||[]).indexOf(skillId)>=0) return 'have';
      G.learned[skillId]=true; G.skills.push(skillId); G.bookSkills=G.bookSkills||[]; G.bookSkills.push(skillId);
      recompute(); return true;
    },
    learnLife(name){ if(name==='lockpick'){ G.lockpick=G.lockpick||{learned:false,lv:1,exp:0}; if(G.lockpick.learned) return 'have'; G.lockpick.learned=true; return true; } return false; },
    passives() { return this.list().filter(s => s.type === 'passive'); },
    nextUnlock() {
      const cls = DATA.classes[G.classId];
      let best = null;
      for (const sid of cls.skills) {
        const sk = DATA.skills[sid];
        if (sk && !G.learned[sid] && (!best || sk.reqLevel < best.reqLevel)) best = sk;
      }
      return best;
    }
  };

  // ===================== 任务 =====================
  window.Quests = {
    // 把满足前置/等级的任务标记为可接（available）——实际接取在 NPC 处
    autoOffer() {
      for (const id in DATA.quests) {
        const q = DATA.quests[id];
        if (G.questsDone[id]) continue;
        if (G.quests[id]) continue;
        // 不主动 active，只判定可见性，由 UI 通过 isAvailable 查询
      }
    },
    isAvailable(id) {
      const q = DATA.quests[id]; if (!q) return false;
      if (G.questsDone[id] || G.quests[id]) return false;
      if (q.classReq && q.classReq !== G.classId) return false;
      if (q.reqLevel && G.level < q.reqLevel) return false;
      if (q.prereq) for (const p of q.prereq) if (!G.questsDone[p]) return false;
      return true;
    },
    accept(id) {
      if (!this.isAvailable(id)) return false;
      G.quests[id] = { status:'active', prog:0 };
      // 立即可完成型(对话/到达)交给具体触发
      return true;
    },
    active() { return Object.keys(G.quests).filter(id => G.quests[id].status==='active'); },
    progressText(id) {
      const q = DATA.quests[id], st = G.quests[id]; if (!q||!st) return '';
      const o = q.objective || {};
      if (o.count) return `${Math.min(st.prog,o.count)}/${o.count}`;
      return st.status==='done'?'可交付':'进行中';
    },
    isComplete(id) {
      const q = DATA.quests[id], st = G.quests[id]; if (!q||!st) return false;
      if (q.requireAllOrder) return ['正义','善良','勇气','智慧','公正','自由'].every(c=>G.orderChapters[c]);
      if (st.status==='done') return true;
      const o = q.objective||{};
      if (!o.count) return false;
      return st.prog >= o.count;
    },
    // 事件钩子
    onKill(monsterId) { this._hook('kill', monsterId); },
    onCollect(itemId) { this._hook('collect', itemId); },
    onClearDungeon(dgId) { this._hook('clear', dgId); },
    onReach(cityId) { this._hook('reach', cityId); },
    onTalk(npcId) { this._hook('talk', npcId); },
    _hook(kind, target) {
      for (const id of this.active()) {
        const q = DATA.quests[id]; const o = q.objective||{};
        if (o.kind !== kind) continue;
        if (kind==='collect') { // 以背包持有数为准
          if (o.target===target) { G.quests[id].prog = Systems.countItem(o.target); }
        } else if (o.target===target) {
          G.quests[id].prog = (G.quests[id].prog||0) + 1;
        }
        if (o.count && G.quests[id].prog >= o.count) G.quests[id].status='done';
        if (!o.count && (kind==='reach'||kind==='talk'||kind==='clear')) G.quests[id].status='done';
      }
    },
    turnIn(id) {
      const q = DATA.quests[id]; if (!q || !this.isComplete(id)) return false;
      // 收集类消耗物品
      const o = q.objective||{};
      if (o.kind==='collect' && o.count) Systems.removeItem(o.target, o.count);
      const r = q.rewards||{};
      if (r.xp) Systems.gainXp(r.xp);
      if (r.gold) Systems.addGold(r.gold);
      if (r.items) for (const it of r.items) Systems.addItem(it.id, it.qty||1);
      if (r.rep) for (const f in r.rep) G.reputation[f] = (G.reputation[f]||0) + r.rep[f];
      if (r.unlockFlag) G.flags[r.unlockFlag] = true;
      if (r.title && G.titles.indexOf(r.title)<0) { G.titles.push(r.title); if(!G.title) G.title = r.title; }
      if (r.orderChapter) G.orderChapters[r.orderChapter] = true;
      if (r.advance) {
        G.advClass = r.advance.name;
        G.flags['adv'+r.advance.tier] = true;
        G.statPoints += (r.advance.tier===100 ? 25 : 12);
        if (G.titles.indexOf(r.advance.name)<0) { G.titles.push(r.advance.name); G.title = r.advance.name; }
        Skills.syncLearned();
      }
      if (r.unlockSkill && G.skills.indexOf(r.unlockSkill)<0 && DATA.skills[r.unlockSkill]) {
        G.learned[r.unlockSkill]=true; G.skills.push(r.unlockSkill);
      }
      if (r.grantMount && window.World) World.grantMount(r.grantMount);
      if (r.grantAlly && window.World) World.grantAlly(r.grantAlly);
      delete G.quests[id];
      G.questsDone[id] = true;
      G.stats.questsDone++;
      recompute();
      Quests.autoOffer();
      return r;
    }
  };

  window.Econ = { };
})();
