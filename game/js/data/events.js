/* events.js —— 随机遭遇 / 随机事件 / 宝箱 / 命骰
 * Events.encounter(zone) -> monster def(clone)   随机遇怪（含稀有精英）
 * Events.maybeEvent(zone) -> event|null          随机事件
 * Events.openChest(tier, viaLockpick) -> result
 * Events.rollDice() -> {text}                     命骰
 */
window.DATA = window.DATA || {};
(function(){
  function rand(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
  function chance(p){ return Math.random()<p; }
  function pickW(list){ // [{...,w}]
    let t=0; for(const x of list) t+=x.w||1;
    let r=Math.random()*t;
    for(const x of list){ r-=x.w||1; if(r<=0) return x; }
    return list[list.length-1];
  }

  // 克隆怪物定义并按等级带做小幅随机浮动
  function cloneMonster(id, lvlAdj){
    const base = DATA.monsters[id]; if(!base) return null;
    const m = JSON.parse(JSON.stringify(base));
    if (lvlAdj){ m.level = Math.max(1, m.level + lvlAdj);
      const f = 1 + lvlAdj*0.12; m.hp=Math.round(m.hp*f); m.atk=Math.round(m.atk*f); m.xp=Math.round(m.xp*f); }
    return m;
  }

  function encounter(zone){
    // 稀有精英刷新
    if (zone.rare) for (const r of zone.rare){ if (chance(r.chance)) return cloneMonster(r.m, rand(0,1)); }
    if (!zone.encounters || !zone.encounters.length) return null;
    const e = pickW(zone.encounters);
    // 等级带内随机浮动 -1~+1
    const lo=zone.levelRange[0], hi=zone.levelRange[1];
    const base = DATA.monsters[e.m];
    let adj = 0;
    if (base) adj = rand(lo,hi) - base.level;
    adj = Math.max(-2, Math.min(3, adj));
    return cloneMonster(e.m, adj);
  }

  // 随机事件表
  function maybeEvent(zone){
    if (!chance(0.22)) return null;   // 22% 触发随机事件
    const roll = pickW([
      {t:'chest', w:3}, {t:'fortune', w:3}, {t:'ambush', w:2}, {t:'shrine', w:1.5}, {t:'merchant', w:1.5}, {t:'omen', w:1},
    ]);
    const lvl = rand(zone.levelRange[0], zone.levelRange[1]);
    switch(roll.t){
      case 'chest': {
        const tiers=['普通','白银','黄金','暗金']; const ti = pickW([{v:0,w:6},{v:1,w:3},{v:2,w:1.2},{v:3,w:0.3}]).v;
        return { type:'chest', tier:ti, tierName:tiers[ti], level:lvl,
          text:`你在${zone.name}发现一个上锁的【${tiers[ti]}宝箱】。` };
      }
      case 'fortune': {
        const g = rand(lvl*3, lvl*12)+10;
        return { type:'fortune', gold:g, text:`一名旅人感激你的相助，赠予你 ${g} 铜币。` };
      }
      case 'ambush': {
        const m = encounter(zone); if(m){ m.atk=Math.round(m.atk*1.2); m.hp=Math.round(m.hp*1.2); m.type=m.type==='normal'?'elite':m.type; m.name='伏击者·'+m.name; }
        return { type:'ambush', monster:m, text:`阴影中窜出伏击者！` };
      }
      case 'shrine': {
        return { type:'shrine', text:`你发现一座古老神龛，似乎可以投掷命骰祈求命运。` };
      }
      case 'merchant': {
        const inst = window.Items ? Items.gen(lvl, {luck:8}) : null;
        const price = inst ? Math.round(inst.value*1.6) : 50;
        return { type:'merchant', item:inst, price, text:`神秘行脚商人向你兜售：${inst?inst.name:'神秘货物'}（${price}铜币）。` };
      }
      case 'omen': default: {
        return { type:'omen', text:`天空划过一道流星——「天陨」预兆，似有异变将至……`, buff:true };
      }
    }
  }

  // 开宝箱
  function openChest(tier, viaLockpick){
    const isRogue = G.classId==='rogue';
    if (!isRogue && viaLockpick){
      if (Systems.countItem('lockpick')<=0) return { ok:false, why:'没有开锁器' };
      Systems.removeItem('lockpick',1);
    }
    // 开锁成功率（盗贼必成；其他人用开锁器后按品质有失败率）
    let succ = isRogue ? 1 : [0.95,0.8,0.6,0.4][tier];
    if (!chance(succ)) return { ok:false, why:'开锁失败，宝箱锁死了。' };
    G.stats.chestsOpened++;
    const lvl = (G.level||1);
    const gold = rand(lvl*4, lvl*16)*(tier+1);
    Systems.addGold(gold);
    const items=[];
    const nLoot = [1,1,2,2][tier];
    const qualityFloor=['bronze','silver','gold','dark'][tier];
    for(let i=0;i<nLoot;i++){
      if (window.Items){ const inst=Items.gen(lvl,{luck:[5,15,30,50][tier]});
        // 暗金箱保底品质
        items.push(inst); Systems.addInstance(inst); }
    }
    // 概率出宝石/幸运宝石
    if (chance(0.3+tier*0.15)){ Systems.addItem('lucky_gem',1); items.push({name:'幸运宝石',quality:'gold'}); }
    Save.save();
    return { ok:true, gold, items };
  }

  // 命骰（致敬潘多拉之盒）
  function rollDice(){
    const d = rand(1,6) + rand(1,6);
    let text='';
    if (d<=3){ // 厄运
      const stat = ['str','agi','int','sta','spi'][rand(0,4)];
      G.base[stat]=Math.max(1,(G.base[stat]||1)-1); Systems.recompute();
      text=`命骰 ${d} 点：命运无情，永久损失 1 点${({str:'力量',agi:'敏捷',int:'智力',sta:'体质',spi:'精神'})[stat]}。`;
    } else if (d<=9){ // 普通
      const g = rand(20,80); Systems.addGold(g); text=`命骰 ${d} 点：拾得 ${g} 铜币。`;
    } else if (d<=11){ // 吉
      const stat = ['str','agi','int','sta','spi'][rand(0,4)];
      G.base[stat]=(G.base[stat]||0)+2; Systems.recompute();
      text=`命骰 ${d} 点：天赋觉醒，永久 +2 点${({str:'力量',agi:'敏捷',int:'智力',sta:'体质',spi:'精神'})[stat]}！`;
    } else { // 大吉 12
      if (window.Items){ const inst=Items.gen(G.level,{luck:60}); Systems.addInstance(inst); text=`命骰 ${d} 点·大吉！获得稀有装备：${inst.name}！`; }
      else { Systems.addItem('lucky_gem',2); text=`命骰 12 点·大吉！获得 2 颗幸运宝石！`; }
    }
    Save.save();
    return { text };
  }

  // 命运物品·三连命骰（被诅咒的骷髅）
  function rollFate(){
    if(Systems.countItem('cursed_skull')<=0) return {ok:false,why:'没有被诅咒的骷髅'};
    Systems.removeItem('cursed_skull',1);
    const lines=[]; const attrs=[['str','力量'],['agi','敏捷'],['int','智力'],['sta','体质'],['spi','精神']];
    for(let i=0;i<3;i++){
      const d=rand(1,6);
      if(d>3){ // 奖励，越大越丰
        if(d===6){ if(window.Items){ const it=Items.gen(G.level,{luck:70}); Systems.addInstance(it); lines.push(`第${i+1}掷 6点·大吉：获得稀有装备 ${it.name}！`);} else { Systems.addItem('lucky_gem',3); lines.push(`第${i+1}掷 6点·大吉：获得3颗幸运宝石！`);} }
        else if(d===5){ const a=attrs[rand(0,4)]; G.base[a[0]]+=2; lines.push(`第${i+1}掷 5点·吉：永久 +2 ${a[1]}！`); }
        else { const g=rand(50,200); Systems.addGold(g); lines.push(`第${i+1}掷 4点：拾得 ${g} 铜币。`); }
      } else { // 诅咒，越小越重
        if(d===1){ const a=attrs[rand(0,4)]; G.base[a[0]]=Math.max(1,G.base[a[0]]-10); lines.push(`第${i+1}掷 1点·大凶：瘟疫衰弱诅咒，永久 -10 ${a[1]}！`); }
        else if(d===2){ const a=attrs[rand(0,4)]; G.base[a[0]]=Math.max(1,G.base[a[0]]-3); lines.push(`第${i+1}掷 2点·凶：永久 -3 ${a[1]}。`); }
        else { const g=Math.round(G.gold*0.1); G.gold-=g; lines.push(`第${i+1}掷 3点：破财，失去 ${g} 铜币。`); }
      }
    }
    Systems.recompute(); Save.save();
    return {ok:true, lines};
  }

  window.Events = { encounter, maybeEvent, openChest, rollDice, rollFate, cloneMonster, rand, chance };
})();
