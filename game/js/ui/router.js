/* router.js —— UI.go / UI.render + Act 动作处理 */
(function(){
  // ---------- 渲染 ----------
  function render(){
    const scr=UI.$('screen'); if(!scr) return;
    const fn=Screens[UI.state.screen]||Screens.town;
    try { scr.innerHTML=fn(UI.state.ctx); }
    catch(e){ scr.innerHTML='<div class="empty">渲染出错：'+UI.esc(e.message)+'</div>'; console.error(e); }
    UI.renderStatus(); UI.renderNav();
    if(UI.state.screen==='combat'){ const lg=UI.$('log'); if(lg) lg.scrollTop=lg.scrollHeight; }
    scr.scrollTop=UI.state._keepScroll?scr.scrollTop:0; UI.state._keepScroll=false;
  }
  function go(screen, ctx){ UI.state.screen=screen; if(ctx!==undefined) UI.state.ctx=ctx; UI.closeModal(); render(); }
  UI.go=go; UI.render=render;

  const T=UI.toast, M=UI.modal, CM=UI.closeModal;

  window.Act = {
    // ===== 开局 =====
    pickClass(id){ UI.state.pick=id; render(); },
    createChar(){
      const name=(UI.$('charname')&&UI.$('charname').value||'').trim()||'无名旅人';
      if(!UI.state.pick){ T('请先选择一个职业'); return; }
      Save.init(name, UI.state.pick);
      go('town');
      M(`<h3>欢迎来到《信仰》</h3><div class="narr">${UI.esc(DATA.classes[G.classId].lore)}</div>
        <p class="tiny dim">提示：在「城镇」接任务、去「野外」练级、进「副本」夺宝。升级会获得属性点，记得在「角色」面板分配。</p>
        <div class="btns"><button class="primary full" onclick="UI.closeModal()">开始冒险</button></div>`);
    },
    loadGame(){ if(Save.load()){ go('town'); } else T('没有有效存档'); },
    exportSave(){ const code=Save.exportCode(); M(`<h3>存档码</h3><p class="tiny dim">复制保存，可在其他设备导入。</p>
      <textarea readonly style="width:100%;height:120px;background:#0a0805;color:var(--ink);border:1px solid var(--gold-d);border-radius:5px" onclick="this.select()">${code}</textarea>
      <div class="btns"><button class="full" onclick="UI.closeModal()">关闭</button></div>`); },
    importPrompt(){ M(`<h3>导入存档码</h3><textarea id="impcode" style="width:100%;height:120px;background:#0a0805;color:var(--ink);border:1px solid var(--gold-d);border-radius:5px"></textarea>
      <div class="btns"><button class="primary" onclick="Act.doImport()">导入</button><button class="ghost" onclick="UI.closeModal()">取消</button></div>`); },
    doImport(){ const c=UI.$('impcode').value; if(Save.importCode(c)){ go('town'); T('导入成功'); } else T('存档码无效'); },
    wipeConfirm(){ M(`<h3>删档重来？</h3><p class="dim">当前进度将永久删除，无法恢复。</p>
      <div class="btns"><button class="danger" onclick="Act.doWipe()">确认删除</button><button class="ghost" onclick="UI.closeModal()">取消</button></div>`); },
    doWipe(){ Save.wipe(); UI.state.pick=null; go('charcreate'); },

    // ===== 导航 =====
    go(s){ if(window.Combat&&Combat.active&&Combat.active()){ T('战斗中无法离开'); return; } go(s); },
    diceScreen(){ go('diceScreen'); },

    // ===== 城镇交互 =====
    rest(){ for(let i=0;i<8;i++) Systems.restTick(); Systems.fullHeal(); Save.save(); render(); T('你在城中休整，生命与'+DATA.classes[G.classId].resource+'已恢复。'); },
    trainer(){ const cls=DATA.classes[G.classId]; const next=Skills.nextUnlock();
      const cq=Object.values(DATA.quests).filter(q=>q.type==='class'&&q.classReq===G.classId&&Quests.isAvailable(q.id));
      const active=Object.keys(G.quests).map(id=>DATA.quests[id]).filter(q=>q&&q.type==='class'&&q.classReq===G.classId);
      const adv=DATA.advNames[G.classId]||{};
      const cqHtml=cq.map(q=>`<div class="card btn" onclick="Act.acceptQuest('${q.id}')"><b class="q-gold">${UI.esc(q.name)}</b><div class="ds">${UI.esc(q.desc)}</div><div class="tiny q-gold">Lv${q.reqLevel} · 点击接取</div></div>`).join('');
      const acHtml=active.map(q=>`<div class="card"><b>${UI.esc(q.name)}</b> <span class="tiny ${Quests.isComplete(q.id)?'q-gold':'dim'}">${Quests.isComplete(q.id)?'可交付':Quests.progressText(q.id)}</span></div>`).join('');
      M(`<h3>🎓 ${cls.name}训练师</h3>
        <p class="dim tiny">技能随等级自动习得；觉醒与转职任务在此领取。转职路线：${cls.name} → ${adv[50]||'—'} → ${adv[100]||'—'}。${G.advClass?`<br>当前进阶：<b class="q-gold">${UI.esc(G.advClass)}</b>`:''}</p>
        <div class="card">已习得 ${(G.skills||[]).length} 个技能。${next?`下一个【${UI.esc(next.name)}】将于 Lv${next.reqLevel} 习得。`:'已习得全部技能。'}</div>
        ${G.level>=cls.specLevel&&!G.spec?`<div class="btns"><button class="primary full" onclick="Act.chooseSpec()">选择流派（专长）</button></div>`:''}
        ${acHtml?'<h3 class="sub">进行中的职业任务</h3>'+acHtml:''}
        ${cqHtml?'<h3 class="sub">可领取</h3>'+cqHtml:'<p class="tiny dim">暂无可领取的职业任务（提升等级解锁转职试炼）。</p>'}
        <div class="btns"><button class="ghost full" onclick="UI.closeModal()">关闭</button></div>`); },
    auction(){ M(`<h3>💰 拍卖行</h3><p class="dim">行情每日浮动。你可在背包中点击物品「卖出」即时变现；大宗拍卖系统将在后续版本开放。</p>
      <div class="btns"><button class="full" onclick="UI.closeModal()">关闭</button></div>`); },

    talkNpc(npcId){
      const city=DATA.cities[G.cityId]; const npc=(city.npcs||[]).find(n=>n.id===npcId); if(!npc) return;
      Quests.onTalk(npcId);
      const offers=Object.values(DATA.quests).filter(q=>q.cityId===G.cityId&&q.giver===npc.name&&Quests.isAvailable(q.id));
      const ob=offers.map(q=>`<div class="card btn" onclick="Act.acceptQuest('${q.id}')"><b>${UI.esc(q.name)}</b><div class="ds">${UI.esc(q.desc)}</div><div class="tiny q-gold">接取</div></div>`).join('');
      M(`<h3>${npc.icon} ${UI.esc(npc.name)}</h3><div class="narr">${UI.esc(npc.dialog)}</div>${ob||''}
        <div class="btns"><button class="full" onclick="UI.closeModal();UI.render()">结束对话</button></div>`);
    },

    // ===== 角色 =====
    allocate(stat){ if(Systems.allocate(stat,1)){ Save.save(); render(); } else T('没有可分配的属性点'); },
    resetAlloc(){ Systems.resetAlloc(); Save.save(); render(); T('已洗点'); },
    setTitle(t){ G.title=t; Save.save(); render(); T('已佩戴称号：'+t); },
    chooseSpec(){ const cls=DATA.classes[G.classId];
      M(`<h3>选择流派（专长）</h3><p class="dim tiny">流派将<b>真实改变战斗属性</b>（非仅标签），选定后影响技能风格与成长。</p>
        ${cls.specs.map(s=>{ const b=(DATA.specBonus||{})[s.id];
          return `<div class="card btn" onclick="Act.setSpec('${s.id}')"><b>${UI.esc(s.name)}</b><div class="ds">${UI.esc(s.desc)}</div>${b&&b.note?`<div class="tiny q-gold" style="margin-top:3px">加成：${UI.esc(b.note)}</div>`:''}</div>`;}).join('')}
        <div class="btns"><button class="ghost full" onclick="UI.closeModal()">稍后再选</button></div>`); },
    setSpec(id){ G.spec=id; Save.save(); go('character'); T('已选择流派：'+(DATA.classes[G.classId].specs.find(s=>s.id===id)||{}).name); },

    // ===== 背包 / 装备 =====
    itemModal(where, key){
      let it, isEquip=where==='equip';
      if(isEquip) it=G.equip[key]; else it=G.bag[key];
      if(!it) return;
      const d=UI.itemDef(it); const btns=[];
      if(isEquip){ btns.push(`<button onclick="Act.unequip('${key}')">卸下</button>`);
        if(d.slot) btns.push(`<button class="ghost" onclick="Act.forgeItem('${key}')">强化/镶嵌</button>`); }
      else {
        if(d.use) btns.push(`<button class="primary" onclick="Act.useBag(${key})">使用</button>`);
        if(d.slot) btns.push(`<button class="primary" onclick="Act.equipBag(${key})">装备</button>`);
        btns.push(`<button class="ghost" onclick="Act.sellBag(${key})">卖出</button>`);
      }
      M(`<div>${UI.itemTip(it)}</div><div class="btns">${btns.join('')}<button class="ghost" onclick="UI.closeModal()">关闭</button></div>`);
    },
    equipBag(i){ const r=Systems.equip(i); if(r&&r.ok){ Save.save(); CM(); render(); T('已装备'); } else T((r&&r.why)||'无法装备'); },
    unequip(slot){ Systems.unequip(slot); Save.save(); CM(); render(); T('已卸下'); },
    useBag(i){ const it=G.bag[i]; if(!it) return; const d=DATA.items[it.id]; if(!d||!d.use) return;
      const u=d.use;
      if(u.learnSkill || u.learnLife){   // 技能书：学习
        if(d.classReq && d.classReq!==G.classId){ T('职业不符，无法学习此技能书'); return; }
        const res = u.learnSkill ? Skills.learnBook(u.learnSkill) : Skills.learnLife(u.learnLife);
        if(res==='have'){ T('你已掌握该技能'); return; }
        if(!res){ T('无法学习'); return; }
        Systems.removeItem(it.id,1); Save.save(); CM(); render();
        T('习得：'+(u.learnSkill?DATA.skills[u.learnSkill].name:'开锁'));
        return;
      }
      if(u.hp) G.hpCur=Math.min(G.maxHp,G.hpCur+u.hp); if(u.hpPct) G.hpCur=Math.min(G.maxHp,G.hpCur+Math.round(G.maxHp*u.hpPct));
      if(u.mp) G.mpCur=Math.min(G.maxMp,G.mpCur+u.mp); Systems.removeItem(it.id,1); Save.save(); CM(); render(); T('已使用 '+d.name); },
    sellBag(i){ const g=Systems.sell(i); if(g){ Save.save(); CM(); render(); T('卖出，获得 '+ (g)+' 铜币'); } },
    bulkSell(kind){ const p=Systems.bulkSellPreview(kind);
      if(p.count<=0){ T(kind==='nonclass'?'没有非本职业装备':'没有低级装备可卖'); return; }
      const label=kind==='nonclass'?'非本职业装备':'低级装备(需求等级≤'+(G.level-8)+')';
      M(`<h3>一键售卖</h3><div class="narr">将卖出 <b>${p.count}</b> 件${label}，获得约 <b>${UI.money(p.gold)}</b>。<br><span class="tiny dim">本职业专属神装不会被卖出。</span></div>
        <div class="btns"><button class="danger" onclick="Act.doBulkSell('${kind}')">确认卖出</button><button class="ghost" onclick="UI.closeModal()">取消</button></div>`); },
    doBulkSell(kind){ const r=Systems.bulkSell(kind); Save.save(); CM(); render(); T(`卖出 ${r.count} 件，获得 ${UI.money(r.gold)}`); },

    // ===== 商店 =====
    buy(id){ const r=Systems.buy(id); if(r.ok){ Save.save(); render(); T('购买成功 -'+r.price+'铜'); } else T(r.why); },

    // ===== 传送 =====
    travel(to, cost){ if(G.gold<cost){ T('铜币不足'); return; }
      Systems.addGold(-cost); G.cityId=to; G.visited.cities[to]=true; Quests.onReach(to); Systems.fullHeal(); Save.save();
      go('town'); T('已传送至 '+DATA.cities[to].name); },

    // ===== 任务 =====
    acceptQuest(id){ if(Quests.accept(id)){ Quests.onTalk(id); Save.save(); CM(); go('quests'); T('已接取任务'); } else T('无法接取'); },
    trackQuest(id){ const q=DATA.quests[id]; const r=q.rewards||{};
      const items=(r.items||[]).map(x=>`${(DATA.items[x.id]||{}).name||x.id}×${x.qty||1}`).join('，');
      M(`<h3>${UI.esc(q.name)}</h3><div class="narr">${UI.esc(q.desc)}</div>
        <div class="card"><b>奖励</b><div class="kv"><span>经验</span><b>${r.xp||0}</b></div>${r.gold?`<div class="kv"><span>金钱</span><b>${r.gold}铜</b></div>`:''}
        ${items?`<div class="kv"><span>物品</span><b>${items}</b></div>`:''}${r.title?`<div class="kv"><span>称号</span><b class="q-gold">${r.title}</b></div>`:''}
        ${r.orderChapter?`<div class="kv"><span>秩序之章</span><b class="q-gold">${r.orderChapter}之章</b></div>`:''}</div>
        <div class="btns"><button class="full" onclick="UI.closeModal()">关闭</button></div>`); },
    turnIn(id){ const r=Quests.turnIn(id); if(r){ Save.save(); render();
      M(`<h3 class="q-gold">任务完成！</h3><div class="narr">获得经验 ${r.xp||0}${r.gold?'，'+r.gold+'铜':''}
        ${r.title?`<br>获得称号【${r.title}】`:''}${r.orderChapter?`<br>获得秩序之章·${r.orderChapter}之章！`:''}</div>
        <div class="btns"><button class="primary full" onclick="UI.closeModal();UI.render()">好</button></div>`);
      } else T('尚未完成'); },

    // ===== 野外探索 =====
    exploreZone(zoneId){
      const z=DATA.zones[zoneId]; if(!z){ T('无此区域'); return; }
      CM(); // 点击随机事件选项后关闭弹窗
      const ev=Events.maybeEvent(z);
      if(ev && ev.type!=='ambush'){ this._handleEvent(ev, zoneId); return; }
      const monster = ev && ev.type==='ambush' ? ev.monster : Events.encounter(z);
      if(!monster){ T('这里空无一物'); return; }
      UI.state.ctx={zoneId};
      Combat.start({ enemies:[monster], zoneId, onEnd:()=>{ render(); } });
      UI.state.screen='combat'; render();
      if(ev&&ev.type==='ambush') T(ev.text);
      if(UI.state.auto) this._autoTick();
    },
    _handleEvent(ev, zoneId){
      const cont=`<button class="primary" onclick="Act.exploreZone('${zoneId}')">继续探索</button><button class="ghost" onclick="UI.closeModal();UI.go('zonelist')">返回</button>`;
      if(ev.type==='fortune'){ Systems.addGold(ev.gold); Save.save(); UI.renderStatus(); }
      if(ev.type==='omen'){ /* 预兆：临时鼓舞，下一场战斗略增益（简化为回满） */ Systems.fullHeal(); UI.renderStatus(); }
      let inner='';
      if(ev.type==='chest'){
        const lp=G.lockpick||{learned:false,lv:1};
        const label = lp.learned ? `开锁（熟练Lv${lp.lv}）` : (Systems.countItem('lockpick')>0?'用开锁器开启':'开锁（需技能/开锁器）');
        inner=`<div class="btns"><button class="primary" onclick="Act.openChest(${ev.tier},'${zoneId}')">${label}</button>
          <button class="ghost" onclick="Act.exploreZone('${zoneId}')">无视它</button></div>`;
      } else if(ev.type==='shrine'){
        inner=`<div class="btns"><button class="primary" onclick="Act.rollDice('${zoneId}')">🎲 投掷命骰</button>${cont}</div>`;
      } else if(ev.type==='merchant' && ev.item){
        UI.state._merchant=ev;
        inner=`<div>${UI.itemTip(ev.item)}</div><div class="btns"><button class="primary" onclick="Act.buyMerchant('${zoneId}')">购买（${ev.price}铜）</button>${cont}</div>`;
      } else { inner=`<div class="btns">${cont}</div>`; }
      M(`<h3>🌟 奇遇</h3><div class="narr">${UI.esc(ev.text)}</div>${inner}`);
    },
    openChest(tier, zoneId){
      const r=Events.openChest(tier);
      if(!r.ok){ T(r.why); return; }
      const loot=(r.items||[]).map(it=>`<div>${it.gen?UI.itemName(it):'<span class="'+UI.qcls(it.quality)+'">'+UI.esc(it.name)+'</span>'}</div>`).join('');
      M(`<h3 class="q-gold">开启成功！</h3><div class="narr">获得 ${UI.money(r.gold)}<br>${loot}${r.lockUp?`<br><b class="q-gold">开锁熟练度提升至 Lv${r.lockLv}！</b>`:''}</div>
        <div class="btns"><button class="primary" onclick="Act.exploreZone('${zoneId}')">继续探索</button><button class="ghost" onclick="UI.closeModal();UI.go('zonelist')">返回</button></div>`);
      UI.renderStatus();
    },
    buyMerchant(zoneId){ const ev=UI.state._merchant; if(!ev||!ev.item){ CM(); return; }
      if(G.gold<ev.price){ T('铜币不足'); return; }
      Systems.addGold(-ev.price); Systems.addInstance(ev.item); UI.state._merchant=null; Save.save();
      T('购买成功'); CM(); UI.renderStatus(); },

    // ===== 副本 =====
    dungeonDetail(dgId){
      const d=DATA.dungeons[dgId]; if(!d) return;
      const cl=G.dungeonClears&&G.dungeonClears[dgId]||0;
      const diffs=Object.values(DATA.difficulties).map(df=>{
        const locked=df.minClear&&cl<df.minClear;
        return `<button class="${df.key==='normal'?'primary':''}" ${locked?'disabled':''} onclick="Act.startDungeon('${dgId}','${df.key}')">${df.name}${locked?'(需先通关普通)':''}</button>`;
      }).join('');
      M(`<h3>${d.icon} ${UI.esc(d.name)} <span class="tiny dim">Lv${d.levelRange[0]}-${d.levelRange[1]}</span></h3>
        ${d.story?`<div class="narr">${UI.esc(d.story)}</div>`:''}
        <p class="tiny dim">波次：${d.waves.length} 波 + BOSS【${(DATA.monsters[d.boss]||{}).name||''}】。专家级血厚、爆率高。</p>
        <div class="btns">${diffs}</div><div class="btns"><button class="ghost full" onclick="UI.closeModal()">取消</button></div>`);
    },
    startDungeon(dgId, diffKey){
      const d=DATA.dungeons[dgId], df=DATA.difficulties[diffKey];
      const mk=(mid)=>{ const m=Events.cloneMonster(mid,0); m.hp=Math.round(m.hp*df.hp); m.atk=Math.round(m.atk*df.atk);
        m.xp=Math.round(m.xp*df.reward); m.goldMax=Math.round(m.goldMax*df.reward); return m; };
      const enemies=d.waves.map(mk); enemies.push(mk(d.boss));
      UI.state.ctx={dungeonId:dgId, diff:diffKey};
      Combat.start({ enemies, dungeonId:dgId, onEnd:()=>{ render(); } });
      UI.state.screen='combat'; CM(); render();
      if(UI.state.auto) this._autoTick();
    },

    // ===== 战斗动作 =====
    cAttack(){ Combat.act({type:'attack'}); UI.state._keepScroll=true; render(); },
    cSkill(id){ Combat.act({type:'skill',id}); UI.state._keepScroll=true; render(); },
    cItem(id){ Combat.act({type:'item',id}); UI.state._keepScroll=true; render(); },
    cFlee(){ this.autoOff(); Combat.act({type:'flee'}); UI.state._keepScroll=true; render(); },
    // 战斗中·物品菜单（所有可用消耗品）
    combatItems(){
      const list=(G.bag||[]).filter(b=>{ const d=DATA.items[b.id]; return d&&d.use; });
      const html=list.length?list.map(b=>{ const d=DATA.items[b.id];
        return `<div class="card btn" onclick="Act.cItemFromMenu('${b.id}')"><div class="ct"><span class="ico">${d.icon||'🧪'}</span><span class="nm">${UI.esc(d.name)}</span><span class="rt">×${b.qty}</span></div><div class="ds">${UI.esc(d.desc||'')}</div></div>`;
      }).join(''):'<div class="empty">没有可用的消耗品</div>';
      M(`<h3>🎒 使用物品</h3><div class="list">${html}</div><div class="btns"><button class="ghost full" onclick="UI.closeModal()">返回</button></div>`);
    },
    cItemFromMenu(id){ CM(); Combat.act({type:'item',id}); UI.state._keepScroll=true; render(); },
    // ===== 自动战斗 =====
    toggleAuto(){ UI.state.auto=!UI.state.auto; UI.state._keepScroll=true; render(); if(UI.state.auto) this._autoTick(); },
    autoOff(){ UI.state.auto=false; if(UI.state._autoTimer){ clearTimeout(UI.state._autoTimer); UI.state._autoTimer=null; } },
    _aiPick(){
      const acts=(G.skills||[]).concat(G.setSkills||[]).map(id=>({id,s:DATA.skills[id]})).filter(x=>x.s&&x.s.type==='active'&&G.mpCur>=(x.s.mpCost||0)&&Combat.cooldown(x.id)===0);
      const heal=acts.find(x=>x.s.effect.kind==='heal');
      // 血量危急：优先治疗技能 → 否则喝药
      if(G.hpCur<G.maxHp*0.4){
        if(heal) return {type:'skill',id:heal.id};
        const pot=(G.bag||[]).find(b=>{ const d=DATA.items[b.id]; return d&&d.use&&(d.use.hp||d.use.hpPct); });
        if(pot) return {type:'item',id:pot.id};
      }
      // 选伤害最高的可用技能（多段/控制/伤害），按倍率估权重
      const dmg=acts.filter(x=>['damage','multi','dot','stun','drain','debuff'].includes(x.s.effect.kind))
        .sort((a,b)=>((b.s.effect.mult||0)*(b.s.effect.hits||1))-((a.s.effect.mult||0)*(a.s.effect.hits||1)))[0];
      if(dmg) return {type:'skill',id:dmg.id};
      return {type:'attack'};
    },
    _autoTick(){
      if(!UI.state.auto || !(window.Combat&&Combat.active()) || UI.state.screen!=='combat'){ UI.state._autoTimer=null; return; }
      Combat.act(this._aiPick()); UI.state._keepScroll=true; render();
      if(UI.state.auto && Combat.active()) UI.state._autoTimer=setTimeout(()=>Act._autoTick(), 480);
      else UI.state._autoTimer=null;
    },

    // ===== 强化 / 镶嵌 =====
    forgeItem(slot){
      const it=G.equip[slot]; if(!it) return;
      const gems=(G.bag||[]).filter(b=>{ const d=DATA.items[b.id]; return d&&d.type==='宝石'; });
      const sc=Systems.socketCount(it), used=(it.gems||[]).length;
      const gemBtns=(sc>used)?gems.map(g=>`<button class="ghost" onclick="Act.doSocket('${slot}','${g.id}')">${DATA.items[g.id].name}×${g.qty}</button>`).join(''):'';
      M(`<div>${UI.itemTip(it)}</div>
        <div class="card"><b>强化</b> <span class="tiny dim">幸运宝石×${Systems.countItem('lucky_gem')}　当前 +${it.plus||0}</span>
        <div class="btns"><button class="primary" onclick="Act.doEnhance('${slot}')">💠 砸级强化</button></div></div>
        ${sc?`<div class="card"><b>镶嵌宝石</b> <span class="tiny dim">凹槽 ${used}/${sc}</span>
          <div class="btns">${gemBtns||'<span class="dim tiny">背包无宝石或凹槽已满</span>'}</div></div>`:''}
        <div class="btns"><button class="ghost full" onclick="UI.closeModal();UI.go('forge')">关闭</button></div>`);
    },
    doEnhance(slot){
      const it=G.equip[slot]; if(!it) return;
      const r=Systems.enhance(it);
      if(!r.ok){ T(r.why); return; }
      if(r.result==='broke'){ delete G.equip[slot]; Systems.recompute(); Save.save(); CM(); go('forge'); T('强化失败，装备碎裂了……'); return; }
      Save.save();
      if(r.result==='success') T('强化成功！现在 +'+r.plus);
      else T('强化失败，等级回退至 +'+r.plus);
      this.forgeItem(slot); UI.renderStatus();
    },
    doSocket(slot, gemId){ const it=G.equip[slot]; const r=Systems.socketGem(it, gemId);
      if(r.ok){ Save.save(); this.forgeItem(slot); UI.renderStatus(); T('镶嵌成功'); } else T(r.why); },

    // ===== 命骰 =====
    rollDice(zoneId){
      const free = !!zoneId;   // 探索中的神龛奇遇免费；城镇神龛需献祭递增铜币
      const cost = free ? 0 : 300 * ((G.stats.diceRolls||0)+1);
      if(!free){ if(G.gold < cost){ T(`需向神龛献祭 ${cost} 铜币（铜币不足）`); return; }
        Systems.addGold(-cost); G.stats.diceRolls=(G.stats.diceRolls||0)+1; }
      const r=Events.rollDice();
      const cont=zoneId?`<button class="primary" onclick="Act.exploreZone('${zoneId}')">继续探索</button><button class="ghost" onclick="UI.closeModal();UI.go('town')">返回</button>`
        :`<button class="primary full" onclick="UI.closeModal();UI.render()">好</button>`;
      M(`<h3>🎲 命骰</h3>${free?'<p class="tiny dim">神龛奇遇·免费</p>':`<p class="tiny dim">已献祭 ${cost} 铜币。</p>`}<div class="narr">${UI.esc(r.text)}</div><div class="btns">${cont}</div>`);
      UI.renderStatus();
    },

    // ===== 生活技能 =====
    pickProf(id){ if(World.pickProfession(id)){ render(); T('已成为 '+DATA.professions[id].name); } },
    gather(){ const r=World.gather(); if(!r.ok){T(r.why);return;} render();
      T(`采集到 ${(DATA.items[r.item]||{}).name}×${r.qty}`+(r.rankUp?`，熟练度晋阶【${r.rank}】！`:'')); },
    craft(rid){ const r=World.craft(rid); if(!r.ok){T(r.why);return;} render();
      T(`打造成功：${(DATA.items[r.out.id]||{}).name}×${r.out.qty||1}`+(r.rankUp?`，晋阶【${r.rank}】！`:'')); },

    // ===== 坐骑 / 宠物 =====
    buyMount(id){ const r=World.buyMount(id); if(r.ok){render();T('已购入坐骑');} else T(r.why); },
    setMount(id){ World.setMount(id); render(); T('已骑乘 '+(DATA.mounts[id]||{}).name); },
    buyAlly(id){ const r=World.buyAlly(id); if(r.ok){render();T('已获得 '+(DATA.allies[id]||{}).name);} else T(r.why); },
    setAlly(id){ World.setAlly(id||null); render(); T(id?('出战：'+(DATA.allies[id]||{}).name):'已收回随从'); },

    // ===== 公会 =====
    joinGuild(){ World.joinGuild(); go('guild'); T('已加入牛人部落！'); },
    guildBuy(i){ const r=World.guildBuy(i); if(r.ok){render();T('兑换成功');} else T(r.why); },

    // ===== 潘多拉合成 / 三连命骰 / 图书馆 =====
    pandora(q){ const r=World.pandoraFuse(q); if(!r.ok){T(r.why);return;} render();
      if(r.success) M(`<h3 class="q-gold">合成成功！</h3><div class="narr">潘多拉之盒迸发光芒，诞生了：${UI.itemName(r.item)}！</div><div class="btns"><button class="primary full" onclick="UI.closeModal();UI.go('forge')">好</button></div>`);
      else T('合成失败……三件装备化为乌有。'); },
    fateRoll(){ const r=Events.rollFate(); if(!r.ok){T(r.why);return;} render();
      M(`<h3>💀 三连命骰</h3><div class="narr">${r.lines.map(UI.esc).join('<br>')}</div><div class="btns"><button class="primary full" onclick="UI.closeModal();UI.render()">接受命运</button></div>`);
      UI.renderStatus(); },
    library(){ const lib=DATA.library; G.studied=G.studied||{}; G.langs=G.langs||{};
      const rows=lib.attrs.map(([k,n])=>{ const c=(G.studied[k]||0); const cost=lib.baseCost*(c+1);
        return `<div class="card"><div class="ct"><span class="nm">${n}</span><span class="rt">${c}/${lib.maxPerAttr}</span></div>
          <div class="btns">${c>=lib.maxPerAttr?'<span class="dim tiny">已满</span>':`<button onclick="Act.study('${k}')">研读典籍 +1（${cost}铜）</button>`}</div></div>`;}).join('');
      const langs=lib.langs.map(l=>`<button class="${G.langs[l]?'ghost':''}" ${G.langs[l]?'disabled':''} onclick="Act.learnLang('${l}')">${l}${G.langs[l]?'✓':'（'+lib.langCost+'铜）'}</button>`).join('');
      M(`<h3>📚 卡罗尔城·皇家图书馆</h3><p class="dim tiny">研读藏书可永久提升属性；学习各族语言（通用语/龙族语/古通用语/科沙特巨人语/精灵语）以读懂碑文、与异族交涉。</p>
        <div class="list">${rows}</div><h3 class="sub">语言</h3><div class="btns">${langs}</div>
        <div class="btns"><button class="ghost full" onclick="UI.closeModal()">离开</button></div>`); },
    study(k){ const r=World.studyAttr(k); if(r.ok){ this.library(); UI.renderStatus(); T('研读完成，属性永久+1'); } else T(r.why); },
    learnLang(l){ const r=World.learnLang(l); if(r.ok){ this.library(); T('已掌握 '+l); } else T(r.why); },

    // ===== 战场 / 国战 =====
    startBG(id){ const b=DATA.battlegrounds[id]; if(!b) return; if(G.level<b.reqLevel){ T('等级不足'); return; }
      const mk=m=>Events.cloneMonster(m,0); const enemies=b.waves.map(mk); enemies.push(mk(b.boss));
      UI.state.ctx={bgId:id};
      Combat.start({ enemies, onEnd:(r)=>{ if(r.outcome==='win'){ const rw=b.reward;
        if(rw.xp)Systems.gainXp(rw.xp); if(rw.gold)Systems.addGold(rw.gold); if(rw.credit)G.credit=(G.credit||0)+rw.credit;
        if(rw.fortress){ G.fortresses=G.fortresses||{}; G.fortresses[rw.fortress]=true; }
        if(rw.title&&G.titles.indexOf(rw.title)<0){ G.titles.push(rw.title); G.title=rw.title; }
        if(window.World&&G.guild) World.addContribution(50); Save.save(); }
        render(); } });
      UI.state.screen='combat'; CM(); render();
      if(UI.state.auto) this._autoTick();
    },
  };
})();
