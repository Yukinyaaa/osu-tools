// ==UserScript==
// @name         osu-ppsにdirect追加
// @namespace    https://osu.ppy.sh/users/22136262
// @version      0.1
// @description  ふぇ
// @author       yuzupon1133
// @match        https://osu-pps.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=osu-pps.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let id = setInterval(() => {
        if(document.querySelector("div[data-test-id=virtuoso-item-list] > div > div > div > div.c-ljOvCE")) {
            start();
            clearInterval(id);
        }
    }, 200);
    function start() {
        document.querySelector("div[data-radix-scroll-area-viewport]").addEventListener("scroll", direct);
        direct();
        function direct() {
            let a = document.querySelectorAll("div[data-test-id=virtuoso-item-list] > div > div > div > div.c-ljOvCE");
            for(let i = 0; i < a.length; i++) {
                if(a[i].children.length != 1) continue;
                let b = document.createElement("span");
                b.innerHTML = `&nbsp(&nbsp<a class="c-dAwFCE c-gDTpYZ" style="color: aquamarine;" href="${a[i].children[0].href.replace(/^.+\/beatmaps\/(\d+)$/, "osu://b/$1/")}">direct</a>&nbsp)`;
                a[i].append(b);
            }
        }
    }
})();
