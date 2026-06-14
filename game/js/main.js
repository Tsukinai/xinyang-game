/* main.js —— 启动 */
(function(){
  function boot(){
    if (Save.hasSave() && Save.load()) {
      UI.go('town');
    } else {
      UI.state.screen='charcreate';
      UI.render();
    }
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
