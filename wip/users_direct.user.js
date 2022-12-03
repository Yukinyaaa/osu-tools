// ==UserScript==
// @name            users_direct
// @namespace       https://osu.ppy.sh/users/22136262
// @downloadURL     https://raw.githubusercontent.com/yuzupon1133/osu-tools/main/wip/users_direct.user.js
// @updateURL       https://raw.githubusercontent.com/yuzupon1133/osu-tools/main/wip/users_direct.user.js
// @version         0.7
// @description:ja  どのページからでも瞬時にユーザーページに移動
// @description     Quickly jump to a user page from any page
// @author          yuzupon1133
// @match           https://osu.ppy.sh/*
// @exclude         https://osu.ppy.sh/ss/*
// @exclude         https://osu.ppy.sh/api/*
// @exclude         https://osu.ppy.sh/forum/*
// @exclude         https://osu.ppy.sh/p/*
// @exclude         https://osu.ppy.sh/images/*
// @exclude         https://osu.ppy.sh/docs/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=ppy.sh
// ==/UserScript==

// Attention! If the window size is less than 770px * 310px, the layout will be broken, but I don't intend to fix this.

!function() {
const version = "0.8";
const changeLog = [
  {
    version: "0.8",
    log: [
      "Added image loading icon",
      "Added more setting options (wip)",
      "Added sort and filter (wip)",
      "Hide navigation when open assets (//osu.ppy.sh/images/) and documentation (//osu.ppy.sh/docs/)",
      "Animation and style and layout have been much better"
    ]
  },
  {
    version: "0.7",
    log: [
      "Fixed some bugs",
      "Improved readability of the code",
      "Hide navigation when open api (//osu.ppy.sh/api/) and old forum (//osu.ppy.sh/forum/) and (//osu.ppy.sh/p/)",
      "Added settings (wip)",
    ]
  },
  {
    version: "0.6",
    log: [
      "Made major code changes to improve the readability of the code",
      "Moved most strings to css \"content\" property",
      "Shadow has been added to the another item list (experimental)",
      "Element position can now be moved left-side or right-side",
      "Focus on input element when navigation button is pressed",
    ]
  },
  {
    version: "0.5",
    log: [
      "Minor style changes",
      "Added display of search hit counts",
      "Shadow has been added to the item list (experimental)",
      "Fixed z-index problem",
      "Search is now available for userID",
    ]
  },
  {
    version: "0.4",
    log: [
      "Fixed a problem that prevented scripts from working when the back button was pressed",
      "Hide navigation when open screenshot preview (//osu.ppy.sh/ss/)",
      "Fixed z-index problem",
    ]
  },
  {
    version: "0.3",
    log: [
      "Press escape key on input element to now deletes all characters",
      "Fixed some bugs",
      "Changed some wording",
      "Changed item layout to two columns",
    ]
  },
  {
    version: "0.2",
    log: [
      "Fixed z-index problem",
      "Added online/offline status (this is only for user you have added as friends)",
      "The mechanism for retrieving friend info has changed",
    ]
  },
  {
    version: "0.1",
    log: [
      "Release users_direct.user.js",
    ]
  }
];

function type(data, name, err) {
  let typename = Number.isNaN(data) ? "nan" : Object.prototype.toString.call(data).slice(8, -1).toLowerCase();
  if(!name) return typename;
  if(typeof name == "string" && (name = name.split("|")), typename = name.includes(typename), !err) return typename;
  if(!typename) throw new TypeError("value is not a(n) " + name.join(" or "));
  return true;
}
function ajax(options) {
  const xhr = new XMLHttpRequest;
  xhr.text = function() {
    return xhr.responseText;
  }
  xhr.json = function() {
    return JSON.parse(xhr.responseText);
  }
  let urlparams = null;
  if(options.urlparams) {
    urlparams = new URLSearchParams;
    for(let name in options.urlparams) {
      urlparams.set(name, options.urlparams[name]);
    }
  }
  xhr.open(options.method || "GET", options.url + (urlparams ? "?" + urlparams.toString() : ""), true, options.user, options.password);
  
  for(let header in options.headers) {
    xhr.setRequestHeader(header, options.headers[header]);
  }
  options.mimeType && xhr.overrideMimeType(options.mimeType);
  xhr.responseType = options.responseType || "text";
  xhr.withCredentials = !!options.withCredentials;
  options.timeout && (xhr.timeout = options.timeout);
  xhr.onreadystatechange = () => {
    options.onreadystatechange && options.onreadystatechange(xhr);
    if(xhr.readyState == 4) {
      if(xhr.status == 200 || xhr.status == 304) {
        options.success && options.success(xhr);
      } else {
        options.failure && options.failure(xhr);
      }
    }
  }
  for(let name of ["onerror", "onload", "onloadend", "onloadstart", "onprogress", "ontimeout"]) {
    xhr[name] = e => {
      options["on" + e.type] && options["on" + e.type](e, xhr);
    }
  }
  let body = null;
  if(type(options.body, "object", false)) {
    body = new FormData;
    for(let name in options.body) {
      body.set(name, options.body[name]);
    }
  }
  
  xhr.send(body);
  return;
}
function setLocal(name, value) {
  if(type(value) == "object" || type(value) == "array") {
    value = JSON.stringify(value);
  }
  localStorage.setItem(name, "" + value);
}
function getLocal(name, json) {
  let value = localStorage.getItem(name);
  if(json) {
    try {
      value = JSON.parse(value);
    } catch(e) {}
  }
  return value;
}
function removeLocal(name) {
  localStorage.removeItem(name);
}
function clearLocal() {
  localStorage.clear();
}
function setSession(name, value) {
  if(type(value) == "object" || type(value) == "array") {
    value = JSON.stringify(value);
  }
  sessionStorage.setItem(name, value);
}
function getSession(name, json) {
  let value = sessionStorage.getItem(name);
  if(json) {
    try {
      value = JSON.parse(value);
    } catch(e) {}
  }
  return value;
}
function removeSession(name) {
  sessionStorage.removeItem(name);
}
function clearSession() {
  sessionStorage.clear();
}
function objectToCSS(styles, nested_lv = 0) {
  let styleList = [];
  for(let propety in styles) {
    if(type(styles[propety], "object")) {
      styleList.push(" ".repeat(nested_lv * 4) + propety + " {\n" + objectToCSS(styles[propety], nested_lv + 1) + "\n" + " ".repeat(nested_lv * 4) + "}");
    } else {
      if(typeof styles[propety] == "number" && styles[propety]) styles[propety] += "px";
      styleList.push(" ".repeat(nested_lv * 4) + propety.toSnakeCase() + ": " + styles[propety] + ";");
    }
  }
  return styleList.join("\n");
}
function addStyle(styles) {
  document.body.append(
    _$("style")
    .setText(objectToCSS(styles))
  );
}
function _$(nodename) {
  if(type(nodename) != "string") throw Error;
  return document.createElement(nodename);
}
Object.assign(_$, {
  getById(id) {
    return document.getElementById(id);
  },
  getByName(name) {
    return document.getElementsByName(name);
  },
  getByTagName(tagName) {
    return document.getElementsByTagName(tagName);
  },
  getByQuery(query) {
    return document.querySelector(query);
  },
  getByQueryAll(query) {
    return document.querySelectorAll(query);
  },
  getCookie(name) {
    let cookies = new Object();
    if(!document.cookie) return cookies;
    document.cookie.split("; ").forEach(value => {
      let parts = value.split("=");
      cookies[parts[0]] = decodeURIComponent(parts.slice(1).join('='));
    });
    return name ? cookies[name] || undefined : cookies;
  },
  setCookie(name, value, attributes) {
    document.cookie = name + "=" + encodeURIComponent(value) + "; " + attributes;
  },
  removeCookie(name) {
    _$.setCookie(name, null, "max-age=0;");
  },
  if(cond, node1, node2) {
    if(cond) {
      return node1;
    } else {
      return node2;
    }
  },
  or(cond1, cond2, node1, node2) {
    if(cond1 || cond2) {
      return node1;
    } else {
      return node2;
    }
  },
  and(cond1, cond2, node1, node2) {
    if(cond1 && cond2) {
      return node1;
    } else {
      return node2;
    }
  }
});
const originalAppend = Element.prototype.append;
const originalSetAttribute = Element.prototype.setAttribute;
Object.assign(Element.prototype, {
  append(...nodes) {
    originalAppend.call(this, ...nodes);
    return this;
  },
  setAttribute(qualifiedName, value) {
    originalSetAttribute.call(this, qualifiedName, value);
    return this;
  },
  setText(text, inner) {
    if(inner) {
      this.innerText = text;
    } else {
      this.textContent = text;
    }
    return this;
  },
  getText() {
    return this.textContent;
  },
  setHTML(DOMString) {
    this.innerHTML = DOMString || "";
    return this;
  },
  addListener(type, listener, options) {
    Element.prototype.addEventListener.call(this, type, listener, options);
    return this;
  },
  addClass(...classes) {
    if(classes.length) {
      for(let item of classes) {
        if(item) this.classList.add(item);
      }
    }
    return this;
  },
  removeClass(...classes) {
    if(classes.length) {
      for(let item of classes) {
        if(item) this.classList.remove(item);
      }
    }
    return this;
  },
  toggleClass(...classes) {
    if(classes.length) {
      for(let item of classes) {
        if(item) this.classList.toggle(item);
      }
    }
    return this;
  },
  classExists(...className) {
    for(let item of className) {
      if(this.classList.contains(item)) return true;
    }
    return false;
  },
  tagNameExists(...names) {
    for(let item of names) {
      if(this.tagName == item) return true;
    }
    return false;
  },
  setID(id) {
    this.setAttribute("id", id);
    return this;
  },
  forEachNodes(fn) {
    this.childNodes.forEach(fn);
    return this;
  },
  setSrc(src) {
    this.src = src;
    return this;
  },
  setHref(href) {
    this.href = href;
    return this;
  },
  do(func) {
    func(this);
    return this;
  },
});
Object.assign(String.prototype, {
  addRegExpEscape: function() {
    return this.replace(/([\*\.\+\?\|\{\}\(\)\[\]\^\$\-])/g, "\\$1");
  },
  toCamelCase: function(sep) {
    return this.replace(new RegExp("(" + (sep ? sep.addRegExpEscape() : "-") + "[a-z])", "g"), match => {
      return match.charAt(sep ? sep.length : 1).toUpperCase();
    });
  },
  toSnakeCase: function(sep) {
    return this.replace(/[A-Z]/g, match => {
      return (sep || "-") + match.toLowerCase();
    });
  },
});
HTMLCollection.prototype.forEach = function(fn) {
  for(let i = 0; i < this.length; i++) {
    fn(this[i], i, this);
  }
}

const svgs = {
  settings: '<path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336c44.2 0 80-35.8 80-80s-35.8-80-80-80s-80 35.8-80 80s35.8 80 80 80z"/>',
  sort: '<path d="M151 440q-10 9 -23 9v0q-13 0 -23 -9l-96 -96q-9 -10 -9 -23t9 -23q10 -9 23 -9t23 9l41 42v-307q0 -14 9 -23t23 -9t23 9t9 23v307l41 -42q10 -9 23 -9t23 9q9 10 9 23t-9 23l-96 96v0zM503 110q9 10 9 23v0q0 13 -9 23q-10 9 -23 9t-23 -9l-41 -42v307q0 14 -9 23t-23 9 t-23 -9t-9 -23v-307l-41 42q-10 9 -23 9t-23 -9q-9 -10 -9 -23t9 -23l96 -96q10 -9 23 -9t23 9l96 96v0z"/>',
  filter: '<path d="M3.9 54.9C10.5 40.9 24.5 32 40 32H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9V448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6V320.9L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z"/>',
  select: '<path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/>',
}
function getSVG(name) {
  return _$("div")
  .setHTML('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">' + name + "</svg>")
  .children[0]
}

if(!getLocal("fd_lang")) {
  setLocal("fd_lang", "en");
}
let add_users = [];
if(getLocal("fd_add_users")) {
  add_users = getLocal("fd_add_users", true);
}
let is_friends_loaded = false, nav_focus,
input_value = {
  users: null,
  friends: null,
  search: null,
}, friends_data, search_data;
ajax({
  url: "https://osu.ppy.sh/home/friends",
  success: e => {
    is_friends_loaded = true;
    let res = e.text();
    let friends = [];
    let res_friends = JSON.parse(res.match(/<script id="json-users" type="application\/json">\n        (.+?)\n/)[1]);
    res_friends.forEach(value => {
      friends.push({
        icon: value.avatar_url,
        name: value.username,
        id: value.id,
        online: value.is_online,
        last: value.last_visit,
      });
    });
    friends_data = friends;
    reloadUsersList(input_value.friends);
    reloadAddUsersList();
  }
});

function getNavFocustUserList() {
  if(nav_focus == "users") {
    return getLocal("fd_add_users", true);
  } else if(nav_focus == "friends") {
    return friends_data;
  } else if(nav_focus == "search") {
    return search_data;
  }
  return;
}
function getNowSearchQuery() {
  if(nav_focus == "users") {
    return input_value.users;
  } else if(nav_focus == "friends") {
    return input_value.friends;
  } else if(nav_focus == "search") {
    return input_value.search;
  }
  return;
}
function getDateOffset(date) {
  let offset = (new Date().getTime() - new Date(date).getTime()) / 1000;
  if(Number.isNaN(offset)) return "invalid date";
  let agolater =  offset < 0 ? "later" : "ago";
  offset = Math.abs(offset);
  if(offset == 0) return "now";
  if(offset < 60) return offset + " second(s) " + agolater;
  offset = offset / 60 | 0;
  if(offset < 60) return offset + " minute(s) " + agolater;
  offset = offset / 60 | 0;
  if(offset < 24) return offset + " hour(s) " + agolater;
  offset = offset / 24 | 0;
  if(offset < 30) return offset + " day(s) " + agolater;
  if(offset < 365) return (offset / 30 | 0) + " month(s) " + agolater;
  return (offset / 365 | 0) + " year(s) " + agolater;
}
Element.prototype.createSelectBox = function(options, onchange) {
  if(!options.length) return;
  let defaultText = options.filter(value => value.selected)[0]?.text;
  if(!defaultText) defaultText = options[0].text;
  return this
  .addClass("fd_select", "fd_hover_active")
  .addListener("click", e => {
    if(e.target.classExists("fd_option")) {
      if(e.target.getAttribute("disabled") == "" || e.target.getAttribute("selected") == "") return;
      e.target.parentElement.children.forEach(value => {
        value.removeAttribute("selected");
      });
      e.target.setAttribute("selected", "");
      e.currentTarget.children[0].children[0].setText(e.target.getText());
      onchange && onchange({
        value: e.target.getAttribute("value"),
        text: e.target.getText(),
        elm: e.target,
      });
    }
    e.currentTarget.toggleClass("fd_select_open");
  })
  .append(
    _$("div")
    .addClass("fd_selected")
    .append(
      _$("div")
      .addClass("fd_selected_value")
      .setText(defaultText),
      getSVG(svgs.select)
    ),
    _$("div")
    .addClass("fd_select_back"),
    _$("div")
    .addClass("fd_options")
    .append(
      ...options.map(value => {
        if(value.hidden) return "";
        return _$("div")
        .setText(value.text)
        .addClass("fd_option")
        .do(e => {
          if(value.selected) e.setAttribute("selected", "");
          if(value.disabled) e.setAttribute("disabled", "");
        })
      })
    )
  )
}
Element.prototype.createContextMenu = function(options, onchange) {
  if(!options.length) return;
  return this
  .addClass("fd_contextmenu", "fd_hover_active")
  .addListener("click", e => {
    console.log(e.target);
    if(e.target.classExists("fd_option")) {
      if(e.target.getAttribute("disabled") == "" || (e.target.getAttribute("selected") == "" && e.target.getAttribute("data-removeable") != "")) return;
      if(e.target.getAttribute("data-removeable") == "" && e.target.getAttribute("selected") == "") {
        e.target.removeAttribute("selected");
      } else {
        e.target.parentElement.children.forEach(value => {
          value.removeAttribute("selected");
        });
        e.target.setAttribute("selected", "");
      }
      onchange && onchange({
        value: e.target.getAttribute("value"),
        text: e.target.getText(),
        elm: e.target,
      });
    }
    let qtip_id = e.currentTarget.getAttribute("data-hasqtip");
    if(qtip_id != "") {
      let qtip = _$.getById("qtip-" + qtip_id);
      if(qtip) {
        qtip.toggleClass("fd_hidden");
      }
    }
    e.currentTarget.toggleClass("fd_contextmenu_open");
  })
  .append(
    _$("div")
    .addClass("fd_selected"),
    _$("div")
    .addClass("fd_select_back"),
    _$("div")
    .addClass("fd_contextmenu_options")
    .append(
      _$("div")
      .addClass("fd_contextmenu_upper"),
      _$("div")
      .addClass("fd_options")
      .append(
        ...options.map(value => {
          if(value.hidden) return "";
          return _$("div")
          .setText(value.text)
          .addClass("fd_option")
          .do(e => {
            if(value.selected) e.setAttribute("selected", "");
            if(value.disabled) e.setAttribute("disabled", "");
            if(value.default) e.setAttribute("data-default", "");
            if(value.removeable) e.setAttribute("data-removeable", "");
          })
        })
      )
    )
    
  )
}
function findUserFromId(id) {
  if(!is_friends_loaded || !friends_data) return null;
  for(let value of friends_data) {
    if(value.id == id) {
      return value;
    }
  }
  return null;
}
function reloadUsersList(query) {
  let users_list = getNavFocustUserList();
  if(users_list) {
    let added_id = [];
    for(let value of add_users) {
      added_id.push(value.id);
    }
    users_list = users_list.filter(value => {
      value.add = added_id.includes(value.id);
      if(query) {
        return (value.name.toLowerCase().indexOf(query.toLowerCase()) != -1 || String(value.id).indexOf(query) != -1);
      }
      return true;
    });
    if(nav_focus == "users" && !users_list.length) {
      _$.getById("fd_screen_add_list").setText("Nothing added yet!");
    } else {
      _$.getById("fd_screen_add_list").setHTML();
      _$.getById("fd_screen_add_list").append(
        ...users_list.map(value => {
          return _$("div")
          .addClass("fd_list_item", "fd_screen_add_list_item")
          .append(
            _$("div")
            .addClass("fd_image")
            .append(
              _$("div")
              .addClass("fd_spinner")
              .append(
                _$("div")
                .append(
                  _$("div")
                )
              ),
              _$("img")
              .setSrc(value.icon)
              .addListener("load", e => {
                e.currentTarget.parentElement.addClass("fd_image_loaded");
              })
            ),
            _$("a")
            .setHref("https://osu.ppy.sh/users/" + value.id)
            .setAttribute("rel", "nofollow")
            .append(
              _$("span")
              .setText(value.name)
            ),
            _$("div")
            .addClass("fd_hover_active", "fd_add_delete_button", value.add ? "fd_add" : null)
            .setAttribute("data-list-item-json", JSON.stringify({
              icon: value.icon,
              name: value.name,
              id: value.id,
            }))
            .addListener("click", e => {
              user_toggle(e.currentTarget);
            })
            .setAttribute("title", !value.add ? "Add to list" : "Remove from list")
          )
        })
      );
    }
    if(!(_$.getById("fd_screen_add_list").scrollTop + _$.getById("fd_screen_add_list").clientHeight >= _$.getById("fd_screen_add_list").scrollHeight - 5)) {
      _$.getById("fd_screen_add_list_bottom").style.display = "block";
    } else {
      _$.getById("fd_screen_add_list_bottom").style.display = "none";
    }
    if(_$.getById("fd_screen_add_list").scrollTop != 0) {
      _$.getById("fd_screen_add_list_top").style.display = "block";
    } else {
      _$.getById("fd_screen_add_list_top").style.display = "none";
    }
    _$.getById("fd_screen_add_count_of_hits").setText(users_list.length + " hits");
    if(!users_list.length) {
      _$.getById("fd_screen_add_list").setText("No results!");
    }
  } else {
    if(nav_focus == "friends") {
      _$.getById("fd_screen_add_list").setText("Loading, this may take a couple seconds.");
    } else if(nav_focus == "search") {
      _$.getById("fd_screen_add_count_of_hits").setText("? hits");
      _$.getById("fd_screen_add_list").setText("Type to search user");
    } else {
      _$.getById("fd_screen_add_count_of_hits").setText("? hits");
      _$.getById("fd_screen_add_list").setText("An error may have occurred, please check the console.");
    }
  }
}
function reloadAddUsersList() {
  if(add_users.length) {
    _$.getById("fd_screen_add_users").setHTML();
    _$.getById("fd_screen_add_users").append(
      ...add_users.map(value => {
        let status = findUserFromId(value.id);
        return _$("div")
        .addClass("fd_list_item", "fd_screen_list_item")
        .append(
          _$("div")
          .addClass("fd_image")
          .append(
            _$("div")
            .addClass("fd_spinner")
            .append(
              _$("div")
              .append(
                _$("div")
              )
            ),
            _$("img")
            .setSrc(value.icon)
            .addListener("load", e => {
              e.currentTarget.parentElement.addClass("fd_image_loaded");
            })
          ),
          _$("a")
          .setHref("https://osu.ppy.sh/users/" + value.id)
          .setAttribute("rel", "nofollow")
          .append(
            _$("span")
            .setText(value.name)
          ),
          _$("div")
          .addClass("fd_status")
          .setAttribute("title", (() => {
            if(is_friends_loaded) {
              if(status) {
                if(status.online) {
                  return "Currently online";
                } else {
                  if(status.last) {
                    return "Offline, last seen " + getDateOffset(status.last);
                  } else {
                    return "This user is hiding online status.";
                  }
                }
              } else {
                return "Need to add as friend to see the online status!";
              }
            } else {
              return "Loading status, please wait!";
            }
          })())
          .append(
            _$("div")
            .addClass((() => {
              if(status) {
                return status.online ? "fd_status_online" : (status.last ? "fd_status_offline" : "fd_status_hidden");
              } else {
                return null;
              }
            })())
          )
        )
      })
    );
  } else {
    _$.getById("fd_screen_add_users").setText("Click \"edit\" to add users!")
  }
  if(!(_$.getById("fd_screen_add_users").scrollTop + _$.getById("fd_screen_add_users").clientHeight >= _$.getById("fd_screen_add_users").scrollHeight - 5)) {
    _$.getById("fd_screen_list_bottom").style.display = "block";
  } else {
    _$.getById("fd_screen_list_bottom").style.display = "none";
  }
  if(_$.getById("fd_screen_add_users").scrollTop != 0) {
    _$.getById("fd_screen_list_top").style.display = "block";
  } else {
    _$.getById("fd_screen_list_top").style.display = "none";
  }
}
function user_toggle(e) {
  let user = JSON.parse(e.getAttribute("data-list-item-json"));
  if(!e.classExists("fd_add")) {
    for(let i = 0; i < add_users.length; i++) {
      if(add_users[i].id == user.id) {
        return;
      }
    }
    add_users.push(user);
    setLocal("fd_add_users", add_users);
    e.addClass("fd_add");
    e.setAttribute("title", "Remove from list");
    reloadAddUsersList();
  } else {
    for(let i = 0; i < add_users.length; i++) {
      if(add_users[i].id == user.id) {
        add_users.splice(i, 1);
        setLocal("fd_add_users", add_users);
        e.removeClass("fd_add");
        e.setAttribute("title", "Add to list");
        reloadAddUsersList();
        break;
      }
    }
  }
}
function nav_change(type) {
  if(type != "settings") nav_focus = type;
  _$.getById("fd_screen_add_search").value = (type == "settings" ? null : getNowSearchQuery() || null);
  _$.getById("fd_screen_add_nav_users")[`${type == "users" ? "add" : "remove"}Class`]("fd_screen_add_nav_focus");
  _$.getById("fd_screen_add_nav_friends")[`${type == "friends" ? "add" : "remove"}Class`]("fd_screen_add_nav_focus");
  _$.getById("fd_screen_add_nav_search")[`${type == "search" ? "add" : "remove"}Class`]("fd_screen_add_nav_focus");
  _$.getById("fd_screen_add_list_settings")[`${type == "settings" ? "add" : "remove"}Class`]("fd_screen_add_list_settings_show");
  _$.getById("fd_settings").setAttribute("title", `${type == "settings" ? "close" : "open"} settings`);
  if(type == "settings") {
    _$.getById("fd_screen_add_search").setAttribute("disabled", "");
  } else {
    _$.getById("fd_screen_add_search").removeAttribute("disabled");
    reloadUsersList(getNowSearchQuery());
  }
  
  _$.getById("fd_screen_add_search").focus();
}
const sorryMessage = "In this update, added more setting options, sorting, filtering, etc., but these features don't work yet because <a href=''>I'm verrrrry tired</a> after 15 days of effort on this feature.<br>But I promise I'll implement it in the next update, so stay tuned!";
function body_append() {
  if(!_$.getById("fd_screen")) {
    document.body.append(
      _$("div")
      .setID("fd_screen")
      .addClass("fd_screen", getLocal("fd_position") == "right" ? "fd_screen_right_side" : null)
      .do(e => {
        e.fd_event = true;
      })
      .append(
        _$("div")
        .append(
          _$("div")
          .addClass("fd_screen_buttons")
          .append(
            _$("div")
            .addClass("fd_screen_button_edit", "fd_hover_active")
            .setAttribute("title", "Add/delete users")
            .addListener("click", e => {
              _$.getById("fd_screen_add").addClass("fd_screen_add_show");
              nav_change("friends");
            }),
            _$("div")
            .addClass("fd_screen_button_position", "fd_hover_active")
            .setAttribute("title", "Move the position to " + (getLocal("fd_position") == "right" ? "left" : "right") + "-side.")
            .addListener("click", e => {
              e.currentTarget
              .setAttribute("title", "Move the position to " + getLocal("fd_position") + "-side.")
              _$.getById("fd_screen").toggleClass("fd_screen_right_side");
              setLocal("fd_position", (getLocal("fd_position") == "right" ? "left" : "right"));
            })
          ),
          _$("div")
          .setID("fd_screen_list_top")
          .addClass("fd_screen_shadow", "fd_screen_shadow_top")
          .append(
            _$("div")
          ),
          _$("div")
          .setID("fd_screen_add_users")
          .addClass("fd_screen_add_users")
          .addListener("scroll", e => {
            if(e.currentTarget.scrollTop == 0) {
              _$.getById("fd_screen_list_top").style.display = "none";
            } else {
              _$.getById("fd_screen_list_top").style.display = "block";
            }
            if(e.currentTarget.scrollTop + e.currentTarget.clientHeight >= e.currentTarget.scrollHeight - 5) {
              _$.getById("fd_screen_list_bottom").style.display = "none";
            } else {
              _$.getById("fd_screen_list_bottom").style.display = "block";
            }
          }),
          _$("div")
          .setID("fd_screen_list_bottom")
          .addClass("fd_screen_shadow", "fd_screen_shadow_bottom")
          .append(
            _$("div")
          )
        ),
        _$("div")
        .append(
          _$("div")
          .addClass("fd_screen_open_close_button")
          .addListener("click", e => {
            _$.getById("fd_screen").toggleClass("fd_screen_show");
          })
        )
      ),
      _$("div")
      .setID("fd_screen_add")
      .addClass("fd_screen_add")
      .append(
        /* Future remove */
        _$("div")
        .addClass("fd_notice", (getLocal("fd_hide_notice-v0.8") ? "fd_hidden" : null))
        .append(
          _$("div")
          .append(
            _$("div")
            .addClass("fd_notice-1")
            .setText("Notice :3"),
            _$("div")
            .addClass("fd_notice-2")
            .setHTML(sorryMessage, true),
            _$("a")
            .setHref("javascript:void(0)")
            .addClass("fd_notice-3")
            .setText("I understand, don't show again.")
            .addListener("click", e => {
              setLocal("fd_hide_notice-v0.8", true);
              e.target.parentElement.parentElement.addClass("fd_hidden");
            })
          )
        ),
        /* ------------- */
        _$("div")
        .addClass("fd_screen_add_main")
        .append(
          _$("div")
          .addClass("fd_screen_add_nav")
          .append(
            _$("div")
            .setID("fd_screen_add_nav_users")
            .addClass("fd_screen_add_nav_text", "fd_screen_add_nav_users")
            .addListener("click", e => {
              nav_change("users");
            }),
            _$("div")
            .setID("fd_screen_add_nav_friends")
            .addClass("fd_screen_add_nav_text", "fd_screen_add_nav_friends")
            .addListener("click", e => {
              nav_change("friends");
            }),
            _$("div")
            .setID("fd_screen_add_nav_search")
            .addClass("fd_screen_add_nav_text", "fd_screen_add_nav_search")
            .addListener("click", e => {
              nav_change("search");
            }),
            _$("div")
            .setID("fd_settings")
            .addClass("fd_screen_add_settings", "fd_hover_active")
            .setAttribute("title", "open settings")
            .addListener("click", e => {
              if(_$.getById("fd_screen_add_list_settings").classExists("fd_screen_add_list_settings_show")) {
                nav_change(nav_focus);
              } else {
                nav_change("settings");
              }
            })
            .append(
              getSVG(svgs.settings)
            ),
            _$("div")
            .addClass("fd_screen_add_close", "fd_hover_active")
            .setAttribute("title", "close menu")
            .addListener("click", e => {
              _$.getById("fd_screen_add").removeClass("fd_screen_add_show");
            })
            .append(
              _$("span")
              .setText("+")
            )
          ),
          _$("div")
          .addClass("fd_screen_add_input")
          .append(
            _$("input")
            .setID("fd_screen_add_search")
            .setAttribute("placeholder", "type here to search...")
            .setAttribute("maxlength", "20")
            .addListener("keydown", e => {
              if(e.key == "Escape") {
                input_value[nav_focus] = "";
                e.target.value = "";
                reloadUsersList();
              }
              if(!e.key.match(/[\w\- \[\]]/)) {
                e.preventDefault();
              }
            })
            .addListener("input", e => {
              input_value[nav_focus] = e.target.value;
              if(nav_focus == "search") {
                if(e.target.getAttribute("data-interval-id")) {
                  clearInterval(Number(e.target.getAttribute("data-interval-id")));
                }
                e.target.setAttribute("data-interval-id", setTimeout(() => {
                  if(e.target.value) {
                    _$.getById("fd_screen_add_list")
                    .setText("Loading...");
                    ajax({
                      url: "https://osu.ppy.sh/home/quick-search?query=" + encodeURIComponent(e.target.value),
                      success: e => {
                        let res = e.json().user.users;
                        let res_user = [];
                        res.forEach(value => {
                          res_user.push({
                            icon: value.avatar_url,
                            name: value.username,
                            id: value.id,
                          });
                        });
                        search_data = res_user;
                        if(nav_focus == "search") {
                          reloadUsersList();
                        }
                      }
                    });
                  }
                  e.target.removeAttribute("data-interval-id");
                }, 600));
              } else {
                reloadUsersList(e.target.value);
              }
            }),
            _$("span")
            .setID("fd_screen_add_count_of_hits")
            .setText("? hits"),
            _$("div")
            .addClass("fd_screen_add_sort", "fd_hover_active")
            .setAttribute("title", "sort by")
            .append(
              getSVG(svgs.sort)
            )
            .createContextMenu([
              {
                text: "Username",
                value: "name",
                selected: true,
                default: true,
              },
              {
                text: "Recently active",
                value: "rc",
              }
            ]),
            _$("div")
            .addClass("fd_screen_add_filter", "fd_hover_active")
            .setAttribute("title", "filter")
            .append(
              getSVG(svgs.filter)
            )
            .createContextMenu([
              {
                text: "Mutual",
                value: "mt",
                removeable: true,
              },
              {
                text: "Not mutual",
                value: "nmt",
                removeable: true,
              },
              {
                text: "Not added",
                value: "nadd",
                removeable: true,
              }
            ])
          ),
          _$("div")
          .setID("fd_screen_add_list_top")
          .addClass("fd_screen_shadow", "fd_screen_add_shadow", "fd_screen_shadow_top")
          .append(
            _$("div")
          ),
          _$("div")
          .setID("fd_screen_add_list")
          .addClass("fd_screen_add_list")
          .addListener("scroll", e => {
            if(e.currentTarget.scrollTop == 0) {
              _$.getById("fd_screen_add_list_top").style.display = "none";
            } else {
              _$.getById("fd_screen_add_list_top").style.display = "block";
            }
            if(e.currentTarget.scrollTop + e.currentTarget.clientHeight >= e.currentTarget.scrollHeight - 5) {
              _$.getById("fd_screen_add_list_bottom").style.display = "none";
            } else {
              _$.getById("fd_screen_add_list_bottom").style.display = "block";
            }
          }),
          _$("div")
          .setID("fd_screen_add_list_settings")
          .addClass("fd_screen_add_list_settings")
          .append(
            _$("div")
            .addClass("fd_settings_line")
            .append(
              _$("div")
              .append(
                _$("span")
                .setText("Behavior when clicking on links:"),
                _$("div")
                .createSelectBox([
                  {
                    text: "open in current tab",
                    value: "current",
                    selected: true,
                  },
                  {
                    text: "open in new tab",
                    value: "new",
                  },
                ])
              )
            ),
            _$("div")
            .addClass("fd_settings_line")
            .append(
              _$("div")
              .append(
                _$("span")
                .setText("Update interval of online status:"),
                _$("div")
                .createSelectBox([
                  {
                    text: "30s",
                    value: "30",
                  },
                  {
                    text: "1m",
                    value: "60",
                  },
                  {
                    text: "5m",
                    value: "300",
                  },
                  {
                    text: "10m",
                    value: "600",
                  },
                  {
                    text: "Disable update",
                    value: "0",
                    selected: true,
                  }
                ])
              )
            ),
            _$("div")
            .addClass("fd_settings_line")
            .append(
              _$("div")
              .append(
                _$("span")
                .setText("Keep filter and sort values:"),
                _$("div")
                .createSelectBox([
                  {
                    text: "Yes",
                    value: "y",
                  },
                  {
                    text: "No",
                    value: "n",
                    selected: true,
                  },
                ])
              )
            ),
            _$("div")
            .addClass("fd_settings_line")
            .append(
              _$("div")
              .addClass("fd_hover_active", "fd_settings_file")
              .setText("Export as file"),
              _$("div")
              .addClass("fd_hover_active", "fd_settings_file")
              .setText("Import from file")
            ),
            _$("div")
            .addClass("fd_settings_line")
            .append(
              _$("div")
              .append(
                _$("span")
                .setText("Languages:"),
                _$("div")
                .createSelectBox([
                  {
                    text: "English",
                    value: "en",
                    selected: true,
                  },
                  {
                    text: "Japanese",
                    value: "ja",
                    disabled: true,
                  }
                ])
              ),
            ),
            _$("div")
            .addClass("fd_settings_line", "fd_settings_line_end")
            .append(
              _$("div")
              .addClass("fd_credits")
              .append(
                "v" + version + " (",
                _$("a")
                .setHref("javascript:void(0)")
                .setText("changelog")
                .setAttribute("title", "Please see the code to check changelog!"),
                ") / Created by  ",
                _$("a")
                .setHref("https://osu.ppy.sh/users/22136262")
                .setText("yuzupon1133")
              )
            )
          ),
          _$("div")
          .setID("fd_screen_add_list_bottom")
          .addClass("fd_screen_shadow", "fd_screen_add_shadow", "fd_screen_shadow_bottom")
          .append(
            _$("div")
          )
        )
      )
    );
    addStyle({
      ".fd_hidden": {
        display: "none !important",
      },
      ".fd_hover_active": {
        transition: "background-color 0.25s",
        cursor: "pointer",
      },
      ".fd_hover_active:hover": {
        backgroundColor: "#e7e7e7 !important",
      },
      ".fd_hover_active:active": {
        transition: "0s",
        backgroundColor: "#d1d1d1 !important",
      },
      ".fd_image": {
        width: "35px",
        height: "35px",
        marginRight: "10px",
      },
      ".fd_image.fd_image_loaded .fd_spinner": {
        display: "none",
      },
      ".fd_spinner": {
        width: "35px",
        height: "0px",
      },
      ".fd_spinner > div": {
        width: "35px",
        height: "35px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      ".fd_spinner > div > div": {
        width: "20px",
        height: "20px",
        display: "block",
        border: "4px solid #dddddd",
        borderTop: "4px solid white",
        borderRadius: "50%",
        animation: "fd_spinner_anime 1.0s infinite linear",
      },
      "@keyframes fd_spinner_anime": {
        "100%": { 
          transform: "rotate(360deg)",
        }
      },
      ".fd_select": {
        zIndex: "1",
        border: "black solid 2px",
        borderRadius: "5px",
        padding: "0 5px 0 10px",
        display: "flex",
        flexDirection: "column",
      },
      ".fd_contextmenu": {
        position: "relative",
      },
      ".fd_select.fd_select_open, .fd_contextmenu.fd_contextmenu_open": {
        backgroundColor: "white !important",
        zIndex: "2",
      },
      ".fd_select > .fd_selected": {
        display: "flex",
        alignItems: "center",
      },
      ".fd_contextmenu > .fd_selected": {
        display: "none",
        width: "5px",
        height: "5px",
        backgroundColor: "red",
        borderRadius: "100%",
        position: "absolute",
        right: "2px",
        top: "2px",
      },
      ".fd_contextmenu:has( .fd_option[selected]:not([data-default])) .fd_selected": {
        display: "block",
      },
      ".fd_select > .fd_selected > .fd_selected_value": {
        width: "fit-content",
        marginRight: "10px",
      },
      ".fd_select > .fd_selected > svg": {
        width: "15px",
        height: "15px",
        marginLeft: "auto",
      },
      ".fd_select > .fd_select_back, .fd_contextmenu > .fd_select_back": {
        position: "fixed", 
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        display: "none",
      },
      ".fd_select.fd_select_open > .fd_select_back, .fd_contextmenu.fd_contextmenu_open > .fd_select_back": {
        display: "block",
        cursor: "default",
      },
      ".fd_contextmenu > .fd_contextmenu_options": {
        display: "none",
        position: "absolute",
        flexDirection: "column",
        alignItems: "center",
        top: "20px",
      },
      ".fd_contextmenu .fd_contextmenu_upper": {
        backgroundColor: "white",
        width: "12px",
        height: "12px",
        transform: "rotateZ(45deg)",
        position: "relative",
        top: "7px",
        boxShadow: "grey 0 0 10px",
      },
      ".fd_select > .fd_options, .fd_contextmenu > .fd_contextmenu_options": {
        cursor: "default",
      },
      ".fd_select > .fd_options, .fd_contextmenu .fd_options": {
        flexDirection: "column",
        backgroundColor: "white",
        boxShadow: "grey 0px 8px 10px 3px",
        borderRadius: "5px",
      },
      ".fd_contextmenu .fd_options": {
        zIndex: "1",
      },
      ".fd_select > .fd_options": {
        zIndex: "1",
        display: "none",
        marginTop: "5px",
      },
      ".fd_select.fd_select_open > .fd_options, .fd_contextmenu.fd_contextmenu_open > .fd_contextmenu_options": {
        display: "flex",
      },
      ".fd_select .fd_option, .fd_contextmenu .fd_option": {
        padding: "1px 5px",
        whiteSpace: "nowrap",
      },
      ".fd_select .fd_option:first-child, .fd_contextmenu .fd_option:first-child": {
        borderRadius: "5px 5px 0 0",
      },
      ".fd_select .fd_option:last-child, .fd_contextmenu .fd_option:last-child": {
        borderRadius: "0 0 5px 5px",
      },
      ".fd_select .fd_option:not([disabled]):not([selected]), .fd_contextmenu .fd_option:not([disabled]):not([selected])": {
        cursor: "pointer",
      },
      ".fd_contextmenu .fd_option[data-removeable]": {
        cursor: "pointer !important",
      },
      ".fd_select .fd_option[disabled], .fd_contextmenu .fd_option[disabled]": {
        color: "lightgrey",
      },
      ".fd_select .fd_option[selected]:not([disabled]), .fd_contextmenu .fd_option[selected]:not([disabled])": {
        backgroundColor: "#d1d1d1",
      },
      ".fd_select .fd_option:not([selected]):not([disabled]):hover, .fd_contextmenu .fd_option:not([selected]):not([disabled]):hover": {
        backgroundColor: "#e7e7e7",
        paddingLeft: "6px",
        paddingRight: "4px",
      },
      // ---- //
      ".fd_screen": {
        position: "fixed",
        left: "-215px",
        top: "25vh",
        backgroundColor: "white",
        color: "black",
        width: "215px",
        height: "60vh",
        padding: "10px 0px 10px 5px",
        transition: "right 0.25s, left 0.25s",
        zIndex: "102",
        userSelect: "none",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      },
      ".fd_screen.fd_screen_right_side": {
        flexDirection: "row-reverse !important",
        left: "initial",
        right: "-215px",
        padding: "10px 5px 10px 0px",
      },
      ".fd_screen_buttons": {
        display: "flex",
      },
      ".fd_screen_right_side .fd_screen_buttons" : {
        flexDirection: "row-reverse",
      },
      ".fd_screen_button_edit": {
        margin: "0 5px 10px 0",
        width: "155px",
        height: "26px",
        border: "3px solid black",
        borderRadius: "7px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: "1px",
      },
      ".fd_screen_button_edit:before": {
        content: "\"edit\"",
      },
      ".fd_screen_button_position": {
        height: "26px",
        width: "26px",
        border: "solid 3px black",
        borderRadius: "5px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "15px",
        padding: "0 0 2px 1px",
      },
      ".fd_screen_right_side .fd_screen_button_position": {
        padding: "0 1px 2px 0",
      },
      ".fd_screen_button_position:before": {
        content: "\">\"",
      },
      ".fd_screen_right_side .fd_screen_button_position:before": {
        content: "\"<\"",
      },
      ".fd_screen_add_users": {
        width: "210px",
        height: "calc(60vh - 55px)",
        overflowY: "scroll",
      },
      ".fd_screen.fd_screen_right_side > .fd_screen_buttons": {
        flexDirection: "row-reverse",
      },
      ".fd_screen.fd_screen_right_side .fd_screen_buttons > .fd_screen_button_edit": {
        marginRight: "0px",
        marginLeft: "5px",
      },
      ".fd_screen.fd_screen_right_side .fd_screen_add_users": {
        direction: "rtl",
        paddingLeft: "5px",
      },
      ".fd_screen.fd_screen_right_side .fd_screen_add_users > .fd_screen_list_item": {
        direction: "ltr",
      },
      ".fd_screen_show": {
        left: "0",
      },
      ".fd_screen_show.fd_screen_right_side": {
        right: "0 !important",
      },
      ".fd_screen_open_close_button": {
        backgroundColor: "white",
        color: "black",
        width: "25px",
        height: "60px",
        fontSize: "25px",
        padding: "0 7px 4px 7px",
        borderRadius: "0 7px 7px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        cursor: "pointer",
        transition: "0.25s",
      },
      ".fd_screen_open_close_button:before, .fd_screen_show.fd_screen_right_side .fd_screen_open_close_button:before": {
        content: "\">\"",
      },
      ".fd_screen_show .fd_screen_open_close_button:before, .fd_screen_right_side .fd_screen_open_close_button:before": {
        content: "\"<\"",
      },
      ".fd_screen_right_side .fd_screen_open_close_button": {
        borderRadius: "7px 0 0 7px !important",
        justifyContent: "flex-start",
      },
      ".fd_screen_open_close_button:hover": {
        width: "35px",
      },
      // ---- //
      ".fd_screen_add": {
        height: "100vh",
        width: "100vw",
        position: "fixed",
        zIndex: "1000",
        left: "0",
        display: "none",
        alignItems: "center",
        justifyContent: "center",
        color: "black",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        userSelect: "none",
      },
      ".fd_screen_add_show": {
        display: "flex",
      },
      ".fd_screen_add > .fd_screen_add_main": {
        width: "43vw",
        height: "65vh",
        backgroundColor: "white",
        padding: "15px",
      },
      ".fd_screen_add_nav": {
        display: "flex",
        flexDirection: "row",
        marginBottom: "15px",
      },
      ".fd_screen_add_nav_text": {
        borderBottom: "grey 3px solid",
        textAlign: "center",
        transition: "width 0.25s, margin 0.25s",
        cursor: "pointer",
        paddingBottom: "2px",
      },
      ".fd_screen_add_nav_focus": {
        fontWeight: "bold",
        borderColor: "lightskyblue",
        borderWidth: "4px",
      },
      ".fd_screen_add_nav_users": {
        width: "80px",
        margin: "0 15px 0 5px",
      },
      ".fd_screen_add_nav_users:before": {
        content: "\"Users List\"",
      },
      ".fd_screen_add_nav_users:hover": {
        width: "90px",
        margin: "0 10px 0 0",
      },
      ".fd_screen_add_nav_friends": {
        width: "60px",
        margin: "0 15px 0 5px",
      },
      ".fd_screen_add_nav_friends:before": {
        content: "\"Friends\"",
      },
      ".fd_screen_add_nav_friends:hover": {
        width: "70px",
        margin: "0 10px 0 0",
      },
      ".fd_screen_add_nav_search": {
        width: "100px",
        margin: "0 5px",
      },
      ".fd_screen_add_nav_search:before": {
        content: "\"Search user\"",
      },
      ".fd_screen_add_nav_search:hover": {
        width: "110px",
        margin: "0",
      },
      ".fd_screen_add_settings": {
        height: "27px",
        width: "27px",
        marginLeft: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "5px",
      },
      ".fd_screen_add_settings > svg": {
        fill: "black",
        width: "15px",
      },
      ".fd_settings_line": {
        width: "100%",
        height: "23px",
        marginBottom: "10px",
        display: "flex",
        flexDirection: "row",
        gap: "5px",
      },
      ".fd_settings_line span": {
        userSelect: "text",
      },
      ".fd_settings_line_end": {
        marginTop: "auto",
      },
      ".fd_settings_line > div": {
        display: "flex",
        width: "fit-content",
        gap: "5px",
      },
      ".fd_credits": {
        height: "fit-content",
        marginLeft: "auto",
      },
      ".fd_screen_add_close": {
        height: "27px",
        width: "27px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "5px",
        marginLeft: "10px",
      },
      ".fd_screen_add_close > span": {
        transform: "rotate(45deg)",
        fontSize: "31px",
        position: "relative",
        top: "-2px",
        left: "2px",
      },
      ".fd_screen_add_input": {
        marginBottom: "15px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
      },
      ".fd_screen_add_input > input": {
        borderLeft: "#555 solid 2px",
        borderTop: "#555 solid 2px",
        borderRight: "#999 solid 2px",
        borderBottom: "#999 solid 2px",
        width: "calc(43vw - 355px)",
        minWidth: "182px",
        height: "30px",
        fontSize: "14px",
        padding: "0 10px",
        borderRadius: "5px",
      },
      ".fd_screen_add_input > input:focus": {
        outline: "none",
        borderColor: "black",
      },
      ".fd_screen_add_input > input[disabled]": {
        cursor: "not-allowed !important",
        backgroundColor: "#f5f5f5",
      },
      ".fd_screen_add_input > span": {
        marginLeft: "15px",
      },
      ".fd_screen_add_input:has(> input[disabled]) #fd_screen_add_count_of_hits": {
        display: "none",
      },
      ".fd_screen_add_sort": {
        borderRadius: "5px",
        width: "27px",
        height: "27px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: "auto",
      },
      ".fd_screen_add_sort > svg": {
        fill: "black",
        width: "15px",
      },
      ".fd_screen_add_filter": {
        borderRadius: "5px",
        width: "27px",
        height: "27px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: "10px",
        marginRight: "15px",
      },
      ".fd_screen_add_filter > svg": {
        fill: "black",
        width: "15px",
      },
      ".fd_screen_add_list": {
        height: "calc(65vh - 120px)",
        width: "calc(43vw - 25px)",
        paddingRight: "15px",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignContent: "flex-start",
        overflowY: "scroll",
      },
      ".fd_screen_add_list_settings": {
        backgroundColor: "white",
        height: "calc(65vh - 120px)",
        width: "calc(43vw - 25px)",
        paddingRight: "15px",
        position: "relative",
        bottom: "calc(65vh - 120px)",
        display: "none",
        flexDirection: "column",
        overflowY: "scroll",
      },
      ".fd_screen_add_list_settings .fd_settings_file": {
        border: "black solid 2px",
        borderRadius: "5px",
        backgroundColor: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "10px",
      },
      ".fd_screen_add_list_settings_show": {
        display: "flex",
      },
      ".fd_screen_shadow": {
        display: "none",
        height: "0",
        position: "relative",
      },
      ".fd_screen_shadow > div": {
        height: "25px",
        width: "calc(100% - 17px)",
        pointerEvents: "none",
        position: "relative",
      },
      ".fd_screen_right_side .fd_screen_shadow": {
        left: "16px",
      },
      ".fd_screen_add_shadow > div": {
        width: "calc(43vw - 42px)",
      },
      ".fd_screen_shadow_top > div": {
        background: "linear-gradient(rgba(0, 0, 0, 0.05), #00000000)",
      },
      ".fd_screen_shadow_bottom > div": {
        background: "linear-gradient(#00000000, rgba(0, 0, 0, 0.05))",
        top: "-25px",
      },
      // ---- //
      ".fd_screen a, .fd_screen_add a": {
        userSelect: "text",
      },
      ".fd_list_item": {
        marginBottom: "7px",
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        height: "35px",
      },
      ".fd_list_item img": {
        width: "35px",
        height: "35px",
        marginRight: "10px",
        position: "relative",
      },
      ".fd_screen_add_list_item": {
        width: "280px",
      },
      ".fd_screen_add_list_item > a": {
        display: "flex",
        alignItems: "center",
        width: "190px",
        height: "100%",
        marginRight: "15px",
      },
      ".fd_screen_add_list_item > .fd_sort_button": {
        width: "25px",
        height: "25px",
        marginRight: "5px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: "0",
      },
      ".fd_screen_add_list_item > .fd_add_delete_button": {
        border: "solid 2px grey",
        height: "30px",
        width: "30px",
        borderRadius: "5px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "20px",
        paddingBottom: "3px",
        flexShrink: "0",
      },
      ".fd_screen_add_list_item > .fd_add_delete_button.fd_add": {
        borderColor: "red",
      },
      ".fd_screen_add_list_item > .fd_add_delete_button:before": {
        content: "\"+\"",
      },
      ".fd_screen_add_list_item > .fd_add_delete_button.fd_add:before": {
        content: "\"-\"",
      },
      ".fd_screen_list_item > a": {
        display: "flex",
        alignItems: "center",
        height: "100%",
        width: "115px",
      },
      ".fd_screen_list_item > a > span, .fd_screen_add_list_item > a > span": {
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflowX: "hidden",
      },
      ".fd_screen_list_item > .fd_status": {
        width: "25px",
        height: "25px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: "auto",
      },
      ".fd_screen_list_item > .fd_status > div" : {
        width: "10px",
        height: "10px",
        borderRadius: "9999px",
        backgroundColor: "black",
      },
      ".fd_status_online": {
        backgroundColor: "lime !important",
      },
      ".fd_status_offline": {
        backgroundColor: "red !important",
      },
      ".fd_status_hidden": {
        backgroundColor: "orange !important",
      },
      ".fd_error_box": {
        position: "fixed",
        bottom: "10px",
        right: "10px",
        width: "200px",
        backgroundColor: "black",
        color: "white",
        zIndex: "99999",
        border: "red 2px solid",
        padding: "7px",
        borderRadius: "5px",
        fontSize: "14px",
      },
      ".fd_error_box:hover": {
        backgroundColor: "#3e3e3e",
      },
      /* Future remove */
      ".fd_notice": {
        zIndex: "5",
        position: "absolute",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        userSelect: "text",
      },
      ".fd_notice > div": {
        width: "31vw",
        height: "31vh",
        backgroundColor: "white",
        boxShadow: "grey 5px 5px 20px 10px",
        padding: "15px",
        borderRadius: "10px",
      },
      ".fd_notice-1": {
        fontSize: "22px",
        marginBottom: "12px",
      },
      ".fd_notice-2": {
        fontSize: "17px",
        marginBottom: "25px",
        maxHeight: "calc(31vh - 115px)",
        overflowY: "auto",
      },
      ".fd_notice-3": {
        marginLeft: "auto",
        width: "fit-content",
        userSelect: "none",
        display: "block",
        whiteSpace: "nowrap",
      },
      /* ------------- */
    });
    reloadUsersList();
    reloadAddUsersList();
  } else {
    if(!_$.getById("fd_screen").fd_event) {
      _$.getById("fd_screen").remove();
      _$.getById("fd_screen_add").remove();
      body_append();
    }
  }
}
body_append();
setInterval(body_append, 1000);

// _$("div")
// .setText("An error occured! Please check the console.")
// .addClass("fd_error_box")
// .addListener("click", e => {
//   e.currentTarget.remove();
// });

}();
