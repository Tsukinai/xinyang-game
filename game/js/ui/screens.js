/* screens.js —— 各界面渲染，返回 HTML 字符串。交互通过 onclick="Act.xxx()"。 */
(function(){
  const E=UI.esc, money=UI.money, iname=UI.itemName;
  const ATTRS=[['str','力量'],['agi','敏捷'],['int','智力'],['sta','体质'],['spi','精神']];

  // ============ 开局选职 ============
  function charcreate(){
    const list=Object.values(DATA.classes).map(c=>`
      <div class="card btn ${UI.state.pick===c.id?'sel':''}" onclick="Act.pickClass('${c.id}')">
        <div class="ct"><span class="roleicon">${c.icon}</span>
          <div><div class="nm">${c.name} <span class="tiny dim">${c.role}</span></div>
          <div class="ds">${E(c.desc)}</div></div></div>
        ${UI.state.pick===c.id?`<div class="tiny" style="margin-top:6px;color:#c8bfa6">流派：${c.specs.map(s=>s.name).join(' / ')}　·　资源：${c.resource}　·　转职：${c.adv50||'—'}→${c.adv100||'—'}</div>
          <div class="tiny dim" style="margin-top:3px">${E(c.lore)}</div>`:''}
      </div>`).join('');
    return `<h2 class="title">⚔ 进入《信仰》<small>选择你的职业</small></h2>
      <div class="narr">${E(DATA.intro)}</div>
      <h3 class="sub">选择职业（不必像主角一样玩盗贼）</h3>
      <div class="list classpick">${list}</div>
      <h3 class="sub">角色名</h3>
      <input id="charname" maxlength="8" placeholder="输入你的名字" style="width:100%;padding:9px;background:#0a0805;border:1px solid var(--gold-d);border-radius:5px;color:var(--ink);font-size:15px">
      <div class="btns"><button class="primary full" onclick="Act.createChar()">踏入第二世界</button></div>
      ${Save.hasSave()?`<div class="btns"><button class="full" onclick="Act.loadGame()">继续上次存档</button></div>`:''}
      <div class="btns"><button class="ghost full" onclick="Act.importPrompt()">导入存档码</button></div>`;
  }

  // ============ 城镇 ============
  function town(){
    const city=DATA.cities[G.cityId]; const sv=city.services||{};
    const acts=[];
    acts.push(['📜','任务',`Act.go('quests')`]);
    if(city.zones&&city.zones.length) acts.push(['🌾','野外练级',`Act.go('zonelist')`]);
    if(city.dungeons&&city.dungeons.length) acts.push(['🏰','副本',`Act.go('dungeonlist')`]);
    if(sv.shop) acts.push(['🛒','商店',`Act.go('shop')`]);
    if(sv.trainer) acts.push(['🎓','训练师',`Act.trainer()`]);
    if(sv.forge) acts.push(['⚒️','强化镶嵌',`Act.go('forge')`]);
    acts.push(['🛏️','休整恢复',`Act.rest()`]);
    acts.push(['🧵','生活技能',`Act.go('profession')`]);
    acts.push(['🐎','坐骑宠物',`Act.go('stable')`]);
    acts.push(['🐮','公会',`Act.go('guild')`]);
    acts.push(['⚔️','战场国战',`Act.go('battleground')`]);
    acts.push(['🎲','神龛·命骰',`Act.diceScreen()`]);
    if(sv.library) acts.push(['📚','图书馆',`Act.library()`]);
    if(sv.auction) acts.push(['💰','拍卖行',`Act.auction()`]);
    acts.push(['🗺️','传送',`Act.go('map')`]);
    const npcs=(city.npcs||[]).map(n=>`<div class="card btn" onclick="Act.talkNpc('${n.id}')">
      <div class="ct"><span class="ico">${n.icon}</span><span class="nm">${E(n.name)}</span><span class="rt">${E(n.role)}</span></div>
      <div class="ds">${E(n.dialog)}</div></div>`).join('');
    return `<h2 class="title">${city.icon} ${E(city.name)}<small>推荐 Lv${city.recommendLevel[0]}-${city.recommendLevel[1]}</small></h2>
      <div class="narr">${E(city.desc)}</div>
      <div class="grid3">${acts.map(([i,t,fn])=>`<button onclick="${fn}"><div style="font-size:18px">${i}</div><div class="tiny">${t}</div></button>`).join('')}</div>
      <h3 class="sub">城中人物</h3><div class="list">${npcs||'<div class="empty">空无一人</div>'}</div>`;
  }

  // ============ 野外列表 ============
  function zonelist(){
    const city=DATA.cities[G.cityId];
    const zs=(city.zones||[]).map(id=>{ const z=DATA.zones[id]; if(!z) return '';
      const can=G.level>=z.levelRange[0]-2;
      return `<div class="card btn" onclick="Act.exploreZone('${id}')">
        <div class="ct"><span class="ico">${z.icon}</span><span class="nm">${E(z.name)}</span>
          <span class="rt">Lv${z.levelRange[0]}-${z.levelRange[1]}</span></div>
        <div class="ds">${E(z.desc)}</div>${can?'':'<div class="tiny" style="color:#c0392b">等级偏低，危险！</div>'}</div>`;
    }).join('');
    return `<h2 class="title">🌾 野外练级<small>${E(city.name)}</small></h2>
      <p class="dim tiny">探索时随机遇怪，亦可能触发宝箱、奇遇、伏击等随机事件。</p>
      <div class="list">${zs||'<div class="empty">此地没有练级区</div>'}</div>`;
  }

  // ============ 副本列表 ============
  function dungeonlist(){
    const city=DATA.cities[G.cityId];
    const ds=(city.dungeons||[]).map(id=>{ const d=DATA.dungeons[id]; if(!d) return '';
      const cl=G.dungeonClears&&G.dungeonClears[id]||0;
      return `<div class="card btn" onclick="Act.dungeonDetail('${id}')">
        <div class="ct"><span class="ico">${d.icon}</span><span class="nm">${E(d.name)}</span>
          <span class="rt">Lv${d.levelRange[0]}-${d.levelRange[1]}</span></div>
        <div class="ds">${E(d.desc)}</div>${cl?`<div class="tiny q-gold">已通关 ${cl} 次</div>`:''}</div>`;
    }).join('');
    return `<h2 class="title">🏰 副本<small>${E(city.name)}</small></h2>
      <div class="list">${ds||'<div class="empty">此地没有副本</div>'}</div>`;
  }

  // ============ 角色面板 ============
  function character(){
    const cls=DATA.classes[G.classId]; const a=G.attr;
    const allocRows=ATTRS.map(([k,n])=>`<div class="kv"><span>${n} <b>${a[k]}</b></span>
      ${G.statPoints>0?`<button class="b" style="padding:2px 9px" onclick="Act.allocate('${k}')">+</button>`:''}</div>`).join('');
    const combat=[['攻击',G.atk],['法术强度',G.sp],['护甲',G.armor],['暴击',G.crit.toFixed(1)+'%'],['闪避',G.dodge.toFixed(1)+'%'],
      ['生命',G.maxHp],[cls.resource,G.maxMp],['生命回复',G.regenHp]];
    const titles=(G.titles||[]).map(t=>`<span class="tag q-gold" onclick="Act.setTitle('${E(t)}')" style="cursor:pointer">${E(t)}</span>`).join(' ')||'<span class="dim tiny">暂无</span>';
    const order=['正义','善良','勇气','智慧','公正','自由'].map(c=>`<span class="tag ${G.orderChapters[c]?'q-gold':''}" style="opacity:${G.orderChapters[c]?1:.35}">${c}</span>`).join(' ');
    return `<h2 class="title">🧝 ${E(G.name)}<small>${cls.icon} ${cls.name}${G.spec?'·'+(cls.specs.find(s=>s.id===G.spec)||{}).name:''}</small></h2>
      <div class="card"><div class="kv"><span>等级</span><b>Lv${G.level}${G.level>=Systems.LEVEL_CAP?'（满级）':''}</b></div>
        <div class="kv"><span>阵营/帝国</span><b>${DATA.empires[G.empire].name}</b></div>
        <div class="kv"><span>爵位</span><b>${E(G.noble)}</b></div>
        <div class="kv"><span>可分配属性点</span><b class="${G.statPoints?'q-gold':''}">${G.statPoints}</b></div></div>
      ${G.level>=cls.specLevel&&!G.spec?`<div class="card btn" style="border-color:var(--gold)" onclick="Act.chooseSpec()">⚡ 可选择流派（专长）！点此选择</div>`:''}
      ${G.spec&&(DATA.specBonus||{})[G.spec]?`<div class="card"><b>流派加成</b> <span class="tiny q-gold">${E((DATA.specBonus[G.spec]||{}).note||'')}</span></div>`:''}
      <h3 class="sub">基础属性 ${G.statPoints>0?'<span class="tiny q-gold">（有 '+G.statPoints+' 点可加）</span>':''}</h3>
      <div class="card">${allocRows}${G.statPoints>0?`<div class="btns"><button class="ghost" onclick="Act.resetAlloc()">洗点</button></div>`:''}</div>
      <h3 class="sub">战斗属性</h3>
      <div class="card"><div class="stats">${combat.map(([n,v])=>`<div class="s"><span>${n}</span><b>${v}</b></div>`).join('')}</div></div>
      <h3 class="sub">称号</h3><div class="card">${titles}</div>
      <h3 class="sub">秩序之章 · 第一卷</h3><div class="card">${order}<div class="tiny dim" style="margin-top:5px">集齐六章可推进教皇之路。</div></div>
      ${(G.activeSets&&G.activeSets.length)?`<h3 class="sub">套装</h3><div class="card">${G.activeSets.map(s=>`<div class="kv"><span class="${s.active?'q-gold':'dim'}">${E(s.name)} (${s.have}/${s.total})</span></div><div class="tiny ${s.active?'q-gold':'dim'}">${s.active?'✓ ':'　'}${E(s.desc)}</div>`).join('')}</div>`:''}
      <div class="btns"><button class="ghost" onclick="Act.exportSave()">导出存档码</button><button class="ghost" onclick="Act.wipeConfirm()">删档重来</button></div>`;
  }

  // ============ 背包 / 装备 ============
  function bag(){
    const slotsOrder=['weapon','offhand','head','shoulder','chest','hand','waist','legs','feet','cloak','neck','ring1','ring2','trinket'];
    const eq=slotsOrder.map(s=>{ const it=G.equip[s];
      return `<div class="card btn" onclick="${it?`Act.itemModal('equip','${s}')`:''}" style="${it?'':'opacity:.5'}">
        <div class="ct"><span class="ico">${slotIcon(s)}</span>
          <div><div class="tiny dim">${DATA.slots[s]}</div>${it?iname(it):'<span class="dim tiny">（空）</span>'}</div></div></div>`;
    }).join('');
    const items=(G.bag||[]).map((it,i)=>{ const d=UI.itemDef(it);
      return `<div class="card btn" onclick="Act.itemModal('bag',${i})">
        <div class="ct"><span class="ico">${d.icon||'📦'}</span>
          <div>${iname(it)}${it.qty>1?` <span class="dim tiny">×${it.qty}</span>`:''}
          <div class="ds">${E(d.type||'')}${d.slot?' · '+(DATA.slots[d.slot]||''):''}</div></div></div></div>`;
    }).join('')||'<div class="empty">背包空空如也</div>';
    const pNon=Systems.bulkSellPreview('nonclass'), pLow=Systems.bulkSellPreview('lowlevel');
    return `<h2 class="title">🎒 背包与装备<small>${money(G.gold)}</small></h2>
      <h3 class="sub">已装备</h3><div class="list">${eq}</div>
      <h3 class="sub">背包（${(G.bag||[]).length}）</h3>
      <div class="btns">
        <button class="ghost" onclick="Act.bulkSell('nonclass')">一键卖·非本职业(${pNon.count})</button>
        <button class="ghost" onclick="Act.bulkSell('lowlevel')">一键卖·低级装备(${pLow.count})</button>
      </div>
      <div class="list">${items}</div>`;
  }
  function slotIcon(s){ return ({weapon:'🗡️',offhand:'🛡️',head:'⛑️',shoulder:'🧣',chest:'🦺',hand:'🧤',waist:'🩹',legs:'👖',feet:'👢',cloak:'🧥',neck:'📿',ring1:'💍',ring2:'💍',trinket:'🎖️'})[s]||'📦'; }

  // ============ 技能 ============
  function skills(){
    const cls=DATA.classes[G.classId];
    const learned=(G.skills||[]).concat(G.setSkills||[]).map(id=>{ const s=DATA.skills[id]; if(!s) return '';
      const isSet=(G.setSkills||[]).indexOf(id)>=0; const isBook=(G.bookSkills||[]).indexOf(id)>=0;
      const prof=s.type==='active'?Skills.profLv(id):0; const tag=isSet?' <span class="tag q-gold">套装</span>':isBook?' <span class="tag q-blue">技能书</span>':'';
      return `<div class="skill-row"><span class="si">${s.icon||'✨'}</span><div class="sd">
        <div class="snm">${E(s.name)}${prof>1?` <span class="q-gold tiny">熟练Lv${prof}</span>`:''}${tag} <span class="tiny dim">${s.type==='passive'?'被动':cls.resource+(s.mpCost||0)+(s.cooldown?' · CD'+s.cooldown:'')}</span></div>
        <div class="sde">${E(s.desc)}</div></div></div>`; }).join('');
    const next=Skills.nextUnlock();
    const lp=G.lockpick||{learned:false,lv:1};
    const lifeRows=[];
    lifeRows.push(`<div class="kv"><span>🗝️ 开锁</span><b>${lp.learned?'熟练 Lv'+lp.lv:'未习得（需技能书/开锁器）'}</b></div>`);
    if(G.profession) lifeRows.push(`<div class="kv"><span>${DATA.professions[G.profession].icon} ${DATA.professions[G.profession].name}</span><b>${World.profRankName()}</b></div>`);
    return `<h2 class="title">✨ 技能<small>${G.advClass||cls.name}</small></h2>
      <p class="dim tiny">主动技能使用即积累熟练度（最高 Lv10，每级 +3% 威力）。技能书可从商店/任务/BOSS/宝箱获得。</p>
      <div class="list" style="background:var(--panel);border:1px solid var(--line);border-radius:6px;padding:4px 11px">${learned||'<div class="empty">尚未习得技能</div>'}</div>
      ${next?`<p class="dim tiny" style="margin-top:8px">下一个技能：【${E(next.name)}】将在 Lv${next.reqLevel} 自动习得。</p>`:'<p class="dim tiny">已习得全部职业技能。</p>'}
      <h3 class="sub">生活技能</h3><div class="card">${lifeRows.join('')}</div>`;
  }

  // ============ 任务 ============
  function quests(){
    const active=Object.keys(G.quests||{}).map(id=>{ const q=DATA.quests[id]; if(!q) return '';
      const done=Quests.isComplete(id);
      return `<div class="card">
        <div class="ct"><span class="ico">${qtypeIcon(q.type)}</span><span class="nm">${E(q.name)}</span>
          <span class="rt ${done?'q-gold':''}">${done?'可交付':Quests.progressText(id)}</span></div>
        <div class="ds">${E(q.desc)}</div>
        <div class="tiny dim" style="margin-top:4px">目标：${E((q.objective||{}).label||'')} ${q.objective&&q.objective.count?'('+Quests.progressText(id)+')':''}</div>
        <div class="btns">${done?`<button class="primary" onclick="Act.turnIn('${id}')">交付任务</button>`:`<button class="ghost" onclick="Act.trackQuest('${id}')">查看奖励</button>`}</div></div>`;
    }).join('');
    const avail=Object.values(DATA.quests).filter(q=>q.cityId===G.cityId&&Quests.isAvailable(q.id)).map(q=>`
      <div class="card btn" onclick="Act.acceptQuest('${q.id}')">
        <div class="ct"><span class="ico">${qtypeIcon(q.type)}</span><span class="nm">${E(q.name)}</span><span class="rt">Lv${q.reqLevel||1}</span></div>
        <div class="ds">${E(q.desc)}</div><div class="tiny q-gold" style="margin-top:3px">点击接取</div></div>`).join('');
    return `<h2 class="title">📜 任务</h2>
      <h3 class="sub">进行中</h3><div class="list">${active||'<div class="empty">没有进行中的任务</div>'}</div>
      <h3 class="sub">${DATA.cities[G.cityId].name} · 可接取</h3><div class="list">${avail||'<div class="empty">此地暂无可接任务</div>'}</div>`;
  }
  function qtypeIcon(t){ return ({main:'⭐',hidden:'🔮',side:'📋',class:'🎯'})[t]||'📜'; }

  // ============ 地图 / 传送 ============
  function map(){
    const city=DATA.cities[G.cityId];
    const conns=(city.connections||[]).map(c=>{ const t=DATA.cities[c.to]; if(!t) return '';
      const locked=t.unlockLevel&&G.level<t.unlockLevel;
      return `<div class="card btn" onclick="${locked?'':`Act.travel('${c.to}',${c.cost})`}" style="${locked?'opacity:.5':''}">
        <div class="ct"><span class="ico">${t.icon}</span><span class="nm">${E(t.name)}</span>
          <span class="rt">${locked?'Lv'+t.unlockLevel+'解锁':money(c.cost)}</span></div>
        <div class="ds">${E(DATA.empires[t.empire].name)} · 推荐Lv${t.recommendLevel[0]}-${t.recommendLevel[1]}</div></div>`;
    }).join('');
    return `<h2 class="title">🗺️ 传送<small>当前：${E(city.name)}</small></h2>
      <p class="dim tiny">通过传送阵往来各城（消耗铜币）。后期开放坐骑可巡游世界。</p>
      <div class="list">${conns||'<div class="empty">无可前往之地</div>'}</div>`;
  }

  // ============ 商店 ============
  function shop(){
    const city=DATA.cities[G.cityId];
    const items=(city.shop||[]).map(id=>{ const d=DATA.items[id]; if(!d) return '';
      const price=Math.round((d.value||10)*1.4);
      return `<div class="card btn" onclick="Act.buy('${id}')">
        <div class="ct"><span class="ico">${d.icon||'📦'}</span><span class="nm">${iname({id})}</span><span class="rt">${money(price)}</span></div>
        <div class="ds">${E(d.desc||'')}</div></div>`;
    }).join('');
    return `<h2 class="title">🛒 商店<small>${money(G.gold)}</small></h2>
      <p class="dim tiny">出售物品请到背包中点击物品选择「卖出」。</p>
      <div class="list">${items}</div>`;
  }

  // ============ 战斗 ============
  function combat(){
    const st=Combat.state();
    if(st.over) return combatEnd(st);
    const e=st.enemy;
    const ehpPct=e?Math.round(e.hp/e.maxHp*100):0;
    const cls=DATA.classes[G.classId];
    const phpPct=Math.round(G.hpCur/G.maxHp*100), pmpPct=Math.round(G.mpCur/G.maxMp*100);
    const enemyTag=e?(e.type==='boss'?'<span class="tag q-dark">BOSS</span>':e.type==='elite'?'<span class="tag q-purple">精英</span>':''):'';
    const statusE=e?[(e.stun>0?'😵眩晕':''),...(e.dots||[]).map(d=>'🩸'+d.name),...(e.debuffs||[]).map(d=>'⬇'+d.name)].filter(Boolean).join(' '):'';
    const statusP=[...(st.pBuffs||[]).map(b=>'⬆'+b.name),(st.pShield>0?'🛡️护盾'+st.pShield:''),(st.pStun>0?'😵被控':'')].filter(Boolean).join(' ');
    // 技能按钮
    const skBtns=(G.skills||[]).concat(G.setSkills||[]).map(id=>{ const s=DATA.skills[id]; if(!s||s.type!=='active') return '';
      const cd=Combat.cooldown(id); const noMp=G.mpCur<(s.mpCost||0);
      const dis=cd>0||noMp;
      return `<button ${dis?'disabled':''} onclick="Act.cSkill('${id}')" title="${E(s.desc)}">
        ${s.icon||''}${E(s.name)}${cd>0?`<span class="cd">CD${cd}</span>`:`<span class="cd">${s.mpCost||0}</span>`}</button>`;
    }).join('');
    const pots=(G.bag||[]).filter(b=>{ const d=DATA.items[b.id]; return d&&d.use; }).slice(0,2).map(b=>{ const d=DATA.items[b.id];
      return `<button class="ghost" onclick="Act.cItem('${b.id}')">${d.icon||'🧪'}${E(d.name)}×${b.qty}</button>`; }).join('');
    const auto=UI.state.auto;
    const log=st.log.map(l=>`<div class="l ${l.cls}">${l.text}</div>`).join('');
    return `<h2 class="title">⚔ 战斗${st.total>1?`<small>进度 ${st.total-st.remaining}/${st.total}</small>`:''}${auto?' <small class="q-gold">自动中</small>':''}</h2>
      <div id="combat">
        <div class="vs">
          <div class="fighter"><div class="fn">${cls.icon}${E(G.name)} <span class="tiny">Lv${G.level}</span></div>
            <div class="cbar"><i style="width:${phpPct}%"></i></div><div class="tiny dim">${G.hpCur}/${G.maxHp}</div>
            <div class="cbar m"><i style="width:${pmpPct}%"></i></div><div class="tiny dim">${cls.resource} ${G.mpCur}/${G.maxMp}</div>
            <div class="tiny" style="color:#7be07b">${statusP||'&nbsp;'}</div></div>
          <div class="fighter enemy">${e?`<div class="fn">${e.icon}${E(e.name)} ${enemyTag}<span class="tiny">Lv${e.level}</span></div>
            <div class="cbar"><i style="width:${ehpPct}%"></i></div><div class="tiny dim">${e.hp}/${e.maxHp}</div>
            <div class="tiny" style="color:#ff9">${statusE||'&nbsp;'}</div>`:'虚空'}</div>
        </div>
        <div id="log">${log}</div>
        <div class="btns"><button class="primary" onclick="Act.cAttack()">普通攻击</button>${skBtns}</div>
        <div class="btns">${pots}<button class="ghost" onclick="Act.combatItems()">🎒 物品</button>
          <button class="${auto?'primary':'ghost'}" onclick="Act.toggleAuto()">${auto?'⏸ 停自动':'▶ 自动战斗'}</button>
          <button class="ghost" onclick="Act.cFlee()">逃跑</button></div>
      </div>`;
  }
  function combatEnd(st){
    const r=st.result||{};
    let body='';
    if(r.outcome==='win'){
      const gl=(r.genLoot||[]).map(it=>`<div>${iname(it)}</div>`).join('');
      const fl=(r.loot||[]).map(l=>`<div>${iname({id:l.id})}${l.qty>1?'×'+l.qty:''}</div>`).join('');
      body=`<div class="narr"><b class="q-gold">战斗胜利！</b><br>获得经验 ${r.xp}，${money(r.gold)}
        ${r.leveled?`<br><b class="q-gold">⬆ 升级了！现在 Lv${G.level}</b>`:''}
        ${r.dgReward?`<br><b class="q-gold">首通奖励：经验${r.dgReward.xp||0} ${money(r.dgReward.gold||0)}</b>`:''}
        ${(fl||gl)?`<br>战利品：<br>${fl}${gl}`:''}</div>`;
    } else if(r.outcome==='death'){
      body=`<div class="narr"><b style="color:#c0392b">你倒下了……</b><br>损失 ${r.lossXp} 经验、${money(r.lossGold)}。已在主城墓地复活。</div>`;
    } else {
      body=`<div class="narr">你脱离了战斗。</div>`;
    }
    const ctx=UI.state.ctx||{};
    let btns='';
    if(r.outcome==='death') btns=`<button class="primary full" onclick="Act.go('town')">返回主城</button>`;
    else if(ctx.zoneId) btns=`<button class="primary" onclick="Act.exploreZone('${ctx.zoneId}')">继续探索</button><button onclick="Act.go('zonelist')">返回</button>`;
    else if(ctx.dungeonId) btns=`<button class="primary" onclick="Act.dungeonDetail('${ctx.dungeonId}')">再次挑战</button><button onclick="Act.go('town')">返回主城</button>`;
    else btns=`<button class="primary full" onclick="Act.go('town')">返回主城</button>`;
    return `<h2 class="title">⚔ 战斗结束</h2>${body}<div class="btns">${btns}</div>`;
  }

  // ============ 强化 / 镶嵌 ============
  function forge(){
    const slotsOrder=['weapon','offhand','head','shoulder','chest','hand','waist','legs','feet','cloak','neck','ring1','ring2','trinket'];
    const eq=slotsOrder.filter(s=>G.equip[s]).map(s=>{ const it=G.equip[s];
      return `<div class="card btn" onclick="Act.forgeItem('${s}')"><div class="ct"><span class="ico">${slotIcon(s)}</span>
        <div>${iname(it)}<div class="ds">${DATA.slots[s]}${it.plus?` · 强化+${it.plus}`:''}</div></div></div></div>`;
    }).join('')||'<div class="empty">没有已装备的物品</div>';
    // 潘多拉之盒：列出持有≥3件的品质
    const fuseable=DATA.qualityOrder.slice(0,-1).filter(q=>World.fuseQualityCount(q)>=3).map(q=>{
      const next=DATA.qualities[DATA.qualityOrder[DATA.qualityOrder.indexOf(q)+1]];
      return `<button onclick="Act.pandora('${q}')">${DATA.qualities[q].name}×3 → ${next.name}(35%)</button>`;
    }).join('');
    return `<h2 class="title">⚒️ 强化与镶嵌<small>幸运宝石×${Systems.countItem('lucky_gem')}</small></h2>
      <p class="dim tiny">幸运宝石可砸级强化（+10阶以上失败有几率爆装）；黄金/暗金/传奇装备可镶嵌宝石。</p>
      <div class="list">${eq}</div>
      <h3 class="sub">潘多拉之盒 · 三件合成</h3>
      <p class="dim tiny">投入 3 件同品质装备，35% 概率合成一件高一阶装备，失败则全部消失。</p>
      <div class="btns">${fuseable||'<span class="dim tiny">暂无可合成的同品质装备（需≥3件）</span>'}</div>`;
  }

  // ============ 命骰 ============
  function diceScreen(){
    const dcost=300*((G.stats.diceRolls||0)+1);
    return `<h2 class="title">🎲 神龛 · 命骰<small>已投 ${G.stats.diceRolls||0} 次</small></h2>
      <div class="narr">古老的神龛前，投掷命骰祈求命运，结果或喜或悲。
每次需向神龛**献祭铜币**（费用随投掷次数递增），以免亵渎命运。
（2-3点厄运，4-9平庸，10-11吉，12大吉）</div>
      <div class="btns"><button class="primary full" onclick="Act.rollDice()">🎲 投掷命骰（献祭 ${dcost} 铜）</button></div>
      ${Systems.countItem('cursed_skull')>0?`<div class="narr" style="border-left-color:#b65cff">你持有【被诅咒的骷髅】×${Systems.countItem('cursed_skull')}。捏碎它将投掷三次命骰——大喜大悲，由命运裁决。</div>
        <div class="btns"><button class="danger full" onclick="Act.fateRoll()">💀 捏碎骷髅·三连命骰</button></div>`:''}
      <div class="btns"><button class="ghost full" onclick="Act.go('town')">离开</button></div>`;
  }

  window.Screens={ charcreate, town, zonelist, dungeonlist, character, bag, skills, quests, map, shop, combat, forge, diceScreen };

  // ============ 生活技能 ============
  function profession(){
    if(!G.profession){
      const list=Object.values(DATA.professions).map(p=>`<div class="card btn" onclick="Act.pickProf('${p.id}')">
        <div class="ct"><span class="ico">${p.icon}</span><span class="nm">${p.name}</span></div><div class="ds">${E(p.desc)}</div></div>`).join('');
      return `<h2 class="title">🧵 生活技能<small>选择一门</small></h2><p class="dim tiny">选择一门生活职业，采集材料、打造物品，靠熟练度晋阶（学徒→宗师级）。</p><div class="list">${list}</div>`;
    }
    const p=DATA.professions[G.profession]; const rank=World.profRankName(); const need=World.RANK_EXP(G.profLevel||0);
    const recipes=DATA.recipes.filter(r=>r.prof===G.profession).map(r=>{
      const can=(G.profLevel||0)>=r.rankReq;
      const mats=Object.keys(r.mats).map(m=>`${(DATA.items[m]||{}).name||m}×${r.mats[m]}（有${Systems.countItem(m)}）`).join('，')||'无需材料';
      return `<div class="card"><div class="ct"><span class="nm">${E(r.name)}</span><span class="rt">${DATA.profRanks[r.rankReq]}</span></div>
        <div class="ds">材料：${mats} → ${(DATA.items[r.out.id]||{}).name}×${r.out.qty||1}</div>
        <div class="btns"><button class="${can?'primary':''}" ${can?'':'disabled'} onclick="Act.craft('${r.id}')">${r.gather?'采集制作':'打造'}</button></div></div>`;
    }).join('');
    return `<h2 class="title">${p.icon} ${p.name}<small>${rank}</small></h2>
      <div class="card"><div class="kv"><span>熟练度</span><b>${G.profExp||0}/${need}</b></div>
        <div class="btns"><button class="primary" onclick="Act.gather()">🌿 外出采集</button></div></div>
      <h3 class="sub">配方</h3><div class="list">${recipes}</div>`;
  }

  // ============ 坐骑 / 宠物 ============
  function stable(){
    const mounts=Object.values(DATA.mounts).map(m=>{ const own=World.ownMount(m.id); const active=G.mount===m.id;
      return `<div class="card ${own?'btn':''}" ${own?`onclick="Act.setMount('${m.id}')"`:''}>
        <div class="ct"><span class="ico">${m.icon}</span><span class="nm">${m.name}${active?' <span class="tag q-gold">骑乘中</span>':''}</span>
          <span class="rt">${own?(active?'使用中':'点击骑乘'):(m.quest?'任务获得':money(m.price))}</span></div>
        <div class="ds">${E(m.desc)}</div>
        ${(!own&&!m.quest)?`<div class="btns"><button class="primary" onclick="Act.buyMount('${m.id}')">购买</button></div>`:''}</div>`;
    }).join('');
    const allies=Object.values(DATA.allies).map(a=>{ const own=World.ownAlly(a.id); const active=G.pet===a.id;
      const tag=a.kind==='follower'?'随从':'宠物';
      return `<div class="card ${own?'btn':''}" ${own?`onclick="Act.setAlly('${a.id}')"`:''}>
        <div class="ct"><span class="ico">${a.icon}</span><span class="nm">${a.name}${active?' <span class="tag q-gold">出战中</span>':''}</span>
          <span class="rt">${own?(active?'出战中':'点击出战'):(a.quest?'任务获得':a.source==='guild'?'公会招募':money(a.price))}</span></div>
        <div class="ds">${tag} · 协助攻击约${Math.round(a.atkMul*100)}%战力${a.healMul?'，会治疗':''}${a.ignoreArmor?'，无视护甲':''}。${E(a.desc)}</div>
        ${(!own&&!a.quest&&a.source!=='guild')?`<div class="btns"><button class="primary" onclick="Act.buyAlly('${a.id}')">购买</button></div>`:''}</div>`;
    }).join('');
    return `<h2 class="title">🐎 坐骑与宠物<small>${money(G.gold)}</small></h2>
      <h3 class="sub">坐骑（提供属性与传送折扣）</h3><div class="list">${mounts}</div>
      <h3 class="sub">宠物 / 随从（战斗中协助）</h3>
      <div class="btns"><button class="ghost" onclick="Act.setAlly('')">收回当前出战</button></div>
      <div class="list">${allies}</div>`;
  }

  // ============ 公会 ============
  function guild(){
    if(G.guild!=='niuren'){
      const g=DATA.guilds.niuren;
      return `<h2 class="title">🐮 公会</h2><div class="narr">${E(g.desc)}</div>
        <div class="btns"><button class="primary full" onclick="Act.joinGuild()">加入牛人部落</button></div>`;
    }
    const shop=DATA.guildShop.map((e,i)=>`<div class="card btn" onclick="Act.guildBuy(${i})">
      <div class="ct"><span class="nm">${E(e.name)}</span><span class="rt q-gold">${e.cost} 贡献</span></div></div>`).join('');
    return `<h2 class="title">🐮 牛人部落<small>贡献值 ${G.contribution||0}</small></h2>
      <div class="card">公会会员。通关副本、完成任务可累积贡献值，在贡献商店兑换随从与物资。</div>
      <h3 class="sub">贡献商店</h3><div class="list">${shop}</div>`;
  }

  // ============ 战场 / 国战 ============
  function battleground(){
    const bgs=Object.values(DATA.battlegrounds).map(b=>{ const can=G.level>=b.reqLevel; const owned=G.fortresses&&G.fortresses[b.reward.fortress];
      return `<div class="card ${can?'btn':''}" ${can?`onclick="Act.startBG('${b.id}')"`:''} style="${can?'':'opacity:.5'}">
        <div class="ct"><span class="ico">${b.icon}</span><span class="nm">${E(b.name)}</span><span class="rt">Lv${b.reqLevel}${owned?' · 已占领':''}</span></div>
        <div class="ds">${E(b.desc)}</div>
        <div class="tiny q-gold" style="margin-top:3px">奖励：经验${b.reward.xp} · ${b.reward.credit}信用点${b.reward.title?' · 称号「'+b.reward.title+'」':''}${can?' · 点击出征':' · 等级不足'}</div></div>`;
    }).join('');
    return `<h2 class="title">⚔️ 战场 · 要塞 · 国战<small>信用点 ${G.credit||0}</small></h2>
      <p class="dim tiny">率军参与要塞攻防与阵营国战（多波敌军+领主）。胜利可占领要塞、获得信用点与荣誉称号。</p>
      <div class="list">${bgs}</div>`;
  }

  Object.assign(window.Screens, { profession, stable, guild, battleground });
})();
