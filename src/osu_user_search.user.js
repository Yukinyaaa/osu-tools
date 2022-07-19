// ==UserScript==
// @name         ユーザーを検索
// @namespace    https://osu.ppy.sh/users/22136262
// @version      0.1
// @downloadURL  https://raw.githubusercontent.com/yuzupon1133/osu-userscript-tools/main/src/osu_user_search.user.js
// @updateURL    https://raw.githubusercontent.com/yuzupon1133/osu-userscript-tools/main/src/osu_user_search.user.js
// @description  フレンド欄にユーザーを検索機能を追加しました
// @author       yuzupon1133
// @match        https://osu.ppy.sh/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ppy.sh
// @grant        none
// ==/UserScript==

// このユーザースクリプトの説明
// https://boubiroku.yuzupon1133.repl.co/article/?id=5
// GitHub
// https://github.com/yuzupon1133/osu-userscript-tools/blob/main/src/osu_user_search.user.js

(function() {
    const create = (...arg) => { // tagName, (attributeName, attributeValue)..., innerHTML
      var ctemp = document.createElement(arg[0]);
      if(arg.length >= 3) {
        for(let i = 1; i < (arg.length==3?3:arg.length-1); i+=2) {
          ctemp.setAttribute(arg[i], arg[i+1]);
        }
      }
      if(arg.length % 2 == 0 && arg.length >= 2) {
        ctemp.innerHTML = arg.at(-1);
      }
      return ctemp;
    }
    
    const show_user = (name) => {
        var user_list = document.getElementsByClassName("user-card");
        var username_list = document.getElementsByClassName("user-card__username");
        for(i=1; i<username_list.length-1; i++) {
            if(username_list[i].innerHTML.toLowerCase().indexOf(name.toLowerCase()) == -1) {
                user_list[i].classList.add("hidden");
            } else {
                user_list[i].classList.remove("hidden");
            }
        }
    }
    
    const firstload = () => {
        
      document.head.append(create("style", `
        .user-search-box {
          position: relative;
          top: 15px;
        }
        .user-search-box i {
          position: absolute;
          top: 12px;
          left: 27%;
        }
        #user-search-input {
          margin-bottom: 15px;
          height: 21px;
          width: 50%;
          margin-left: auto;
          margin-right: auto;
          padding-left: 50px;
        }
        @media screen and (max-width: 900px) {
          #user-search-input {
            width: 80%;
          }
          .user-search-box i {
            left: 13%;
          }
        }
        .hidden {
          display: none;
        }
      `));
        
      var path = location.pathname;
      if(path.match(/^\/home\/friends/)) {
        appendelement();
      }
      
      setInterval(() => {
        if(path != location.pathname) {
          path = location.pathname;
          if(path.match(/^\/home\/friends/)) {
            appendelement();
          }
        }
      }, 250);
    }
    
    const appendelement = () => {
      var intervalid = setInterval(() => {
        if(document.getElementsByClassName("user-list__toolbar").length != 0) {
          clearInterval(intervalid);
          document.getElementsByClassName("user-list__toolbar")[0].append(create("div", "class", "user-search-box", `
            <input class="search-header__input" placeholder="ユーザーを検索..." id="user-search-input" autofocus pattern="[a-zA-Z0-9\\-_\\[\\] ]">
            <i class="fas fa-search"></i>
          `));
          document.getElementById("user-search-input").addEventListener("input", () => {
            show_user(document.getElementById("user-search-input").value);
          });
          var all_list = document.getElementsByClassName("update-streams-v2__item");
          for(i=0; i<3; i++) {
            all_list[i].addEventListener("click", () => {
              setTimeout(() => {
                intervalid = setInterval(() => {
                  if(document.getElementsByClassName("user-card").length != 0) {
                    clearInterval(intervalid);
                    show_user(document.getElementById("user-search-input").value);
                  }
                }, 100);
              }, 100);
            })
          }
        }
      }, 250);
    }
    
    if (document.readyState == "complete" || document.readyState == "loaded" || document.readyState == "interactive") { //DOMLoaded
      firstload();
    } else {
      window.addEventListener('DOMContentLoaded', () => {
        firstload();
      });
    }
})();
