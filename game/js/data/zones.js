/* zones.js —— 野外练级区
 * {id,name,cityId,levelRange:[lo,hi],icon,desc,
 *  encounters:[{m:monsterId,w:weight}], rare:[{m,chance}], events:[eventId...]?}
 */
window.DATA = window.DATA || {};

DATA.zones = {
  // 卡罗尔草原（特拉克）
  z_ratfield:{ id:'z_ratfield', name:'银灰巨鼠郊野', cityId:'tracker', levelRange:[1,3], icon:'🌾',
    desc:'特拉克小镇郊外，新手起步之地。', encounters:[{m:'rat',w:7},{m:'wildcat',w:3}], rare:[] },
  z_grassland:{ id:'z_grassland', name:'卡罗尔草原', cityId:'tracker', levelRange:[3,6], icon:'🐂',
    desc:'广袤草原，野牛与野猫成群。', encounters:[{m:'wildcat',w:3},{m:'bull',w:5},{m:'bat',w:3}], rare:[{m:'bulllord',chance:0.05},{m:'deerlord',chance:0.03}] },
  z_batcave:{ id:'z_batcave', name:'摩多蝙蝠洞', cityId:'tracker', levelRange:[3,5], icon:'🦇',
    desc:'蝙蝠最集中的刷新点，牙齿可卖钱。', encounters:[{m:'bat',w:8},{m:'wizard_f',w:2}] },
  z_sunken:{ id:'z_sunken', name:'沉沦巫师营地', cityId:'tracker', levelRange:[5,7], icon:'🧙',
    desc:'盘踞着沉沦巫师的营地。', encounters:[{m:'wizard_f',w:6},{m:'bull',w:2}], rare:[{m:'lion',chance:0.04}] },
  // 希尔顿要塞
  z_lake:{ id:'z_lake', name:'然多湖', cityId:'hilton', levelRange:[7,9], icon:'🎣',
    desc:'盛产精丝的湖泊，深处潜伏黄金电鳗。', encounters:[{m:'murloc',w:5},{m:'spider',w:3}], rare:[{m:'eel',chance:0.04}] },
  z_treantwood:{ id:'z_treantwood', name:'树妖林外围', cityId:'hilton', levelRange:[10,13], icon:'🌲',
    desc:'失控的树妖游荡其间，黑精灵潜伏。', encounters:[{m:'treant',w:6},{m:'darkelf',w:2}], rare:[{m:'treant_herd',chance:0.05}] },
  // 永恒之城
  z_eternal:{ id:'z_eternal', name:'永恒之城废墟', cityId:'eternal', levelRange:[20,23], icon:'🏚️',
    desc:'地精机械魔偶成群游荡的远古废墟。', encounters:[{m:'golem',w:7}], rare:[{m:'goblin_cut',chance:0.04}] },
  z_moonlight:{ id:'z_moonlight', name:'索尼娅月光林地', cityId:'eternal', levelRange:[22,26], icon:'🌙',
    desc:'白精灵的故乡遗迹，月熊出没。善良之章传说藏于林地中央。', encounters:[{m:'moonbear',w:6},{m:'golem',w:2}], rare:[{m:'werewolf',chance:0.03}] },
  // 沼泽 / 瘟疫
  z_swamp:{ id:'z_swamp', name:'纳特兰沼泽', cityId:'sogot', levelRange:[32,36], icon:'🐸',
    desc:'索哥特古城外的幽暗沼泽，怨灵密布。', encounters:[{m:'swamp_undead',w:6}], rare:[{m:'abak_heir',chance:0.03}] },
  z_plague:{ id:'z_plague', name:'瘟疫峡谷', cityId:'sogot', levelRange:[35,40], icon:'☣️',
    desc:'特索依瘟疫镇外，行尸遍野。', encounters:[{m:'plague',w:6}], rare:[{m:'goldworm',chance:0.02}] },
  // 高级
  z_sin:{ id:'z_sin', name:'罪域峡谷', cityId:'element', levelRange:[45,55], icon:'🌋',
    desc:'战神克罗陨落之地，封印泽恩纳德之剑。黑暗生物盘踞。', encounters:[{m:'plague',w:3},{m:'swamp_undead',w:3},{m:'goblin_cut',w:2}], rare:[{m:'goldworm',chance:0.03}] },
};
