/* content_extra.js —— 取材原著的额外城市/区域/副本/支线/坐骑宠物任务/典籍
 * 复用全局 M()。在 balance.js 之前加载（让新怪物也被规整）。
 */
window.DATA = window.DATA || {};

// ===== 新怪物 =====
Object.assign(DATA.monsters, {
  headless:  M({id:'headless',name:'无头骑士',level:30,hp:1,atk:1,type:'elite',skills:['e_cleave'],icon:'🐴',drops:[{item:'song_frag',chance:0.5}],desc:'黑暗年代骑士多罗的诅咒化身，骑马挥剑无头颅。'}),
  bull_brute:M({id:'bull_brute',name:'蛮牛战士',level:55,hp:1,atk:1,type:'elite',skills:['e_roar','e_heavy'],icon:'🐃',drops:[{item:'song_frag',chance:0.4}],desc:'蛮牛草原的狂暴蛮牛战士，体型暴增如岩石。'}),
  medusa:    M({id:'medusa',name:'美杜莎',level:65,hp:1,atk:1,type:'boss',skills:['e_curse','e_stun'],icon:'🐍',drops:[{item:'lucky_gem',chance:1},{item:'gem_agi',chance:0.6}],desc:'美杜莎巢穴之主，号称最赚钱副本的BOSS，石化凝视。'}),
  blackdog:  M({id:'blackdog',name:'黑焰恶犬',level:70,hp:1,atk:1,type:'elite',skills:['e_heavy'],icon:'🐕',drops:[{item:'lucky_gem',chance:0.4}],desc:'喷吐灵魂之火的黑焰恶犬。'}),
  brosth:    M({id:'brosth',name:'堕落天使布罗斯特',level:180,hp:1,atk:1,type:'boss',skills:['e_roar','e_curse','e_heavy'],icon:'👼',drops:[{item:'lucky_gem',chance:1}],desc:'守护天使卡伦娜的委托目标，一百八十级黄金怪BOSS，旁有雷龙。'}),
});

// ===== 材料 =====
DATA.items.song_frag = {name:'歌谱碎片',type:'材料',quality:'bronze',value:10,stackable:true,icon:'🎼',desc:'吟游诗人布莱迈尔收集的歌谱碎片，每六张可触发命轮抽奖。'};
DATA.items.life_crystal = {name:'生命水晶',type:'材料',quality:'gold',value:200,stackable:true,icon:'💧',desc:'孵化龙蛋所需的稀有水晶。'};
// 生命水晶掉落（让孵化龙蛋任务可完成）
DATA.monsters.moonbear.drops.push({item:'life_crystal',chance:0.25});
DATA.monsters.golem.drops.push({item:'life_crystal',chance:0.2});
DATA.monsters.headless.drops.push({item:'life_crystal',chance:0.3});

// ===== 新区域 =====
Object.assign(DATA.zones, {
  z_blackflame:{ id:'z_blackflame', name:'黑焰森林', cityId:'emerald', levelRange:[25,32], icon:'🔥',
    desc:'黑焰凤凰索璐斯坠落之地，残留巨大凤凰骨架，无头骑士游荡。', encounters:[{m:'headless',w:3},{m:'moonbear',w:3},{m:'golem',w:2}], rare:[{m:'werewolf',chance:0.03}] },
  z_bullplain:{ id:'z_bullplain', name:'蛮牛草原', cityId:'crypus', levelRange:[50,60], icon:'🐃',
    desc:'克里普斯要塞外的专家级练级地，蛮牛战士横行。', encounters:[{m:'bull_brute',w:5},{m:'blackdog',w:2}], rare:[{m:'medusa',chance:0.02}] },
});

// ===== 新副本 =====
Object.assign(DATA.dungeons, {
  d_blackflame:{ id:'d_blackflame', name:'黑焰森林副本', cityId:'emerald', levelRange:[25,32], icon:'🔥',
    desc:'黑焰之森的精英团本，比树妖林更高阶。', waves:['headless','moonbear','headless'], boss:'werewolf',
    firstClear:{xp:9000,gold:400,items:[{id:'lucky_gem',qty:3}]} },
  d_medusa:{ id:'d_medusa', name:'美杜莎巢穴', cityId:'crypus', levelRange:[62,68], icon:'🐍',
    desc:'号称最赚钱的高级副本，美杜莎的石化巢穴。', waves:['blackdog','bull_brute','blackdog'], boss:'medusa',
    firstClear:{xp:120000,gold:4000,items:[{id:'lucky_gem',qty:5},{id:'gem_agi',qty:1}]} },
  d_brosth:{ id:'d_brosth', name:'堕落天使布罗斯特神殿', cityId:'crypus', levelRange:[175,185], icon:'⛪',
    desc:'卡伦娜的委托：击杀堕落天使布罗斯特，让守护天使进化为六翼天使。', waves:['blackdog','sandgiant','corpse'], boss:'brosth',
    firstClear:{xp:4000000,gold:120000,items:[{id:'lucky_gem',qty:15}]} },
});

// ===== 新城市 =====
Object.assign(DATA.cities, {
  nisode:{ id:'nisode', name:'尼索德城', empire:'greenland', icon:'🏙️', recommendLevel:[18,30],
    desc:'格林兰第二大城市，商业繁荣的贸易枢纽。',
    services:{shop:true,bank:true,auction:true,trainer:true,graveyard:true,forge:true},
    shop:['potion_hp_m','potion_mp_m','scroll_tp','scroll_random_tp','iron_ore','herb','lucky_gem'],
    npcs:[{id:'merchant_n',name:'拓跋商行掌柜',role:'商人',icon:'💰',dialog:'尼索德城什么都买得到，就看你的钱袋。'}],
    zones:[], dungeons:[], quests:['q_dragon_egg'],
    connections:[{to:'caroll',cost:250},{to:'emerald',cost:200},{to:'tracker',cost:200}] },
  emerald:{ id:'emerald', name:'翡翠之城希尔迪洛克', empire:'greenland', icon:'🌳', recommendLevel:[25,35],
    desc:'格林兰第六大城市，林中之城，巨木遮蔽、翡翠石街道、水晶大殿执政厅。地皮升值潜力最大。',
    services:{shop:true,bank:true,auction:true,trainer:true,graveyard:true,forge:true},
    shop:['potion_hp_l','potion_mp_m','scroll_random_tp','gem_str','gem_agi'],
    npcs:[{id:'bard',name:'吟游诗人布莱迈尔',role:'支线任务',icon:'🎻',dialog:'多伦山脉的宝箱里藏着我失散的歌谱碎片……每凑六张，命运之轮便会转动。'},
      {id:'westcott',name:'老铁匠韦斯科特',role:'剧情',icon:'🔨',dialog:'阿巴克套装？那是共治年代独裁者的遗物，早已散落人间。'}],
    zones:['z_blackflame'], dungeons:['d_blackflame'], quests:['q_song','q_headless'],
    connections:[{to:'hilton',cost:200},{to:'eternal',cost:200},{to:'caroll',cost:300},{to:'nisode',cost:200}] },
  crypus:{ id:'crypus', name:'克里普斯要塞', empire:'greenland', icon:'🏯', recommendLevel:[50,75],
    desc:'牛人部落总部所在的要塞，商业飞速发展，建有通往各大要塞的传送阵。',
    services:{shop:true,bank:true,auction:true,trainer:true,graveyard:true,forge:true},
    shop:['potion_hp_l','potion_mp_m','scroll_random_tp','gem_crit','lucky_gem'],
    npcs:[{id:'colinson2',name:'驯兽师霍尔',role:'坐骑/宠物',icon:'🐲',dialog:'驯化龙崖的紫瞳地龙需要六个月……还有那烈焰火凤的蛋。'}],
    zones:['z_bullplain'], dungeons:['d_medusa','d_brosth'], quests:['q_tenpaladin','q_phoenix','q_dragon_mount','q_arcane_pet','q_karenna'],
    connections:[{to:'caroll',cost:500},{to:'element',cost:300}] },
});
// 接通主城到新城市
DATA.cities.caroll.connections.push({to:'nisode',cost:250},{to:'emerald',cost:300},{to:'crypus',cost:500});
DATA.cities.hilton.connections.push({to:'emerald',cost:200});
DATA.cities.eternal.connections.push({to:'emerald',cost:200});
DATA.cities.element.connections.push({to:'crypus',cost:300});

// ===== 新任务（支线/隐藏/坐骑宠物）=====
Object.assign(DATA.quests, {
  q_song:{ id:'q_song', name:'布莱迈尔的歌谱碎片', type:'side', cityId:'emerald', giver:'吟游诗人布莱迈尔', reqLevel:25,
    desc:'吟游诗人布莱迈尔遗失了歌谱碎片，收集六张交给他，命运之轮将为你转动。',
    objective:{kind:'collect',target:'song_frag',count:6,label:'歌谱碎片'},
    rewards:{xp:12000,gold:600,items:[{id:'lucky_gem',qty:2}]} },
  q_headless:{ id:'q_headless', name:'【隐藏】多罗·无头骑士', type:'hidden', cityId:'emerald', giver:'探索触发', reqLevel:28,
    desc:'拥有龙族血统而被处以绞刑的骑士多罗，化为无头骑士的诅咒。猎杀黑焰森林的无头骑士，平息这段亡灵传说。',
    objective:{kind:'kill',target:'headless',count:20,label:'猎杀无头骑士'},
    rewards:{xp:20000,gold:800,title:'亡灵猎杀者',rep:{caroll:5}} },
  q_tenpaladin:{ id:'q_tenpaladin', name:'【传奇】十光明圣骑士传说', type:'hidden', cityId:'crypus', giver:'探索触发', reqLevel:65,
    desc:'黑暗年代十位光明圣骑士反抗龙族、建立光明修道院，终因龙族姑娘贝妮塔分裂。集齐十枚圣骑士勋章可与大天使泰洛德对话——线索藏于美杜莎巢穴深处。',
    objective:{kind:'clear',target:'d_medusa',label:'通关美杜莎巢穴'},
    rewards:{xp:150000,gold:5000,title:'圣骑士勋章',items:[{id:'lucky_gem',qty:5}]} },
  q_dragon_egg:{ id:'q_dragon_egg', name:'孵化暗翼之龙', type:'side', cityId:'nisode', giver:'拓跋商行掌柜', reqLevel:30,
    desc:'透明的龙蛋需要力量才能破壳。收集生命水晶（高级怪掉落），让暗翼之龙诞生为你的伙伴。',
    objective:{kind:'collect',target:'life_crystal',count:3,label:'生命水晶'},
    rewards:{xp:30000,gold:1000,grantAlly:'goldworm_pet'} },
  q_arcane_pet:{ id:'q_arcane_pet', name:'【转职奖励】奥术精灵', type:'side', cityId:'crypus', giver:'驯兽师霍尔', reqLevel:55,
    desc:'法师在转职任务中可获得奥术精灵——忽视等级效果的强力召唤宠物。证明你的实力，霍尔将助你孵化。',
    objective:{kind:'clear',target:'d_medusa',label:'证明实力·通关美杜莎巢穴'},
    rewards:{xp:120000,gold:4000,grantAlly:'arcane'} },
  q_phoenix:{ id:'q_phoenix', name:'【坐骑】复活烈焰火凤', type:'side', cityId:'crypus', giver:'驯兽师霍尔', reqLevel:70,
    desc:'从火焰之石的亚传奇宝箱中获得烈焰火凤的蛋，孵化它，得到飞行坐骑与火抗加持。',
    objective:{kind:'kill',target:'medusa',count:1,label:'击败美杜莎取火焰之石'},
    rewards:{xp:100000,gold:5000,grantMount:'phoenix',title:'驭火者'} },
  q_dragon_mount:{ id:'q_dragon_mount', name:'【坐骑·机密】捕捉紫瞳地龙', type:'side', cityId:'crypus', giver:'驯兽师霍尔', reqLevel:150,
    desc:'用致昏迷药剂麻翻命运河谷的两百级紫瞳地龙，奥术巨人搬运、合金牢笼囚禁、霍尔驯化六个月——最终成为你的顶级飞行坐骑。绝密，泄露杀无赦。',
    objective:{kind:'clear',target:'d_dragon',label:'征服紫瞳地龙巢穴'},
    rewards:{xp:8000000,gold:300000,grantMount:'dragon',title:'驭龙者'} },
  q_karenna:{ id:'q_karenna', name:'【随从】守护天使卡伦娜', type:'side', cityId:'crypus', giver:'驯兽师霍尔', reqLevel:175,
    desc:'进入布罗斯特神殿击杀堕落天使布罗斯特，守护天使卡伦娜将进化为六翼天使，成为你强力的治疗随从。注意：卡伦娜受黑暗吞噬诅咒，须速战速决。',
    objective:{kind:'clear',target:'d_brosth',label:'击杀堕落天使布罗斯特'},
    rewards:{xp:4500000,gold:150000,grantAlly:'karenna',title:'天使之主'} },
});

// ===== 典籍补充 =====
DATA.codex.push(
  { t:'黑焰凤凰索璐斯', d:'黑暗年代，黑焰凤凰索璐斯从黑焰森林坠落，化作永不熄灭的黑焰之火，森林中残留着巨大的凤凰骨架。' },
  { t:'无头骑士多罗', d:'格林兰传奇骑士多罗因放过黑精灵少女、被查出龙族血统而遭绞刑，头颅悬于城门，躯体复活与战马离去，成为无头骑士的传说。' },
  { t:'蜘蛛女皇菲娜斯', d:'地底崇拜蜘蛛的蛛人族女皇，约千年前离开水晶洞穴去往遥远地底，地穴领主贝内特为她守护着通灵之物。' },
);
