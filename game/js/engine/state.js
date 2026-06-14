/* state.js —— 玩家状态、存档、读档
 * 全局：window.G (运行时游戏状态), window.Save
 * 数据契约见 js/data/*.js 顶部注释。
 */
(function () {
  const SAVE_KEY = 'xinyang_save_v1';

  // 运行时玩家对象的工厂
  function newPlayer(name, classId) {
    const cls = DATA.classes[classId];
    const p = {
      name: name,
      classId: classId,
      spec: null,               // 流派（专长），到达分流等级后选择
      advClass: null,           // 转职后的职业 id（大盗贼/影舞…）
      empire: cls.empire || 'greenland',
      level: 1,
      xp: 0,
      statPoints: 0,            // 可分配属性点
      talentPoints: 0,          // 专长点（30级前每5级+1）
      skillPoints: 0,           // 技能点
      // 基础属性（角色面板，来自职业基础 + 升级成长 + 手动加点）
      base: Object.assign({}, cls.base),
      alloc: { str: 0, agi: 0, int: 0, sta: 0, spi: 0 }, // 手动加点累计
      gold: 50,                 // 铜币(游戏内)
      credit: 1300,             // 信用点(原著的游戏货币/点卡余额)
      cityId: cls.startCity,
      hpCur: 1, mpCur: 1,       // init 后由 Systems.fullHeal 填满
      equip: {},                // slot -> itemInstance
      bag: [],                  // [{id, qty}]  装备实例用 {id, _u:true, ...stats?} 直接入包
      skills: [],               // 已学技能 id（按等级解锁后自动学）
      learned: {},              // skillId -> true
      skillProf: {},            // 技能熟练度 skillId -> {lv,exp}（用技能练级）
      lockpick: { learned: classId==='rogue', lv:1, exp:0 }, // 开锁生活技能（盗贼天生会）
      bookSkills: [],            // 通过技能书习得的额外技能 id
      quests: {},               // questId -> {status:'active'|'done', prog:n}
      questsDone: {},           // questId -> true
      flags: {},                // 任意剧情/隐藏开关
      reputation: {},           // factionId -> value
      visited: { cities: {}, zones: {}, dungeons: {} },
      dungeonClears: {},        // dungeonId -> count
      kills: {},                // monsterId -> count（统计/任务）
      pk: { red: 0, kills: 0 }, // 红名值 / 击杀玩家数
      profession: null,         // 生活技能（铁匠/药剂/采集…）
      profLevel: 0, profExp: 0,
      titles: [], title: null,  // 称号
      noble: '平民',            // 爵位
      mounts: [], mount: null,  // 坐骑
      pets: [], pet: null,      // 宠物
      guild: null, contribution: 0, // 公会
      orderChapters: {},        // 秩序之章收集 {正义:true,...}
      fortresses: {},           // 占领要塞
      tutorialDone: false,
      stats: { monstersKilled: 0, deaths: 0, questsDone: 0, bossKills: 0, dungeonClears: 0, chestsOpened: 0, playTimeTick: 0 },
      createdTick: 0,
      tip: 0,
    };
    return p;
  }

  function init(name, classId) {
    G = newPlayer(name, classId);
    Systems.recompute();
    Systems.fullHeal();
    Quests.autoOffer();      // 解锁起始城市可接任务
    Skills.syncLearned();    // 学会等级允许的技能
    save();
    return G;
  }

  // ---------- 存档 ----------
  function save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(G));
      return true;
    } catch (e) { return false; }
  }
  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const obj = JSON.parse(raw);
      if (!obj || !obj.classId || !DATA.classes[obj.classId]) return null;
      G = obj;
      // 兼容性补齐
      G.alloc = G.alloc || { str:0,agi:0,int:0,sta:0,spi:0 };
      G.visited = G.visited || { cities:{}, zones:{}, dungeons:{} };
      G.reputation = G.reputation || {};
      Systems.recompute();
      return G;
    } catch (e) { return null; }
  }
  function hasSave() {
    try { return !!localStorage.getItem(SAVE_KEY); } catch (e) { return false; }
  }
  function wipe() { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} G = null; }

  // 导出/导入存档码（应对 file:// 下 localStorage 不可靠）
  function exportCode() {
    try { return btoa(unescape(encodeURIComponent(JSON.stringify(G)))); }
    catch (e) { return ''; }
  }
  function importCode(code) {
    try {
      const obj = JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
      if (!obj || !DATA.classes[obj.classId]) return false;
      G = obj; Systems.recompute(); save(); return true;
    } catch (e) { return false; }
  }

  window.G = null;
  window.Save = { init, save, load, hasSave, wipe, exportCode, importCode, newPlayer };
})();
