// ==UserScript==
// @name            自動osu!direct
// @namespace       https://osu.ppy.sh/users/22136262
// @downloadURL     https://raw.githubusercontent.com/yuzupon1133/osu-tools/main/src/osu_auto_osu_direct.user.js
// @updateURL       https://raw.githubusercontent.com/yuzupon1133/osu-tools/main/src/osu_auto_osu_direct.user.js
// @version         0.0
// @description     外部から直接ビートマップページを開いたときに自動的にosu!directで開きます
// @author          yuzupon1133
// @match           https://osu.ppy.sh/beatmapsets/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=ppy.sh
// @grant           none
// ==/UserScript==

// このユーザースクリプトの説明
// 
// GitHub
// https://github.com/yuzupon1133/osu-tools/blob/main/src/osu_auto_osu_direct.user.js

(() => {
  
  // const referrer = /^https?:\/\/.+/;
  const referrer = /^https:\/\/www\.google\.com/;
  
  if(document.referrer.match(referrer)) {
    location.href = "osu://s/" + location.href.replace(/https:\/\/osu\.ppy\.sh\/beatmapsets\/(\d+?)#.*/, "$1");
  }
  
})();
