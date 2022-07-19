// ==UserScript==
// @name:ja         フォローされているか確認
// @name            Check that you are being followed
// @namespace       https://osu.ppy.sh/users/22136262
// @downloadURL     https://osu.yuzupon1133.repl.co/followcheck.user.js
// @updateURL       https://osu.yuzupon1133.repl.co/followcheck.user.js
// @version         1.2
// @description:ja  相手にフォローされているか確認することができます
// @description     Check if the other is follows you
// @author          yuzupon1133
// @match           https://osu.ppy.sh/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=ppy.sh
// @grant           none
// ==/UserScript==

// !!!!!!!!! Please help me translate !!!!!!!!!!

// ========= Your Country Code Here ========== //
             var country_code = "JA";
// =========================================== //

(function () {

  var follow = {
    JA: "フォローされています",
    EN: "Follows You"
  }, retrieve = {
    JA: "取得中",
    EN: "retrieving"
  }

  if(follow[country_code] == undefined) {
    country_code = "EN";
  }

  function cntloadfunc() { // main function
    
    var title = location.pathname;
    setInterval(() => {
      if(title != location.pathname) {
        title = location.pathname;
        checkfollow();
      }
    }, 500);
    
    checkfollow();
    
    function checkfollow() {
      let id = location.pathname.replace(/\/users\/(\d+)\/?.*/, "$1");
      if(location.pathname.match(/\/users\/(\d+)\/?.*/)) {
        let interval_check_id = setInterval(() => {
          if(!!document.getElementsByClassName("profile-info__flags")[0]) {
            clearInterval(interval_check_id);
            let cls = document.getElementsByClassName("user-action-button")[0];
            if (cls != undefined && !cls.disabled) {
              if (cls.classList[2] == undefined) {
                editdetail(retrieve[country_code]);
                getdata();
              } else if (cls.classList[2].replace(/.+--(.).+/, "$1") == "m") {
                editdetail(follow[country_code]);
              }
            }
          }
        }, 250);
      }
      
      async function getdata() {
        await fetch(`https://osu.ppy.sh/home/friends?target=${id}`, {
          method: "POST",
          headers: {
            "x-requested-with": "XMLHttpRequest",
            "x-csrf-token": gettoken()
          }
        })
        .then(res => res.text())
        .then(res => {
          if(res.replace(new RegExp(`.*id\":${id},.*?mutual\":(true|false).*`), "$1") == "true") {
            editdetail(follow[country_code]);
          } else {
            editdetail(null, false);
          }
        });
        fetch(`https://osu.ppy.sh/home/friends/${id}`, {
          method: "DELETE",
          headers: {
            "x-requested-with": "XMLHttpRequest",
            "x-csrf-token": gettoken()
          }
        })
      }
      
      function editdetail(value, edit = true) {
        if(edit) {
          if (!document.getElementById("montst")) { // monkeytest?
            let elm = document.createElement("div");
            elm.innerHTML = value;
            elm.id = "montst";
            elm.style = "position:relative;left:10px;display:flex;align-items:center;background-color:rgb(110 86 86);padding:2px 10px;border-radius:7px;font-size:10px;";
            document.getElementsByClassName("profile-info__flags")[0].appendChild(elm);
          } else {
            document.getElementById("montst").innerHTML = value;
          }
        } else {
          if (!!document.getElementById("montst")) {
            document.getElementById("montst").remove();
          }
        }
      }
    }
  }
  
  function gettoken() {
    return document.cookie.replace(/.*XSRF-TOKEN=(.*?);?/, "$1");
  }

  if (document.readyState == "complete" || document.readyState == "loaded" || document.readyState == "interactive") { //DOMLoaded
    setTimeout(cntloadfunc, 200);
  } else {
    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(cntloadfunc, 200);
    });
  }
})();
