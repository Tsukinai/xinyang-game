/* classes.js —— 六大职业 + 技能库
 * 职业契约：{id,name,icon,role,empire,power('str'|'agi'|'int'|'spi'),magic,desc,lore,
 *   base{str,agi,int,sta,spi}, growth{...}, resource:'法力'|'怒气'|'能量'|'集中',
 *   startCity, specLevel, specs:[{id,name,desc}], skills:[skillId...], adv50, adv100}
 * 技能契约：{id,name,icon,type:'active'|'passive',reqLevel,mpCost,cooldown,desc,effect{...}}
 *   effect.kind: damage|multi|dot|stun|heal|shield|buff|debuff|drain
 */
window.DATA = window.DATA || {};

DATA.classes = {
  // ===================== 盗贼 =====================
  rogue: {
    id:'rogue', name:'盗贼', icon:'🗡️', role:'近战DPS', empire:'greenland',
    power:'agi', magic:false, resource:'能量',
    desc:'敏捷近战刺客。轻甲菜刀，靠潜行、出血与毒素磨杀目标，背刺暴击恐怖。可开锁、排陷阱。',
    lore:'孤寂的行者，追逐阴影的脚步——这是盗贼的赞歌。主角聂言所选职业，巅峰进阶为「影舞」，奥义是速度。',
    base:{str:3,agi:7,int:1,sta:3,spi:1}, growth:{agi:2,str:1,sta:1},
    startCity:'tracker', specLevel:10,
    specs:[
      {id:'assassin',name:'疾风·刺杀',desc:'极致爆发与暴击，一击不成则潜行再来。'},
      {id:'combat',name:'战斗贼·游侠',desc:'双短剑持续输出，攻速与出血流。'},
    ],
    skills:['r_stealth','r_sinister','r_gouge','r_ambush','r_rupture','r_kick','r_poison','r_backstab','r_sprint','r_evasion','r_shadowstep','r_eviscerate'],
    adv50:'大盗贼', adv100:'影舞',
  },
  // ===================== 战士 =====================
  warrior: {
    id:'warrior', name:'战士', icon:'🛡️', role:'坦克/近战', empire:'greenland',
    power:'str', magic:false, resource:'怒气',
    desc:'重甲力量近战。可盾甲坦克扛怪嘲讽，也可狂剑士双手暴力输出。怒气越战越勇。',
    lore:'重甲菜刀，直线冲击，势不可挡。终极职业为神武士、圣剑士，奥义是力量。',
    base:{str:6,agi:3,int:1,sta:5,spi:1}, growth:{str:2,sta:2,agi:1},
    startCity:'tracker', specLevel:10,
    specs:[
      {id:'guardian',name:'盾甲战士',desc:'高防高血肉盾，嘲讽拉怪、盾击格挡。'},
      {id:'berserker',name:'狂剑士',desc:'双手重剑，旋风斩群攻、烈焰斩爆发。'},
    ],
    skills:['w_heroic','w_charge','w_taunt','w_shieldbash','w_hamstring','w_flamestrike','w_whirlwind','w_intimidate','w_rampage','w_stomp','w_block','w_execute'],
    adv50:'大剑士', adv100:'神武士',
  },
  // ===================== 法师 =====================
  mage: {
    id:'mage', name:'法师', icon:'🔮', role:'远程法系', empire:'greenland',
    power:'int', magic:true, resource:'法力',
    desc:'布衣远程法系。元素流掌控火冰雷群攻，奥术流单体高爆并召唤奥术精灵。脆但火力恐怖。',
    lore:'格林兰的法师拥有过人智慧与充沛魔力。终极职业为魔导师，奥义是魔法共鸣。',
    base:{str:1,agi:2,int:7,sta:3,spi:2}, growth:{int:2,sta:1,spi:1},
    startCity:'tracker', specLevel:10,
    specs:[
      {id:'elementalist',name:'元素法师',desc:'火冰雷群攻与控制，天陨炼狱。'},
      {id:'arcanist',name:'奥术法师',desc:'单体高爆+奥术精灵，奥术气定连发。'},
    ],
    skills:['m_firebolt','m_frostbolt','m_lightning','m_frostnova','m_arcanemissile','m_pyroblast','m_firering','m_polymorph','m_meteor','m_arcanesurge','m_manashield','m_inferno'],
    adv50:'大法师', adv100:'魔导师',
  },
  // ===================== 牧师 =====================
  priest: {
    id:'priest', name:'牧师', icon:'✨', role:'治疗/暗影', empire:'greenland',
    power:'spi', magic:true, resource:'法力',
    desc:'布衣神职。光明流治疗增益、团队血库；阴影流诅咒控制与暗影DOT，PK阴狠。',
    lore:'团队的生命线。光明神牧取之不竭，阴影牧师精通诅咒控制，是格林兰人数最少的职业。',
    base:{str:1,agi:2,int:5,sta:3,spi:4}, growth:{int:1,spi:2,sta:1},
    startCity:'tracker', specLevel:10,
    specs:[
      {id:'holy',name:'光明牧师',desc:'治疗、护盾、增益与复活。'},
      {id:'shadow',name:'阴影牧师',desc:'诅咒削弱、暗影箭DOT、恐惧控制。'},
    ],
    skills:['p_heal','p_smite','p_weaken','p_shadowbolt','p_dispel','p_greaterheal','p_fear','p_pain','p_shield','p_renew','p_groupheal','p_warbind'],
    adv50:null, adv100:'神牧',
  },
  // ===================== 圣骑士 =====================
  paladin: {
    id:'paladin', name:'圣骑士', icon:'⚜️', role:'守护/混合', empire:'greenland',
    power:'str', magic:false, resource:'法力',
    desc:'依附神殿的守护者。圣印光环加持队伍，圣光既能治疗又能制裁，攻防治均衡，可破隐、沉默法系。',
    lore:'神殿传承神术的守护者。终极职业守护骑士各项均衡，奥义是圣光。',
    base:{str:5,agi:2,int:2,sta:5,spi:3}, growth:{str:1,sta:2,spi:1,int:1},
    startCity:'tracker', specLevel:10,
    specs:[
      {id:'protection',name:'防护',desc:'圣盾格挡+自我治疗的混合坦克。'},
      {id:'retribution',name:'惩戒·禁言',desc:'圣光制裁输出，沉默压制法系。'},
    ],
    skills:['pal_holystrike','pal_aura','pal_shieldbash','pal_consecrate','pal_holyshield','pal_silence','pal_holylight','pal_judgement','pal_seye','pal_avenging','pal_divineshield','pal_crusade'],
    adv50:null, adv100:'守护骑士',
  },
  // ===================== 猎魔者 =====================
  hunter: {
    id:'hunter', name:'猎魔者', icon:'🏹', role:'远程物理', empire:'greenland',
    power:'agi', magic:false, resource:'集中',
    desc:'皮甲远程射手。射程远、移速快，多重射击爆发，陷阱控场，可破隐。强力单练职业。',
    lore:'精灵猎魔者擅远程射击，造成穿刺物理伤害，箭矢偶尔加持魔法。昂翼天使即为猎魔者。',
    base:{str:2,agi:6,int:2,sta:4,spi:1}, growth:{agi:2,sta:1,str:1},
    startCity:'tracker', specLevel:10,
    specs:[
      {id:'marksman',name:'射手',desc:'三连射、爆破箭，远程高爆。'},
      {id:'ranger',name:'游猎',desc:'陷阱控场、寒冰减速、宠物相伴。'},
    ],
    skills:['h_shot','h_shockshot','h_frostshot','h_trap','h_pierce','h_multishot','h_explosive','h_eyes','h_rapid','h_volley','h_aspect','h_killshot'],
    adv50:null, adv100:'神射手',
  },
};

// ===================== 技能库 =====================
DATA.skills = {
  // ---- 盗贼 ----
  r_stealth:{name:'潜行',icon:'🌑',type:'active',reqLevel:1,mpCost:10,cooldown:4,desc:'隐入阴影，下一击必定暴击。',effect:{kind:'buff',buff:{stat:'crit',amt:100,turns:2}}},
  r_sinister:{name:'要害攻击',icon:'🗡️',type:'active',reqLevel:1,mpCost:8,cooldown:0,desc:'快速突刺，造成攻击130%伤害。',effect:{kind:'damage',mult:1.3}},
  r_gouge:{name:'闷击',icon:'😵',type:'active',reqLevel:3,mpCost:12,cooldown:3,desc:'击晕目标1回合并造成伤害。',effect:{kind:'stun',mult:0.7,stunTurns:1}},
  r_ambush:{name:'刺杀',icon:'🔪',type:'active',reqLevel:5,mpCost:18,cooldown:2,desc:'致命一击，攻击180%伤害，潜行下伤害更高。',effect:{kind:'damage',mult:1.8}},
  r_rupture:{name:'切割',icon:'🩸',type:'active',reqLevel:7,mpCost:15,cooldown:2,desc:'割裂伤口，造成伤害并使其持续流血3回合。',effect:{kind:'dot',mult:0.7,dotMult:0.45,dotTurns:3}},
  r_kick:{name:'脚踢',icon:'🦶',type:'active',reqLevel:10,mpCost:10,cooldown:3,desc:'打断并眩晕，造成伤害。',effect:{kind:'stun',mult:0.9,stunTurns:1}},
  r_poison:{name:'涂毒',icon:'🧪',type:'active',reqLevel:12,mpCost:14,cooldown:2,desc:'淬毒攻击，剧毒持续4回合。',effect:{kind:'dot',mult:0.6,dotMult:0.4,dotTurns:4}},
  r_backstab:{name:'背刺',icon:'🔻',type:'active',reqLevel:15,mpCost:20,cooldown:2,desc:'绕背重击，攻击220%伤害，无视部分护甲。',effect:{kind:'damage',mult:2.2,ignoreArmor:true}},
  r_sprint:{name:'疾风步',icon:'💨',type:'passive',reqLevel:20,desc:'被动：敏捷大增，闪避与暴击提升。',effect:{kind:'passive',stats:{dodge:6,crit:6}}},
  r_evasion:{name:'灵识闪避',icon:'🌀',type:'active',reqLevel:25,mpCost:16,cooldown:5,desc:'进入闪避姿态，大幅提升闪避3回合。',effect:{kind:'buff',buff:{stat:'dodge',amt:40,turns:3}}},
  r_shadowstep:{name:'阴影舞步',icon:'👤',type:'active',reqLevel:30,mpCost:22,cooldown:3,desc:'瞬影突袭，攻击200%伤害且必定暴击。',effect:{kind:'damage',mult:2.0,guaranteedCrit:true}},
  r_eviscerate:{name:'剔骨终结',icon:'☠️',type:'active',reqLevel:40,mpCost:30,cooldown:4,desc:'终结技，连续三击撕裂目标。',effect:{kind:'multi',hits:3,mult:1.0}},

  // ---- 战士 ----
  w_heroic:{name:'英勇打击',icon:'⚔️',type:'active',reqLevel:1,mpCost:8,cooldown:0,desc:'强力一击，攻击135%伤害。',effect:{kind:'damage',mult:1.35}},
  w_charge:{name:'冲锋',icon:'🐎',type:'active',reqLevel:3,mpCost:10,cooldown:3,desc:'冲向敌人造成伤害并使其眩晕1回合。',effect:{kind:'stun',mult:1.0,stunTurns:1}},
  w_taunt:{name:'嘲讽',icon:'😤',type:'active',reqLevel:5,mpCost:8,cooldown:3,desc:'激怒目标降低其攻击3回合。',effect:{kind:'debuff',mult:0.5,debuff:{stat:'atk',amt:30,turns:3}}},
  w_shieldbash:{name:'盾击',icon:'🛡️',type:'active',reqLevel:7,mpCost:12,cooldown:2,desc:'以盾猛击，造成伤害并附带护盾。',effect:{kind:'shield',mult:1.0,flat:20}},
  w_hamstring:{name:'断筋',icon:'🦵',type:'active',reqLevel:10,mpCost:10,cooldown:2,desc:'削弱目标，降低其攻击与造成伤害。',effect:{kind:'debuff',mult:0.9,debuff:{stat:'atk',amt:20,turns:3}}},
  w_flamestrike:{name:'烈焰斩',icon:'🔥',type:'active',reqLevel:15,mpCost:18,cooldown:2,desc:'剑化火焰，攻击190%伤害。',effect:{kind:'damage',mult:1.9}},
  w_whirlwind:{name:'旋风斩',icon:'🌪️',type:'active',reqLevel:20,mpCost:22,cooldown:3,desc:'旋身横扫，连续两击。',effect:{kind:'multi',hits:2,mult:1.1}},
  w_intimidate:{name:'震慑',icon:'💢',type:'active',reqLevel:25,mpCost:16,cooldown:4,desc:'震慑全场，眩晕目标2回合。',effect:{kind:'stun',mult:0.8,stunTurns:2}},
  w_rampage:{name:'狂暴',icon:'🩸',type:'active',reqLevel:30,mpCost:20,cooldown:5,desc:'进入狂暴，攻击力大增3回合。',effect:{kind:'buff',buff:{stat:'atk',amt:60,turns:3}}},
  w_stomp:{name:'战争践踏',icon:'👣',type:'active',reqLevel:40,mpCost:26,cooldown:4,desc:'重踏大地，重创并眩晕。',effect:{kind:'stun',mult:1.6,stunTurns:1}},
  w_block:{name:'格挡精通',icon:'🛡️',type:'passive',reqLevel:18,desc:'被动：护甲提升，受伤减少。',effect:{kind:'passive',stats:{armor:30}}},
  w_execute:{name:'斩杀',icon:'☠️',type:'active',reqLevel:35,mpCost:24,cooldown:3,desc:'对残血目标造成致命一击（260%）。',effect:{kind:'damage',mult:2.6}},

  // ---- 法师 ----
  m_firebolt:{name:'火球术',icon:'🔥',type:'active',reqLevel:1,mpCost:12,cooldown:0,desc:'投掷火球，造成法术140%伤害。',effect:{kind:'damage',mult:1.4}},
  m_frostbolt:{name:'冰箭',icon:'❄️',type:'active',reqLevel:3,mpCost:14,cooldown:1,desc:'寒冰箭矢，造成伤害并减速（降攻）。',effect:{kind:'debuff',mult:1.2,debuff:{stat:'atk',amt:15,turns:2}}},
  m_lightning:{name:'雷电术',icon:'⚡',type:'active',reqLevel:5,mpCost:16,cooldown:1,desc:'引落雷电，攻击160%伤害。',effect:{kind:'damage',mult:1.6}},
  m_frostnova:{name:'霜冻冰封',icon:'🧊',type:'active',reqLevel:7,mpCost:18,cooldown:3,desc:'冻结目标，眩晕1回合。',effect:{kind:'stun',mult:0.8,stunTurns:1}},
  m_arcanemissile:{name:'奥术飞弹',icon:'🌟',type:'active',reqLevel:10,mpCost:20,cooldown:2,desc:'连射奥术飞弹，三连击。',effect:{kind:'multi',hits:3,mult:0.7}},
  m_pyroblast:{name:'炎爆',icon:'☄️',type:'active',reqLevel:15,mpCost:26,cooldown:2,desc:'蓄力炎爆，攻击230%伤害。',effect:{kind:'damage',mult:2.3}},
  m_firering:{name:'暴烈火环',icon:'🔆',type:'active',reqLevel:20,mpCost:24,cooldown:3,desc:'引燃目标，火焰持续灼烧3回合。',effect:{kind:'dot',mult:1.0,dotMult:0.6,dotTurns:3}},
  m_polymorph:{name:'变羊术',icon:'🐑',type:'active',reqLevel:25,mpCost:20,cooldown:5,desc:'将目标变羊，使其昏迷2回合。',effect:{kind:'stun',mult:0.2,stunTurns:2}},
  m_meteor:{name:'天陨',icon:'🌠',type:'active',reqLevel:30,mpCost:34,cooldown:3,desc:'召唤陨石轰击，攻击260%伤害。',effect:{kind:'damage',mult:2.6}},
  m_arcanesurge:{name:'奥术气定',icon:'🔵',type:'active',reqLevel:40,mpCost:10,cooldown:6,desc:'魔法共鸣，暴击率与法力激增3回合。',effect:{kind:'buff',buff:{stat:'crit',amt:50,turns:3}}},
  m_manashield:{name:'魔法护盾',icon:'🛡️',type:'active',reqLevel:12,mpCost:18,cooldown:4,desc:'凝聚法力护盾吸收伤害。',effect:{kind:'shield',mult:1.4,flat:30}},
  m_inferno:{name:'炼狱之火',icon:'🌋',type:'active',reqLevel:35,mpCost:40,cooldown:5,desc:'炼狱烈焰焚尽一切，攻击320%伤害。',effect:{kind:'damage',mult:3.2}},

  // ---- 牧师 ----
  p_heal:{name:'治疗轻伤',icon:'💚',type:'active',reqLevel:1,mpCost:14,cooldown:0,desc:'治愈伤口，恢复生命。',effect:{kind:'heal',healMult:1.6,flat:20}},
  p_smite:{name:'惩击',icon:'🌟',type:'active',reqLevel:1,mpCost:12,cooldown:0,desc:'圣光惩击，造成法术130%伤害。',effect:{kind:'damage',mult:1.3}},
  p_weaken:{name:'虚弱诅咒',icon:'🕯️',type:'active',reqLevel:5,mpCost:16,cooldown:2,desc:'诅咒削弱目标攻击3回合。',effect:{kind:'debuff',mult:0.8,debuff:{stat:'atk',amt:30,turns:3}}},
  p_shadowbolt:{name:'暗影箭',icon:'🌑',type:'active',reqLevel:7,mpCost:18,cooldown:1,desc:'暗影侵蚀，造成伤害并持续3回合。',effect:{kind:'dot',mult:1.0,dotMult:0.5,dotTurns:3}},
  p_dispel:{name:'驱散',icon:'🌬️',type:'active',reqLevel:10,mpCost:14,cooldown:4,desc:'净化自身并恢复法力（解控）。',effect:{kind:'heal',healMult:0.6,flat:10}},
  p_greaterheal:{name:'治疗术',icon:'💖',type:'active',reqLevel:15,mpCost:24,cooldown:1,desc:'强力治疗，大幅恢复生命。',effect:{kind:'heal',healMult:2.6,flat:40}},
  p_fear:{name:'恐惧嚎叫',icon:'😱',type:'active',reqLevel:18,mpCost:20,cooldown:5,desc:'令目标恐惧，无法行动2回合。',effect:{kind:'stun',mult:0.3,stunTurns:2}},
  p_pain:{name:'痛',icon:'💀',type:'active',reqLevel:20,mpCost:22,cooldown:2,desc:'剧痛诅咒，强力持续伤害4回合。',effect:{kind:'dot',mult:0.8,dotMult:0.6,dotTurns:4}},
  p_shield:{name:'圣光护盾',icon:'🔰',type:'active',reqLevel:12,mpCost:18,cooldown:3,desc:'光盾护体，吸收伤害。',effect:{kind:'shield',mult:1.6,flat:40}},
  p_renew:{name:'恢复',icon:'🌿',type:'active',reqLevel:25,mpCost:20,cooldown:3,desc:'持续治疗自身，并即刻回血。',effect:{kind:'heal',healMult:2.0,flat:30}},
  p_groupheal:{name:'群体治疗',icon:'🕊️',type:'active',reqLevel:30,mpCost:30,cooldown:2,desc:'神圣之光大量回复生命。',effect:{kind:'heal',healMult:3.2,flat:60}},
  p_warbind:{name:'战争枷锁',icon:'⛓️',type:'active',reqLevel:40,mpCost:28,cooldown:5,desc:'黑暗枷锁束缚目标，重创并眩晕。',effect:{kind:'stun',mult:1.5,stunTurns:2}},

  // ---- 圣骑士 ----
  pal_holystrike:{name:'圣光斩',icon:'⚜️',type:'active',reqLevel:1,mpCost:10,cooldown:0,desc:'圣光附剑，攻击135%伤害。',effect:{kind:'damage',mult:1.35}},
  pal_aura:{name:'气势如虹',icon:'🌅',type:'active',reqLevel:3,mpCost:14,cooldown:4,desc:'光环加持，提升攻击3回合。',effect:{kind:'buff',buff:{stat:'atk',amt:35,turns:3}}},
  pal_shieldbash:{name:'盾击',icon:'🛡️',type:'active',reqLevel:5,mpCost:12,cooldown:2,desc:'盾牌猛击，伤害并附盾。',effect:{kind:'shield',mult:1.0,flat:25}},
  pal_consecrate:{name:'神圣打击',icon:'✨',type:'active',reqLevel:7,mpCost:16,cooldown:1,desc:'神圣之力轰击，攻击165%伤害。',effect:{kind:'damage',mult:1.65}},
  pal_holyshield:{name:'防护伤害',icon:'🔱',type:'active',reqLevel:10,mpCost:18,cooldown:3,desc:'神圣护盾，大量吸收伤害。',effect:{kind:'shield',mult:1.8,flat:40}},
  pal_silence:{name:'沉默禁言',icon:'🤐',type:'active',reqLevel:15,mpCost:18,cooldown:4,desc:'沉默目标，眩晕并降低其攻击。',effect:{kind:'stun',mult:0.8,stunTurns:1}},
  pal_holylight:{name:'圣光术',icon:'🌟',type:'active',reqLevel:12,mpCost:22,cooldown:1,desc:'圣光治愈，恢复生命。',effect:{kind:'heal',healMult:2.2,flat:35}},
  pal_judgement:{name:'圣光制裁',icon:'⚖️',type:'active',reqLevel:20,mpCost:24,cooldown:2,desc:'制裁之光，攻击210%伤害。',effect:{kind:'damage',mult:2.1}},
  pal_seye:{name:'神之眼',icon:'👁️',type:'passive',reqLevel:18,desc:'被动：洞察破隐，命中与暴击提升。',effect:{kind:'passive',stats:{crit:8}}},
  pal_avenging:{name:'圣裁',icon:'🗡️',type:'active',reqLevel:30,mpCost:28,cooldown:4,desc:'复仇之怒，攻击250%伤害并回血。',effect:{kind:'damage',mult:2.5,lifesteal:0.3}},
  pal_divineshield:{name:'圣盾术',icon:'🟡',type:'active',reqLevel:35,mpCost:30,cooldown:6,desc:'无敌圣盾，吸收巨量伤害。',effect:{kind:'shield',mult:2.6,flat:80}},
  pal_crusade:{name:'神圣降临',icon:'😇',type:'active',reqLevel:40,mpCost:34,cooldown:5,desc:'天降圣裁，重创目标（300%）。',effect:{kind:'damage',mult:3.0}},

  // ---- 猎魔者 ----
  h_shot:{name:'瞄准射击',icon:'🏹',type:'active',reqLevel:1,mpCost:8,cooldown:0,desc:'精准射击，攻击130%伤害。',effect:{kind:'damage',mult:1.3}},
  h_shockshot:{name:'震击箭',icon:'💥',type:'active',reqLevel:3,mpCost:12,cooldown:3,desc:'震荡箭矢，伤害并眩晕1回合。',effect:{kind:'stun',mult:0.8,stunTurns:1}},
  h_frostshot:{name:'寒冰之箭',icon:'❄️',type:'active',reqLevel:5,mpCost:12,cooldown:2,desc:'冰封箭矢，伤害并降低其攻击。',effect:{kind:'debuff',mult:1.2,debuff:{stat:'atk',amt:18,turns:2}}},
  h_trap:{name:'陷阱布设',icon:'🪤',type:'active',reqLevel:7,mpCost:14,cooldown:4,desc:'布置陷阱，束缚目标2回合。',effect:{kind:'stun',mult:0.5,stunTurns:2}},
  h_pierce:{name:'穿透箭',icon:'🎯',type:'active',reqLevel:10,mpCost:16,cooldown:1,desc:'破甲穿透，无视护甲180%伤害。',effect:{kind:'damage',mult:1.8,ignoreArmor:true}},
  h_multishot:{name:'三连射',icon:'🏹',type:'active',reqLevel:15,mpCost:20,cooldown:2,desc:'同时射出三道箭矢。',effect:{kind:'multi',hits:3,mult:0.85}},
  h_explosive:{name:'爆破箭',icon:'🧨',type:'active',reqLevel:20,mpCost:24,cooldown:2,desc:'加持爆破魔法阵，攻击230%伤害。',effect:{kind:'damage',mult:2.3}},
  h_eyes:{name:'精灵瞳视',icon:'👁️',type:'passive',reqLevel:18,desc:'被动：敏锐感知，暴击与闪避提升。',effect:{kind:'passive',stats:{crit:6,dodge:4}}},
  h_rapid:{name:'疾速射击',icon:'⚡',type:'active',reqLevel:25,mpCost:18,cooldown:5,desc:'进入急速，攻击力大增3回合。',effect:{kind:'buff',buff:{stat:'atk',amt:55,turns:3}}},
  h_volley:{name:'箭雨',icon:'🌧️',type:'active',reqLevel:30,mpCost:28,cooldown:3,desc:'倾泻箭雨，连续四击。',effect:{kind:'multi',hits:4,mult:0.8}},
  h_aspect:{name:'豹群守护',icon:'🐆',type:'passive',reqLevel:35,desc:'被动：移速与攻速提升，暴击伤害增加。',effect:{kind:'passive',stats:{crit:8}}},
  h_killshot:{name:'杀戮射击',icon:'☠️',type:'active',reqLevel:40,mpCost:30,cooldown:4,desc:'致命一箭，对目标造成300%伤害。',effect:{kind:'damage',mult:3.0}},
};
