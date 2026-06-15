/* cities.js —— 主城 / 城镇枢纽
 * {id,name,empire,icon,desc,recommendLevel,services{shop,bank,auction,trainer,graveyard,forge},
 *  shop:[itemId], npcs:[{id,name,role,icon,dialog}], zones:[id], dungeons:[id], quests:[id],
 *  connections:[{to,cost(铜币)}], unlockLevel? }
 */
window.DATA = window.DATA || {};

DATA.cities = {
  tracker:{ id:'tracker', name:'特拉克小镇', empire:'greenland', icon:'🏘️', recommendLevel:[1,9],
    desc:'卡罗尔大草原中的练级小镇，泥土房屋，往来历练的冒险者众多。新手的起点。',
    services:{shop:true,bank:true,auction:true,trainer:true,graveyard:true,forge:true},
    shop:['potion_hp_s','potion_mp_s','bandage','scroll_tp','lockpick','iron_ore','herb'],
    npcs:[
      {id:'ende',name:'农民恩德',role:'任务NPC',icon:'👨‍🌾',dialog:'巨鼠快把我的田啃光了，帮帮我吧！'},
      {id:'klaus',name:'猎人克劳斯',role:'任务NPC',icon:'🏹',dialog:'收集巨鼠头骨，我有报酬。'},
      {id:'ole',name:'药剂师奥尔',role:'隐藏NPC',icon:'⚗️',dialog:'……巨鼠尾巴？也许我能用上。（隐藏任务）'},
      {id:'trainer_tk',name:'各职业训练师',role:'训练师',icon:'🎓',dialog:'升级后回来，我教你新本事。'},
    ],
    zones:['z_ratfield','z_grassland','z_batcave','z_sunken'], dungeons:['d_tomb'],
    quests:['q_rats','q_skulls','q_ratfield_hidden','q_main_tracker'],
    connections:[{to:'hilton',cost:120},{to:'caroll',cost:200}] },

  hilton:{ id:'hilton', name:'希尔顿要塞', empire:'greenland', icon:'🏰', recommendLevel:[8,15],
    desc:'格林兰边境要塞，每年秋季迎来地底魔物围城，守卫勇士战斗激烈。',
    services:{shop:true,bank:true,auction:true,trainer:true,graveyard:true,forge:true},
    shop:['potion_hp_m','potion_mp_m','bandage','scroll_tp','scroll_random_tp','potion_hp_l'],
    npcs:[
      {id:'blevins',name:'医师布莱文斯',role:'隐藏任务',icon:'🎣',dialog:'在然多湖心垂钓……年轻人，岸边钓鱼好还是水上钓鱼好？'},
      {id:'cadi',name:'铁匠卡迪',role:'赚钱任务',icon:'🔨',dialog:'蝙蝠牙齿？前线急需，每组两铜币，多多益善！'},
      {id:'kavarot',name:'督军卡瓦罗特',role:'剧情NPC',icon:'🪖',dialog:'卓尔部落随时可能反击，我们必须做好准备。'},
    ],
    zones:['z_lake','z_treantwood'], dungeons:['d_treant'],
    quests:['q_bat_teeth','q_silk','q_treant_main','q_order_courage'],
    connections:[{to:'tracker',cost:120},{to:'caroll',cost:200},{to:'sogot',cost:300},{to:'eternal',cost:300}] },

  caroll:{ id:'caroll', name:'卡罗尔城', empire:'greenland', icon:'🏙️', recommendLevel:[1,200],
    desc:'格林兰帝国都城，悬于草原上空的「天空之城」。白色方尖塔、乔比亚大帝石雕、最大的拍卖行、盗贼公会主塔、光明圣殿、长老会与遍布的传送阵。',
    services:{shop:true,bank:true,auction:true,trainer:true,graveyard:true,forge:true,temple:true,thievesguild:true,council:true,library:true},
    shop:['potion_hp_l','potion_mp_m','scroll_tp','scroll_random_tp','gem_str','gem_agi','gem_int','gem_sta','lucky_gem'],
    npcs:[
      {id:'kerfeld',name:'伯爵克尔菲德',role:'主线NPC',icon:'🎩',dialog:'古堡花园闹骷髅……还有，我夜夜梦见一位叫艾娜的公主。'},
      {id:'thieves_elder',name:'盗贼公会·费伦长老',role:'转职/隐藏',icon:'🗝️',dialog:'想成为真正的盗贼？先爬上这座主塔顶端再说。'},
      {id:'anyson',name:'光明圣殿·安尼森祭司',role:'圣职转职',icon:'⛪',dialog:'净化你手中的邪恶，光明会指引你前路。'},
      {id:'jobia',name:'乔比亚大帝',role:'帝国长老会',icon:'🗿',dialog:'秩序之章散落世间，集齐者将成为教皇。你，可愿一试？'},
    ],
    zones:[], dungeons:[],
    quests:['q_castle_skeleton','q_thieves_stairs','q_main_order'],
    connections:[{to:'tracker',cost:200},{to:'hilton',cost:200},{to:'eternal',cost:400},{to:'sogot',cost:500},{to:'element',cost:600},{to:'saturn',cost:5000},{to:'underdark',cost:2000}] },

  eternal:{ id:'eternal', name:'永恒之城', empire:'greenland', icon:'🏚️', recommendLevel:[20,28],
    desc:'地精建造的远古废墟之城，机械魔偶成群游荡，出产「永恒套装」。近索尼娅月光林地。',
    services:{shop:true,bank:true,auction:true,trainer:true,graveyard:true,forge:true},
    shop:['potion_hp_l','potion_mp_m','scroll_tp','scroll_random_tp','gem_sta'],
    npcs:[
      {id:'corinson',name:'驯兽师科林森',role:'坐骑/宠物',icon:'🐲',dialog:'透明的龙蛋需要力量才能破壳……收集水晶来找我。'},
    ],
    zones:['z_eternal','z_moonlight'], dungeons:['d_soth','d_eternal'],
    quests:['q_order_kindness'],
    connections:[{to:'hilton',cost:300},{to:'caroll',cost:400},{to:'sogot',cost:300},{to:'element',cost:400}] },

  sogot:{ id:'sogot', name:'特索依瘟疫镇', empire:'greenland', icon:'☣️', recommendLevel:[30,40],
    desc:'古怪的瘟疫小镇，树干凿成房屋，NPC皆三十级以上精英。镇外是纳特兰沼泽与黑暗年代古城索哥特。',
    services:{shop:true,bank:true,auction:true,trainer:true,graveyard:true,forge:true},
    shop:['potion_hp_l','potion_mp_m','scroll_random_tp','lucky_gem'],
    npcs:[
      {id:'davina',name:'卷轴大师戴维娜',role:'卷轴商人',icon:'📜',dialog:'瘟疫之地，活着出去比赚钱重要。'},
    ],
    zones:['z_swamp','z_plague'], dungeons:['d_sogot'],
    quests:['q_order_freedom','q_abak_clue'],
    connections:[{to:'hilton',cost:300},{to:'eternal',cost:300},{to:'caroll',cost:500},{to:'element',cost:400}] },

  element:{ id:'element', name:'元素之城卡沃迪恩', empire:'greenland', icon:'🔮', recommendLevel:[45,70],
    desc:'半山腰的法系之城，天空环绕七彩魔力光环，公会林立。通往罪域峡谷与地底矿洞。',
    services:{shop:true,bank:true,auction:true,trainer:true,graveyard:true,forge:true},
    shop:['potion_hp_l','potion_mp_m','scroll_random_tp','gem_crit','lucky_gem'],
    npcs:[
      {id:'alicia',name:'艾丽西亚女伯爵',role:'传奇任务',icon:'🔥',dialog:'解开格瑞玛的封印，元素之力将归于你。'},
      {id:'featherstone',name:'大盗贼费瑟斯顿',role:'盗贼转职',icon:'🥷',dialog:'尼兰斗兽场出事了，敢去救人质吗？'},
    ],
    zones:['z_sin'], dungeons:['d_crystal','d_goldmine','d_arena'],
    quests:['q_main_zennard'],
    connections:[{to:'caroll',cost:600},{to:'sogot',cost:400},{to:'eternal',cost:400}] },

  // ---- 后期帝国（钩子，达到等级解锁旅行） ----
  saturn:{ id:'saturn', name:'萨特恩·兽人王城', empire:'saturn', icon:'🪓', recommendLevel:[60,120], unlockLevel:60,
    desc:'兽人帝国主城，光明阵营盟友，第一公会天使霸业雄踞于此。需骑乘狮鹫往来，传送费极高。',
    services:{shop:true,bank:true,auction:true,trainer:true,graveyard:true,forge:true},
    shop:['potion_hp_l','potion_mp_m','scroll_random_tp'], npcs:[{id:'blaze',name:'布莱兹酋长',role:'剧情',icon:'🐗',dialog:'人类朋友，刺客之心的线索在黑精灵部落的祭坛。'}],
    zones:[], dungeons:[], quests:[], connections:[{to:'caroll',cost:5000}] },

  underdark:{ id:'underdark', name:'地底世界', empire:'undead', icon:'🕳️', recommendLevel:[50,120], unlockLevel:50,
    desc:'通过末日峡谷地底通道进入的黑暗阵营领地，亡灵帝国与魔裔部落盘踞。善良阵营在此全属性大幅下降。',
    services:{shop:true,bank:true,graveyard:true},
    shop:['potion_hp_l'], npcs:[{id:'duoduo',name:'天使坠落·多多',role:'黑市交易',icon:'💀',dialog:'地表的好货，我出高价。地底的装备，你也能倒卖回去。'}],
    zones:[], dungeons:[], quests:[], connections:[{to:'caroll',cost:2000}] },
};
