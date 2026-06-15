/* systems2.js —— 生活技能 / 坐骑 / 宠物随从 / 公会 / 战场 逻辑（window.World） */
(function(){
  const RANK_EXP = r => (r+1)*120;   // 升到下一阶所需熟练度

  // ===== 生活职业 =====
  function pickProfession(id){
    if(!DATA.professions[id]) return false;
    G.profession=id; G.profLevel=G.profLevel||0; G.profExp=G.profExp||0; Save.save(); return true;
  }
  function profRankName(){ return DATA.profRanks[Math.min(G.profLevel||0, DATA.profRanks.length-1)]; }
  function addProfExp(n){
    G.profExp=(G.profExp||0)+n;
    let up=false;
    while(G.profLevel<DATA.profRanks.length-1 && G.profExp>=RANK_EXP(G.profLevel)){ G.profExp-=RANK_EXP(G.profLevel); G.profLevel++; up=true; }
    return up;
  }
  function gather(){
    if(!G.profession) return {ok:false,why:'未选择生活职业'};
    const pool=[['herb',3],['iron_ore',3],['fine_silk',2],['bat_tooth',2],['treant_bark',1]];
    let t=0; pool.forEach(p=>t+=p[1]); let r=Math.random()*t, picked=pool[0][0];
    for(const p of pool){ r-=p[1]; if(r<=0){picked=p[0];break;} }
    const qty=Systems.rand(1,3);
    Systems.addItem(picked,qty);
    const up=addProfExp(8);
    Save.save();
    return {ok:true, item:picked, qty, rankUp:up, rank:profRankName()};
  }
  function craft(rid){
    const rc=DATA.recipes.find(x=>x.id===rid); if(!rc) return {ok:false,why:'无此配方'};
    if(G.profession!==rc.prof) return {ok:false,why:'职业不符（需'+DATA.professions[rc.prof].name+'）'};
    if((G.profLevel||0)<rc.rankReq) return {ok:false,why:'熟练度不足（需'+DATA.profRanks[rc.rankReq]+'）'};
    for(const m in rc.mats){ if(Systems.countItem(m)<rc.mats[m]) return {ok:false,why:'材料不足：'+(DATA.items[m].name)}; }
    for(const m in rc.mats) Systems.removeItem(m,rc.mats[m]);
    Systems.addItem(rc.out.id, rc.out.qty||1);
    const up=addProfExp(rc.exp);
    Save.save();
    return {ok:true, out:rc.out, rankUp:up, rank:profRankName()};
  }

  // ===== 坐骑 =====
  function ownMount(id){ return (G.mounts||[]).includes(id); }
  function buyMount(id){
    const m=DATA.mounts[id]; if(!m) return {ok:false,why:'无此坐骑'};
    if(ownMount(id)) return {ok:false,why:'已拥有'};
    if(m.quest) return {ok:false,why:'需通过任务获得'};
    if(G.gold<m.price) return {ok:false,why:'铜币不足'};
    Systems.addGold(-m.price); G.mounts.push(id); if(!G.mount) setMount(id); Save.save();
    return {ok:true};
  }
  function grantMount(id){ if(!ownMount(id)){ G.mounts.push(id); if(!G.mount) setMount(id); Save.save(); } }
  function setMount(id){ G.mount = (id&&ownMount(id))?id:null; Systems.recompute(); Save.save(); }
  function mountDiscount(){ const m=G.mount&&DATA.mounts[G.mount]; return m?m.speed/100:0; }

  // ===== 宠物 / 随从 =====
  function ownAlly(id){ return (G.pets||[]).includes(id); }
  function buyAlly(id){
    const a=DATA.allies[id]; if(!a) return {ok:false,why:'无此宠物'};
    if(ownAlly(id)) return {ok:false,why:'已拥有'};
    if(a.quest||a.source==='guild') return {ok:false,why:a.source==='guild'?'需在公会招募':'需通过任务获得'};
    if(G.gold<(a.price||0)) return {ok:false,why:'铜币不足'};
    Systems.addGold(-(a.price||0)); G.pets.push(id); if(!G.pet) G.pet=id; Save.save();
    return {ok:true};
  }
  function grantAlly(id){ if(!ownAlly(id)){ G.pets.push(id); if(!G.pet) G.pet=id; Save.save(); } }
  function setAlly(id){ G.pet=(id&&ownAlly(id))?id:null; Save.save(); }

  // ===== 公会 =====
  function joinGuild(){ G.guild='niuren'; G.contribution=G.contribution||0; Save.save(); }
  function addContribution(n){ if(G.guild){ G.contribution=(G.contribution||0)+n; } }
  function guildBuy(idx){
    const e=DATA.guildShop[idx]; if(!e) return {ok:false,why:'无此商品'};
    if((G.contribution||0)<e.cost) return {ok:false,why:'贡献值不足'};
    if(e.type==='ally' && ownAlly(e.id)) return {ok:false,why:'已招募'};
    G.contribution-=e.cost;
    if(e.type==='ally') grantAlly(e.id); else Systems.addItem(e.id, e.qty||1);
    Save.save();
    return {ok:true};
  }

  // ===== 潘多拉之盒：三件同阶合成升一阶 =====
  function fuseQualityCount(q){
    return (G.bag||[]).filter(it=>{ const d=window.Items?Items.def(it):DATA.items[it.id]; return d&&d.slot&&d.quality===q; }).length;
  }
  function pandoraFuse(q){
    const order=DATA.qualityOrder; const idx=order.indexOf(q);
    if(idx<0||idx>=order.length-1) return {ok:false,why:'该品质无法继续合成'};
    // 取该品质的前3件装备
    const idxs=[];
    for(let i=0;i<G.bag.length && idxs.length<3;i++){ const d=window.Items?Items.def(G.bag[i]):DATA.items[G.bag[i].id]; if(d&&d.slot&&d.quality===q) idxs.push(i); }
    if(idxs.length<3) return {ok:false,why:'需要 3 件「'+DATA.qualities[q].name+'」装备'};
    // 移除（从后往前）
    idxs.sort((a,b)=>b-a).forEach(i=>G.bag.splice(i,1));
    const success = Math.random()<0.35;   // 原著10%，单机提升至35%
    if(!success){ Save.save(); return {ok:true, success:false}; }
    const nextQ=order[idx+1];
    const inst = window.Items ? Items.gen(Math.max(1,G.level), {quality:nextQ}) : null;
    if(inst) Systems.addInstance(inst);
    Save.save();
    return {ok:true, success:true, item:inst};
  }

  // ===== 图书馆 / 语言 =====
  function studyAttr(attr){
    const lib=DATA.library; G.studied=G.studied||{};
    const n=G.studied[attr]||0;
    if(n>=lib.maxPerAttr) return {ok:false,why:'此属性已研读至上限'};
    const cost=lib.baseCost*(n+1);
    if(G.gold<cost) return {ok:false,why:'铜币不足（需'+cost+'）'};
    Systems.addGold(-cost); G.studied[attr]=n+1; G.base[attr]=(G.base[attr]||0)+1; Systems.recompute(); Save.save();
    return {ok:true, cost, n:n+1};
  }
  function learnLang(lang){
    G.langs=G.langs||{}; if(G.langs[lang]) return {ok:false,why:'已掌握'};
    if(G.gold<DATA.library.langCost) return {ok:false,why:'铜币不足'};
    Systems.addGold(-DATA.library.langCost); G.langs[lang]=true; Save.save();
    return {ok:true};
  }

  window.World = { pickProfession, profRankName, addProfExp, gather, craft, ownMount, buyMount, grantMount, setMount, mountDiscount,
    ownAlly, buyAlly, grantAlly, setAlly, joinGuild, addContribution, guildBuy, RANK_EXP,
    fuseQualityCount, pandoraFuse, studyAttr, learnLang };
})();
