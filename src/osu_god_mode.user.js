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
    if(content) {
      if(typeof(content) == "string") {
        ctemp.innerHTML = content;
      } else {
        ctemp.append(content);
      }
    }
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
  
  const god_mode = () => {
    var jtemp = getByClassName("value-display__value");
    jtemp[0].firstChild.innerHTML = "#1";
    jtemp[1].firstChild.innerHTML = "#1";
    jtemp[3].firstChild.innerHTML = num_add_comma(random(22500, 23000));
    var rand = random(5500000, 6500000);
    jtemp[4].children[0].remove();
    getByClassName("value-display__value")[4].append(
      create("span", {
        "data-tooltip-position": "bottom center",
        title: (rand / 3600 | 0) + "時間"
      }, sec_to_dhm(rand))
    )
    
    jtemp = getByClassName("profile-rank-count")[0].children;
    jtemp[0].innerHTML = jtemp[0].innerHTML.replace(/(<div.+>).+/, "$1" + num_add_comma(random(150, 250)));
    jtemp[1].innerHTML = jtemp[1].innerHTML.replace(/(<div.+>).+/, "$1" + num_add_comma(random(50, 150)));
    jtemp[2].innerHTML = jtemp[2].innerHTML.replace(/(<div.+>).+/, "$1" + num_add_comma(random(800, 1200)));
    jtemp[3].innerHTML = jtemp[3].innerHTML.replace(/(<div.+>).+/, "$1" + num_add_comma(random(200, 400)));
    jtemp[4].innerHTML = jtemp[4].innerHTML.replace(/(<div.+>).+/, "$1" + num_add_comma(random(1000, 1500)));
    
    getByClassName("line-chart--profile-page")[0].children[0].children[0].innerHTML = '<path class="line-chart__line" d="M0,30L620.5125122070312,30"></path>';
    getByClassName("line-chart__hover-area")[0].remove();
    getByClassName("line-chart--profile-page")[0].append(
      create("div", {
        class: "line-chart__hover-area",
        style: "inset: 15px 5px; padding: 0px 10px;"
      }, mergedom([
          create("div", {
            class: "line-chart__hover-line"
          }),
          create("div", {
            class: "line-chart__hover-circle"
          }),
          mergedom([
            create("div", {
              class: "line-chart__hover-info-box-text line-chart__hover-info-box-text--x"
            }),
            create("div", {
              class: "line-chart__hover-info-box-text line-chart__hover-info-box-text--y"
            }, "<strong>世界ランキング</strong> #1")
          ], {
            class: "line-chart__hover-info-box",
            "data-float": "left"
          })
        ], {
          class: "line-chart__hover",
          "data-visibility": "hidden"
        })
      )
    )
    getByClassName("line-chart__hover-area")[0].addEventListener("mousemove", (e) => {
      getByClassName("line-chart__hover")[0].setAttribute("data-visibility", "visible");
      let client = getByClassName("line-chart__hover")[0].getBoundingClientRect();
      let infobox = getByClassName("line-chart__hover-info-box")[0];
      let infoboxwidth = infobox.getBoundingClientRect().width;
      if(infoboxwidth + 10 > e.x - client.left) {
        infobox.setAttribute("data-float", "right");
      } else if(e.x - client.left > client.width - infoboxwidth - 10) {
        infobox.setAttribute("data-float", "left");
      }
      let persentage = round((e.x - client.left) / client.width * 89);
      if(persentage < 0) persentage = 0;
      if(persentage > 89) persentage = 89;
      getByClassName("line-chart__hover-line")[0].style.transform = "translateX(" + (client.width * (persentage / 89) | 0) + "px)";
      getByClassName("line-chart__hover-circle")[0].style.transform = "translate(" + (client.width * (persentage / 89) | 0) + "px, 30px)";
      let ago = 89 - persentage;
      if(ago <= 0) {
        ago = "今"
      } else {
        ago += "日前"
      }
      getByClassName("line-chart__hover-info-box-text--x")[0].innerHTML = ago;
    })
    getByClassName("line-chart__hover-area")[0].addEventListener("mouseout", () => {
      getByClassName("line-chart__hover")[0].setAttribute("data-visibility", "hidden");
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
    var min_prog_score = min_score + floor(99999999999 * (rand2 / 100));
    var max_prog_score = min_score + floor(99999999999 * ((rand2 + 1) / 100)) - 1;
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
    getByClassName("user-level")[0].removeAttribute("data-orig-title");
    getByClassName("user-level")[0].setAttribute("title", "レベル " + level);
    getByClassName("user-level")[0].innerHTML = level;
    
    const mod_title = {
      NF: "No Fail",
      EZ: "Eazy",
      HD: "Hidden",
      HR: "Hard Rock",
      SD: "Sudden Death",
      HT: "Half Time",
      DT: "Double Time",
      NC: "Nightcore",
      FL: "Flashlight",
      SO: "Spun Out", // Note: NOT SPIN
      PF: "Perfect"
    }
    const mod_generator = (mods, content) => { // must be array, like ["NF", "DT"]
      // order NF EZ HD HR (SD) (HT | DT | NC) FL SO (PF)
      if(typeof(mods) != "object") return undefined;
      const mod_element = (mod) => {
        content.append(
          create("div", {
            class: "mod mod--" + mod,
            title: mod_title[mod]
          })
        );
      }
      
      if(mods.includes("NF") && !(mods.includes("SD") || mods.includes("PF"))) mod_element("NF");
      if(mods.includes("EZ") && !mods.includes("HR"))                          mod_element("EZ");
      if(mods.includes("HD"))                                                  mod_element("HD");
      if(mods.includes("HR"))                                                  mod_element("HR");
      if(mods.includes("SD") && !mods.includes("PF"))                          mod_element("SD");
      if(mods.includes("HT") && !(mods.includes("DT") || mods.includes("NC"))) mod_element("HT");
      if(mods.includes("DT") && !mods.includes("NC"))                          mod_element("DT");
      if(mods.includes("NC"))                                                  mod_element("NC");
      if(mods.includes("FL"))                                                  mod_element("FL");
      if(mods.includes("SO"))                                                  mod_element("SO");
      if(mods.includes("PF"))                                                  mod_element("PF");
    }
    
    let bp_list = getByClassName("play-detail-list u-relative")[1].children;
    for(let i = 0; i < bp_list.length; i++) {
      bp_list[i].children[1].children[2].children[0].childNodes[0].textContent = (((324 / 100) * (100 - i)) | 0) + 930;
      
      let mod = bp_list[i].children[1].children[1];
      let mod_list = mod.children;
      let mod_list_array = [];
      for(let j = 0; j < mod_list.length; j++) {
        mod_list_array.push(mod_list[j].classList[1].replace("mod--", ""));
      }
      mod_list_array.push("DT", "HD");
      let index_temp = mod_list_array.indexOf("HR");
      if(index_temp != -1) mod_list_array.splice(index_temp, 1);
      if(random(1, 6) == 1) mod_list_array.push("HR");
      index_temp = mod_list_array.indexOf("NF");
      if(index_temp != -1) mod_list_array.splice(index_temp, 1);
      index_temp = mod_list_array.indexOf("EZ");
      if(index_temp != -1) mod_list_array.splice(index_temp, 1);
      index_temp = mod_list_array.indexOf("HT");
      if(index_temp != -1) mod_list_array.splice(index_temp, 1);
      index_temp = mod_list_array.indexOf("PF");
      if(index_temp != -1) mod_list_array.splice(index_temp, 1);
      mod.innerHTML = "";
      mod_generator(mod_list_array, mod);
      
      let pp_weight = bp_list[i].children[1].children[0].children[1];
      let pp_weight_per = Number(pp_weight.children[1].innerHTML.replace(/.+?(\d+)%/, "$1"));
      console.log(pp_weight_per);
      pp_weight.children[0].children[1].innerHTML = floor(((((324 / 100) * (100 - i)) | 0) + 930) * (pp_weight_per / 100)) + "pp";
    }
  }
  
  document.addEventListener("keypress", (e) => {
    if(e.ctrlKey && e.key == "q") {
      if(location.href.match(/:\/\/osu\.ppy\.sh\/users\/.+/)) god_mode();
    }
  })
  
})();
