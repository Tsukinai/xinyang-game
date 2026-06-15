/* ui.js —— UI 基础设施：toast / modal / 格式化 / 状态栏 / 底部导航 */
(function(){
  // ---------- 元素 ----------
  function $(id){ return document.getElementById(id); }
  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

  // ---------- 提示 ----------
  let toastT=null;
  function toast(msg, ms){
    const box=$('toast'); if(!box) return;
    const el=document.createElement('div'); el.className='toast'; el.innerHTML=msg; box.appendChild(el);
    setTimeout(()=>{ el.style.opacity='0'; el.style.transition='opacity .4s'; setTimeout(()=>el.remove(),400); }, ms||1800);
  }
  // ---------- 模态 ----------
  function modal(html){ const m=$('modal'), b=$('mbox'); b.innerHTML=html; m.classList.add('on'); }
  function closeModal(){ $('modal').classList.remove('on'); }

  // ---------- 货币 ----------
  function money(c){ c=Math.max(0,Math.round(c||0));
    const g=Math.floor(c/10000), s=Math.floor(c/100)%100, b=c%100;
    let out=''; if(g) out+=`<span style="color:#e0b34c">${g}金</span>`; if(s||g) out+=`<span style="color:#c9d6e6">${s}银</span>`; out+=`<span style="color:#c8956a">${b}铜</span>`;
    return out;
  }

  // ---------- 品质 ----------
  function qcls(q){ return (DATA.qualities[q]||{}).cls || 'q-white'; }
  function qname(q){ return (DATA.qualities[q]||{}).name || '普通'; }
  function itemDef(it){ return window.Items?Items.def(it):(DATA.items[it.id]||it); }
  function itemName(it){ const d=itemDef(it); if(!d) return '?';
    const q=d.quality||'white'; const plus=(it&&it.plus)?` +${it.plus}`:'';
    return `<span class="${qcls(q)}">${esc(d.name)}${plus}</span>`; }

  // 物品详情 HTML
  function itemTip(it){
    const d=itemDef(it); if(!d) return '';
    const st=window.Systems?Systems.itemStats(it):(d.stats||{});
    const lines=[];
    const map={str:'力量',agi:'敏捷',int:'智力',sta:'体质',spi:'精神',atk:'攻击',sp:'法术强度',armor:'护甲',hp:'生命',mp:'法力',crit:'暴击%',dodge:'闪避%',haste:'急速',lifesteal:'吸血%',thorns:'荆棘反伤%'};
    for(const k in st){ if(st[k]) lines.push(`<div class="kv"><span>${map[k]||k}</span><b>+${st[k]}</b></div>`); }
    let socket='';
    if (d.slot && window.Systems){ const sc=Systems.socketCount(it); const used=(it.gems||[]).length;
      if(sc) socket=`<div class="tiny dim">凹槽 ${used}/${sc}${(it.gems||[]).map(g=>' '+(DATA.items[g]?DATA.items[g].name:'')).join('')}</div>`; }
    return `<div><b class="${qcls(d.quality)}">${esc(d.name)}${it&&it.plus?` +${it.plus}`:''}${it&&it.upLv?` <span class="q-gold">✦${it.upLv}</span>`:''}</b>
      <span class="tag ${qcls(d.quality)}">${qname(d.quality)}</span>
      ${d.slot?`<span class="tiny dim"> · ${DATA.slots[d.slot]||d.type||''}</span>`:''}
      ${d.reqLevel?`<span class="tiny dim"> · 需求Lv${d.reqLevel}</span>`:''}
      ${window.Systems&&Systems.isBound&&Systems.isBound(it)?'<span class="tiny" style="color:#b65cff"> · 绑定</span>':''}</div>
      ${lines.length?`<div class="stats" style="grid-template-columns:1fr">${lines.join('')}</div>`:''}
      ${socket}
      ${d.desc?`<p class="tiny dim">${esc(d.desc)}</p>`:''}`;
  }

  // 装备目标槽位（复制 Systems.equip 的双戒指逻辑）
  function equipTargetSlot(d){
    let slot=d.slot;
    if(slot==='ring1' && G.equip.ring1 && !G.equip.ring2) slot='ring2';
    return slot;
  }
  // 单个对比块：新装备 ns 对比某个已穿戴 old
  function cmpBlock(ns, old, slotName){
    if(!old){ const gain=window.Systems?Systems.statScore(ns):0;
      return `<div class="cmp"><div class="tiny dim">${slotName}（空）：装备后净增全部属性 · ⚔️战力 <b style="color:#7be07b">+${gain}</b></div></div>`; }
    const os=window.Systems?Systems.itemStats(old):((itemDef(old)||{}).stats||{});
    const map={str:'力量',agi:'敏捷',int:'智力',sta:'体质',spi:'精神',atk:'攻击',sp:'法术强度',armor:'护甲',hp:'生命',mp:'法力',crit:'暴击%',dodge:'闪避%',haste:'急速',lifesteal:'吸血%',thorns:'荆棘反伤%'};
    const keys=Object.keys(map).filter(k=>ns[k]||os[k]);
    const rows=keys.map(k=>{ const nv=ns[k]||0, ov=os[k]||0, dv=nv-ov;
      const col=dv>0?'#7be07b':dv<0?'#e07b7b':'var(--ink-dim)'; const sign=dv>0?'+':'';
      return `<div class="kv"><span>${map[k]}</span><b>${ov} → ${nv} <span style="color:${col}">(${sign}${dv})</span></b></div>`;
    }).join('');
    let scoreRow='';
    if(window.Systems){ const sv=Systems.statScore(ns)-Systems.statScore(os);
      const col=sv>0?'#7be07b':sv<0?'#e07b7b':'var(--ink-dim)';
      scoreRow=`<div class="kv"><span>⚔️ 装备战力</span><b style="color:${col}">${sv>0?'+':''}${sv}</b></div>`; }
    return `<div class="cmp"><div class="tiny dim">对比已穿（${slotName}）：${itemName(old)}${old.plus?' +'+old.plus:''}</div>
      <div class="stats" style="grid-template-columns:1fr">${scoreRow}${rows}</div></div>`;
  }
  // 背包装备 vs 已穿戴 的属性对比 HTML（戒指对比两个戒指位）
  function itemCompare(it){
    const d=itemDef(it); if(!d||!d.slot) return '';
    const ns=window.Systems?Systems.itemStats(it):(d.stats||{});
    if(d.slot==='ring1') return cmpBlock(ns, G.equip.ring1, '戒指①') + cmpBlock(ns, G.equip.ring2, '戒指②');
    const slot=equipTargetSlot(d);
    return cmpBlock(ns, G.equip[slot], DATA.slots[slot]||d.type||'');
  }

  // ---------- 状态栏 ----------
  function renderStatus(){
    const sb=$('statusbar'); if(!sb) return;
    if(!G){ sb.innerHTML=''; return; }
    const cls=DATA.classes[G.classId];
    const need=Systems.xpToNext(G.level);
    const xpPct=G.level>=Systems.LEVEL_CAP?100:Math.min(100,Math.round(G.xp/need*100));
    const hpPct=Math.round(G.hpCur/G.maxHp*100), mpPct=Math.round(G.mpCur/G.maxMp*100);
    const title=G.title?`<span class="q-gold tiny">[${esc(G.title)}]</span> `:'';
    sb.innerHTML=`
      <div class="sb-row">
        <span class="sb-name">${cls.icon} ${esc(G.name)}</span>
        <span class="sb-meta">Lv${G.level} ${G.advClass?'<span class="q-gold">'+esc(G.advClass)+'</span>':cls.name}${G.spec?'·'+(cls.specs.find(s=>s.id===G.spec)||{}).name:''}</span>
        <span class="sb-gold">${money(G.gold)}</span>
      </div>
      <div class="sb-row" style="margin-top:2px">${title}<span class="sb-meta">${DATA.empires[G.empire].name}</span></div>
      <div class="bars">
        <div class="bar hp"><i style="width:${hpPct}%"></i><span>生命 ${G.hpCur}/${G.maxHp}</span></div>
        <div class="bar mp"><i style="width:${mpPct}%"></i><span>${cls.resource} ${G.mpCur}/${G.maxMp}</span></div>
        <div class="bar xp"><i style="width:${xpPct}%"></i><span>${G.level>=Systems.LEVEL_CAP?'已满级':'经验 '+xpPct+'%'}</span></div>
      </div>`;
  }

  // ---------- 底部导航 ----------
  // 按核心循环使用频率排序：城镇(冒险枢纽)→背包(每战后整理)→任务(目标/交付)→角色(加点)→技能→地图(传送,最低频)
  const NAV=[['town','🏛️','城镇'],['bag','🎒','背包'],['quests','📜','任务'],['character','🧝','角色'],['skills','✨','技能'],['map','🗺️','地图']];
  function renderNav(){
    const nav=$('nav'); if(!nav) return;
    if(!G){ nav.innerHTML=''; return; }
    const inCombat = window.Combat && Combat.active && Combat.active();
    nav.innerHTML=NAV.map(([s,i,t])=>{
      const on=UI.state.screen===s?'on':'';
      const q=s==='quests'?questBadge():s==='character'?charBadge():s==='bag'?bagBadge():'';
      return `<button class="${on}" ${inCombat?'disabled':''} onclick="Act.go('${s}')"><span class="ni">${i}</span>${t}${q}</button>`;
    }).join('');
  }
  function questBadge(){
    let n=0; for(const id of Object.keys(G.quests||{})) if(Quests.isComplete(id)) n++;
    return n?`<span class="badge">${n}</span>`:'';
  }
  function charBadge(){ return (G.statPoints>0)?`<span class="badge">${G.statPoints}</span>`:''; } // 有可分配属性点
  function bagBadge(){   // 背包里有比已穿戴更强的可装备物品
    if(!window.Systems) return '';
    let n=0;
    for(const it of (G.bag||[])){ const def=itemDef(it);
      if(!def||!def.slot) continue;
      const ce=Systems.canEquip&&Systems.canEquip(it); if(ce&&ce.ok===false) continue;
      let slot=def.slot; if(slot==='ring1'&&G.equip.ring1&&!G.equip.ring2) slot='ring2';
      const old=G.equip[slot];
      const ns=Systems.statScore(Systems.itemStats(it));
      const os=old?Systems.statScore(Systems.itemStats(old)):0;
      if(ns>os) n++;
    }
    return n?`<span class="badge">${n}</span>`:'';
  }

  window.UI = { $, esc, toast, modal, closeModal, money, qcls, qname, itemName, itemDef, itemTip, itemCompare,
    renderStatus, renderNav, state:{ screen:'charcreate', ctx:null } };
})();
