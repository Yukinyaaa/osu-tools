// ==UserScript==
// @name            プロフィール自動更新
// @namespace       https://osu.ppy.sh/users/22136262
// @downloadURL     https://raw.githubusercontent.com/yuzupon1133/osu-tools/main/src/osu_auto_update_status.user.js
// @updateURL       https://raw.githubusercontent.com/yuzupon1133/osu-tools/main/src/osu_auto_update_status.user.js
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
// https://github.com/yuzupon1133/osu-tools/blob/main/src/osu_auto_update_status.user.js

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
const DOMDeleteAppend = (DOM, content) => {
  DOM.innerHTML = "";
  DOM.append(content);
}

// ------------------- //

const json_reflect = (json) => {
  try {
    var jtemp = getByClassName("value-display__value");
    jtemp[0].firstChild.innerHTML = "#" + num_add_comma(set_temp(json.user.statistics).global_rank); // !!!
    jtemp[1].firstChild.innerHTML = "#" + num_add_comma(get_temp().country_rank);
    jtemp[2].innerHTML = json.user.user_achievements.length;
    jtemp[3].firstChild.innerHTML = num_add_comma(round(get_temp().pp));
    jtemp[4].firstChild.innerHTML = sec_to_dhm(get_temp().play_time);
    jtemp[4].setAttribute("data-orig-title", (get_temp().play_time/3600|0) + "時間");
    jtemp[5].innerHTML = num_add_comma(json.user.kudosu.total);
    
    jtemp = getByClassName("profile-rank-count")[0].children;
    jtemp[0].innerHTML = jtemp[0].innerHTML.replace(/(<div.+>).+/, "$1" + num_add_comma(set_temp(get_temp().grade_counts).ssh)); // !!!
    jtemp[1].innerHTML = jtemp[1].innerHTML.replace(/(<div.+>).+/, "$1" + num_add_comma(get_temp().ss));
    jtemp[2].innerHTML = jtemp[2].innerHTML.replace(/(<div.+>).+/, "$1" + num_add_comma(get_temp().sh));
    jtemp[3].innerHTML = jtemp[3].innerHTML.replace(/(<div.+>).+/, "$1" + num_add_comma(get_temp().s));
    jtemp[4].innerHTML = jtemp[4].innerHTML.replace(/(<div.+>).+/, "$1" + num_add_comma(get_temp().a));
    
    jtemp = getByClassName("profile-stats__value");
    jtemp[0].innerHTML = num_add_comma(get_temp(2).ranked_score);
    jtemp[1].innerHTML = round(Number(get_temp(2).hit_accuracy)*100)/100 + "%";
    jtemp[2].innerHTML = num_add_comma(get_temp(2).play_count);
    jtemp[3].innerHTML = num_add_comma(get_temp(2).total_score);
    jtemp[4].innerHTML = num_add_comma(get_temp(2).total_hits);
    jtemp[5].innerHTML = num_add_comma(get_temp(2).maximum_combo);
    jtemp[6].innerHTML = num_add_comma(get_temp(2).replays_watched_by_others);
    
    jtemp = getByClassName("user-action-button__counter");
    jtemp[0].innerHTML = num_add_comma(json.user.follower_count);
    jtemp[1].innerHTML = num_add_comma(json.user.mapping_follower_count);
    
    getByClassName("bar__fill")[0].setAttribute("style", "width: " + get_temp(2).level.progress + "%");
    getByClassName("bar__text")[0].innerHTML = get_temp(2).level.progress + "%";
    getByClassName("user-level")[0].setAttribute("data-orig-title", "レベル " + get_temp(2).level.current);
    getByClassName("user-level")[0].innerHTML = get_temp(2).level.current;
  } catch(e) {
    show_error(e);
  }
}

// ------------------- //

const num_add_comma = (num) => {
  return Number(num).toLocaleString()
}
var temp_temp = [];
const set_temp = (data) => {
  temp_temp.push(data);
  return data;
}
const get_temp = (index = 1) => {
  return temp_temp.at(-index);
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
const show_error = (e) => {
  is_waiting_stop = true;
  is_error = true;
  DOMDeleteAppend(getById("user-status-update-icon"), error_icon);
  getById("user-status-update-time").innerHTML = "エラー！";
  getById("user-status-detail").setAttribute("title", "コンソールを確認してください");
  throw e;
}

const waiting_icon = strtodom(
  "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><path d=\"M232 120C232 106.7 242.7 96 256 96C269.3 96 280 106.7 280 120V243.2L365.3 300C376.3 307.4 379.3 322.3 371.1 333.3C364.6 344.3 349.7 347.3 338.7 339.1L242.7 275.1C236 271.5 232 264 232 255.1L232 120zM256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0zM48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48C141.1 48 48 141.1 48 256z\"/></svg>", {
  style: "height: 14px; fill: #ccc; margin-right: 5px;"
});
const fetching_icon = strtodom(
  "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 384 512\"><path d=\"M352 0C369.7 0 384 14.33 384 32C384 49.67 369.7 64 352 64V74.98C352 117.4 335.1 158.1 305.1 188.1L237.3 256L305.1 323.9C335.1 353.9 352 394.6 352 437V448C369.7 448 384 462.3 384 480C384 497.7 369.7 512 352 512H32C14.33 512 0 497.7 0 480C0 462.3 14.33 448 32 448V437C32 394.6 48.86 353.9 78.86 323.9L146.7 256L78.86 188.1C48.86 158.1 32 117.4 32 74.98V64C14.33 64 0 49.67 0 32C0 14.33 14.33 0 32 0H352zM111.1 128H272C282.4 112.4 288 93.98 288 74.98V64H96V74.98C96 93.98 101.6 112.4 111.1 128zM111.1 384H272C268.5 378.7 264.5 373.7 259.9 369.1L192 301.3L124.1 369.1C119.5 373.7 115.5 378.7 111.1 384V384z\"/></svg>", {
  style: "height: 14px; fill: #ccc; margin-right: 5px;"
});
const pause_icon = strtodom(
  "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 320 512\"><path d=\"M272 63.1l-32 0c-26.51 0-48 21.49-48 47.1v288c0 26.51 21.49 48 48 48L272 448c26.51 0 48-21.49 48-48v-288C320 85.49 298.5 63.1 272 63.1zM80 63.1l-32 0c-26.51 0-48 21.49-48 48v288C0 426.5 21.49 448 48 448l32 0c26.51 0 48-21.49 48-48v-288C128 85.49 106.5 63.1 80 63.1z\"/></svg>", {
  style: "height: 14px; fill: #ccc; margin-right: 5px;"
});
const error_icon = strtodom(
  "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><path d=\"M506.3 417l-213.3-364c-16.33-28-57.54-28-73.98 0l-213.2 364C-10.59 444.9 9.849 480 42.74 480h426.6C502.1 480 522.6 445 506.3 417zM232 168c0-13.25 10.75-24 24-24S280 154.8 280 168v128c0 13.25-10.75 24-23.1 24S232 309.3 232 296V168zM256 416c-17.36 0-31.44-14.08-31.44-31.44c0-17.36 14.07-31.44 31.44-31.44s31.44 14.08 31.44 31.44C287.4 401.9 273.4 416 256 416z\"/></svg>", {
  style: "height: 14px; fill: #ccc; margin-right: 5px;"
});

document.getElementsByClassName("page-mode--profile-page-extra")[0].append(
  mergedom(
    [
      create("div", {
        id: "user-status-update-icon",
        style: "height: 14px;"
      }, waiting_icon),
      create("span", {
        id: "user-status-update-time"
      }, "15秒後に更新")
    ],
    {
      style: "margin-left: auto; display: flex; align-items: center; user-select: none; cursor: pointer;",
      title: "クリックして一時停止",
      id: "user-status-detail"
    }
  )
)

var is_waiting_stop = false;
var is_fetching = false;
var is_error = false;

getById("user-status-detail").addEventListener("click", () => {
  if(!is_error) {
    if(!is_waiting_stop) {
      DOMDeleteAppend(getById("user-status-update-icon"), pause_icon);
      getById("user-status-update-time").innerHTML = "一時停止中";
      getById("user-status-detail").setAttribute("title", "クリックして再開");
    } else {
      DOMDeleteAppend(getById("user-status-update-icon"), waiting_icon);
      update_time = 15;
      getById("user-status-update-time").innerHTML = "待機中";
      getById("user-status-detail").setAttribute("title", "クリックして一時停止");
    }
    is_waiting_stop = !is_waiting_stop;
  }
  
});

var update_time = 15;

const time_status_update = () => {
  if(!(is_waiting_stop || is_fetching)) {
    update_time--;
    if(update_time <= 0) {
      is_fetching = true;
      DOMDeleteAppend(getById("user-status-update-icon"), fetching_icon);
      getById("user-status-update-time").innerHTML = "更新中";
      var before = JSON.parse(document.querySelector("div[data-initial-data]").getAttribute("data-initial-data"));
      fetch(location.href)
      .then(res => res.text())
      .then(res => {
        var res = res.replace(/\n/g, "");
        res = res.replace(/.+data\-initial\-data="(.+?)".+/, "$1");
        res = res.replace(/&quot;/g, "\"");
        console.log(JSON.parse(res));
        json_reflect(JSON.parse(res));
        update_time = 15;
        DOMDeleteAppend(getById("user-status-update-icon"), waiting_icon);
        getById("user-status-update-time").innerHTML = update_time + "秒後に更新";
        is_fetching = false;
      })
      .catch(e => {
        show_error(e);
      });
    } else {
      DOMDeleteAppend(getById("user-status-update-icon"), waiting_icon);
      getById("user-status-update-time").innerHTML = update_time + "秒後に更新";
    }
  }
  setTimeout(time_status_update, 1000);
};
setTimeout(time_status_update, 1000);

})();
