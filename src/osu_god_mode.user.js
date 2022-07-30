// ==UserScript==
// @name           ゴッドモード
// @namespace       https://osu.ppy.sh/users/22136262
// @downloadURL     https://raw.githubusercontent.com/yuzupon1133/osu-tools/main/src/osu_god_mode.user.js
// @updateURL       https://raw.githubusercontent.com/yuzupon1133/osu-tools/main/src/osu_god_mode.user.js
// @version         0.0
// @description     世界ランキング1位になれます()
// @author          yuzupon1133
// @match           https://osu.ppy.sh/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=ppy.sh
// @grant           none
// ==/UserScript==

// このユーザースクリプトの説明
//
// GitHub
// https://github.com/yuzupon1133/osu-tools/blob/main/src/osu_god_mode.user.js

(() => {
  
  const create = (tagName, attribute, content) => {
    var ctemp = document.createElement(tagName);
    for(key in attribute) {
      ctemp.setAttribute(key, attribute[key]);
    }
    if(content) ctemp.append(content);
    return ctemp;
  }
  const mergedom = (dom, attribute) => {
    var mtemp = document.createElement("div");
    for(let i = 0; i < dom.length; i++) {
      mtemp.append(dom[i]);
    }
    if(attribute) {
      for(key in attribute) {
        mtemp.setAttribute(key, attribute[key]);
      }
    }
    return mtemp;
  }
  const strtodom = (str, attribute) => {
    var stemp = (new DOMParser()).parseFromString(str, "text/xml").firstChild;
    if(attribute) {
      for(key in attribute) {
        stemp.setAttribute(key, attribute[key]);
      }
    }
    return stemp;
  }
  const getById = (id) => {
    return document.getElementById(id);
  }
  const getByClassName = (cname) => {
    return document.getElementsByClassName(cname);
  }
  const getByTagName = (tname) => {
    return document.getElementsByTagName(tname);
  }
  const num_add_comma = (num) => {
    return Number(num).toLocaleString()
  }
  const sec_to_dhm = (time) => {
    return `${time/3600/24|0}d ${(time/3600|0)-(time/3600/24|0)*24}h ${time%3600/60|0}m`;
  }
  const round = (num) => {
    return Math.round(Number(num));
  }
  const ceil = (num) => {
    return Math.ceil(Number(num));
  }
  const floor = (num) => {
    return Math.floor(Number(num));
  }
  const random = (min, max) => {
    return floor(Math.random() * ( max - min ) + min);
  }
  
  var jtemp = getByClassName("value-display__value");
  jtemp[0].firstChild.innerHTML = "#1";
  jtemp[1].firstChild.innerHTML = "#1";
  jtemp[3].firstChild.innerHTML = num_add_comma(random(22500, 23000));
  var rand = random(5500000, 6500000);
  jtemp[4].firstChild.innerHTML = sec_to_dhm(rand);
  jtemp[4].setAttribute("data-orig-title", rand/3600 + "時間");
  
  jtemp = getByClassName("profile-rank-count")[0].children;
  jtemp[0].innerHTML = jtemp[0].innerHTML.replace(/(<div.+>).+/, "$1" + num_add_comma(random(200, 300)));
  jtemp[1].innerHTML = jtemp[1].innerHTML.replace(/(<div.+>).+/, "$1" + num_add_comma(random(50, 200)));
  jtemp[2].innerHTML = jtemp[2].innerHTML.replace(/(<div.+>).+/, "$1" + num_add_comma(random(800, 1200)));
  jtemp[3].innerHTML = jtemp[3].innerHTML.replace(/(<div.+>).+/, "$1" + num_add_comma(random(200, 400)));
  jtemp[4].innerHTML = jtemp[4].innerHTML.replace(/(<div.+>).+/, "$1" + num_add_comma(random(1000, 1500)));
  
  getByClassName("line-chart--profile-page")[0].children[0].children[0].innerHTML = '<path class="line-chart__line" d="M0,30L620.5125122070312,30"></path>';
  getByClassName("line-chart__hover-area")[0].addEventListener("mousemove", () => {
    var ltemp = getByClassName("line-chart__hover-circle")[0];
    ltemp.style.transform = ltemp.style.transform.replace(/(.+, )\d+(px\))/, "$130$2");
    getByClassName("line-chart__hover-info-box-text--y")[0].childNodes[1].textContent = " #1";
  })
  
  jtemp = getByClassName("profile-stats__value");
  jtemp[0].innerHTML = num_add_comma(random(50000000000, 70000000000));
  rand = random(9750, 9850);
  if(rand == 9800) rand + 1;
  jtemp[1].innerHTML = rand / 100 + "%";
  jtemp[2].innerHTML = num_add_comma(random(130000, 160000));
  var level = random(102, 104);
  var min_score = 26931190827 + 99999999999 * (level - 100);
  var rand2 = random(10, 95);
  var min_prog_score = min_score + floor(999999999999 * (rand2 / 100));
  var max_prog_score = min_score + floor(999999999999 * ((rand2 + 1) / 100)) - 1;
  jtemp[3].innerHTML = num_add_comma(random(min_prog_score, max_prog_score));
  jtemp[4].innerHTML = num_add_comma(random(30000000, 50000000));
  jtemp[5].innerHTML = num_add_comma(random(5000, 8000));
  jtemp[6].innerHTML = num_add_comma(random(900000, 1300000));
  
  jtemp = getByClassName("user-action-button__counter");
  jtemp[0].innerHTML = num_add_comma(random(50000, 70000));
  jtemp[1].innerHTML = num_add_comma(random(3000, 5000));
  
  rand = random(5, 95);
  getByClassName("bar__fill")[0].setAttribute("style", "width: " + rand2 + "%");
  getByClassName("bar__text")[0].innerHTML = rand2 + "%";
  rand = random()
  getByClassName("user-level")[0].setAttribute("data-orig-title", "レベル " + level);
  getByClassName("user-level")[0].innerHTML = level;
  
})();
