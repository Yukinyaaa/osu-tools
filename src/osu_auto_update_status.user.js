// ==UserScript==
// @name            プロフィール自動更新
// @namespace       https://osu.ppy.sh/users/22136262
// @downloadURL     https://raw.githubusercontent.com/yuzupon1133/osu-userscript-tools/main/src/osu_auto_update_status.user.js
// @updateURL       https://raw.githubusercontent.com/yuzupon1133/osu-userscript-tools/main/src/osu_auto_update_status.user.js
// @version         0.0
// @description     15秒ごとに自動でプロフィールが更新されます
// @author          yuzupon1133
// @match           https://osu.ppy.sh/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=ppy.sh
// @grant           none
// ==/UserScript==

// このユーザースクリプトの説明
// 
// GitHub
// https://github.com/yuzupon1133/osu-userscript-tools/blob/main/src/osu_auto_update_status.user.js

(() => {

const create = (tagName, attribute, innerHTML) => {
  var ctemp = document.createElement(tagName);
  for(key in attribute) {
    ctemp.setAttribute(key, attribute[key]);
  }
  if(innerHTML) ctemp.append(innerHTML);
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

document.getElementsByClassName("page-mode--profile-page-extra")[0].append(
  mergedom(
    [
      strtodom(
        "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><path d=\"M232 120C232 106.7 242.7 96 256 96C269.3 96 280 106.7 280 120V243.2L365.3 300C376.3 307.4 379.3 322.3 371.1 333.3C364.6 344.3 349.7 347.3 338.7 339.1L242.7 275.1C236 271.5 232 264 232 255.1L232 120zM256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0zM48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48C141.1 48 48 141.1 48 256z\"/></svg>", {
        style: "height: 14px; fill: #ccc; margin-right: 5px;"
      }),
      create("span", {
        id: "user-status-update-time"
      }, "15秒後に更新")
    ],
    {
      style: "margin-left: auto; display: flex; align-items: center;"
    }
  )
)



var before = JSON.parse(document.querySelector("div[data-initial-data]").getAttribute("data-initial-data"));
fetch(location.href)
.then(res => res.text())
.then(res => {
  var temp = res.replace(/\n/g, "");
  temp = temp.replace(/.+data\-initial\-data="(.+?)".+/, "$1");
  temp = temp.replace(/&quot;/g, "\"");
  console.log(JSON.parse(temp));
})

})();
