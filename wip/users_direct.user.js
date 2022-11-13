// ==UserScript==
// @name            users_direct
// @namespace       https://osu.ppy.sh/users/22136262
// @downloadURL     https://raw.githubusercontent.com/yuzupon1133/osu-tools/main/wip/users_direct.user.js
// @updateURL       https://raw.githubusercontent.com/yuzupon1133/osu-tools/main/wip/users_direct.user.js
// @version         0.6
// @description:ja  どのページからでも瞬時にユーザーページに移動
// @description     Quickly jump to a user page from any page
// @author          yuzupon1133
// @match           https://osu.ppy.sh/*
// @exclude         https://osu.ppy.sh/ss/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=ppy.sh
// @grant           none
// ==/UserScript==

// Attention! If the window size is less than 770px * 310px, the layout will be broken, but I don't intend to fix this.

// > what's new in version 0.6 <
// - made major code changes to improve the readability of the code.
// - moved most strings to css "content" property.
// - shadow has been added to the another item list (experimental).
// - element position can now be moved left-side or right-side.
// - focus on input element when navigation button is pressed.
// https://github.com/yuzupon1133/osu-tools/blob/main/wip/users_direct.user.js

// > what's new in version 0.5 <
// - minor style changes.
// - added display of search hit counts.
// - shadow has been added to the item list (experimental).
// - fixed z-index problem.
// - search is now available for userID.
// https://github.com/yuzupon1133/osu-tools/blob/b9d53d464e51393a03c83e06ae98f67b3cdd1163/wip/users_direct.user.js

// > what's new in version 0.4 <
// - fixed a problem that prevented scripts from working when the back button was pressed.
// - hide navigation when open screenshot preview (osu.ppy.sh/ss/).
// - fixed z-index problem.
// https://github.com/yuzupon1133/osu-tools/blob/141dd494693aec71266a06ff077f209d9a9fdd38/wip/users_direct.user.js

// > what's new in version 0.3 <
// - press escape key on input element to now deletes all characters.
// - fixed some bugs.
// - changed some wording.
// - changed item layout to two columns.
// https://github.com/yuzupon1133/osu-tools/blob/909886502873f45510616411e9d46ab03b9c9698/wip/users_direct.user.js

// > what's new in version 0.2 <
// - fixed z-index problem.
// - added online/offline status (this is only for user you have added as friends).
// - the mechanism for retrieving friend info has changed.
// https://github.com/yuzupon1133/osu-tools/blob/191d9b63bb724036c75a0a41b8d1d94d16a33924/wip/users_direct.user.js

// > version 0.1 <
// https://github.com/yuzupon1133/osu-tools/blob/ef510c0e4fdff4ec5ecb208d719285d707bf3ac2/wip/users_direct.user.js

(() => {
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
  return undefined;
}
const originalAppend = Element.prototype.append;
Element.prototype.append = function(...nodes) {
  originalAppend.call(this, ...nodes);
  return this;
}
const originalSetAttribute = Element.prototype.setAttribute;
Element.prototype.setAttribute = function(qualifiedName, value) {
  originalSetAttribute.call(this, qualifiedName, value);
  return this;
}
String.prototype.addRegExpEscape = function() {
  return this.replace(/([\*\.\+\?\|\{\}\(\)\[\]\^\$\-])/g, "\\$1");
}
String.prototype.toCamelCase = function(sep) {
  return this.replace(new RegExp("(" + (sep ? sep.addRegExpEscape() : "-") + "[a-z])", "g"), match => {
    return match.charAt(sep ? sep.length : 1).toUpperCase();
  });
}
String.prototype.toSnakeCase = function(sep) {
  return this.replace(/[A-Z]/g, match => {
    return (sep || "-") + match.toLowerCase();
  });
}
function ObjectStyleToString(styles) {
  let styleList = [];
  for(let propety in styles) {
    styleList.push("    " + propety.toSnakeCase() + ": " + styles[propety] + ";");
  }
  return styleList.join("\n");
}
Element.prototype.setText = function(text) {
  this.textContent = text;
  return this;
}
Element.prototype.getText = function() {
  return this.textContent;
}
Element.prototype.setHTML = function(DOMString) {
  this.innerHTML = DOMString || "";
  return this;
}
function _$(nodename) {
  if(type(nodename) != "string") throw Error;
  return document.createElement(nodename);
}
_$.getById = function(id) {
  return document.getElementById(id);
}
_$.getByName = function(name) {
  return document.getElementsByName(name);
}
_$.getByTagName = function(tagName) {
  return document.getElementsByTagName(tagName);
}
_$.getByQuery = function(query) {
  return document.querySelector(query);
}
_$.getByQueryAll = function(query) {
  return document.querySelectorAll(query);
}
_$.getCookie = function(name) {
  let cookies = new Object();
  if(!document.cookie) return cookies;
  document.cookie.split("; ").forEach(value => {
    let parts = value.split("=");
    cookies[parts[0]] = decodeURIComponent(parts.slice(1).join('='));
  });
  return name ? cookies[name] || undefined : cookies;
}
_$.setCookie = function(name, value, attributes) {
  document.cookie = name + "=" + encodeURIComponent(value) + "; " + attributes;
}
_$.removeCookie = function(name) {
  _$.setCookie(name, null, "max-age=0;");
}
function addStyle(styles) {
  let classesList = [];
  for(let name in styles) {
    classesList.push(name + " {\n" + ObjectStyleToString(styles[name]) + "\n}\n");
  }
  if(_$.getById("fd_styles")) {
    _$.getById("fd_styles")
    .append(
      _$("style")
      .setText(classesList.join(""))
    );
  } else {
    document.body.append(
      _$("div")
      .setID("fd_styles")
      .append(
        _$("style")
        .setText(classesList.join(""))
      )
    );
  }
  return this;
}
Element.prototype.addListener = function(type, listener, options) {
  Element.prototype.addEventListener.call(this, type, listener, options);
  return this;
}
Element.prototype.addClass = function(...classes) {
  if(classes.length) {
    for(let item of classes) {
      if(item) this.classList.add(item);
    }
  }
  return this;
}
Element.prototype.removeClass = function(...classes) {
  if(classes.length) {
    for(let item of classes) {
      if(item) this.classList.remove(item);
    }
  }
  return this;
}
Element.prototype.toggleClass = function(...classes) {
  if(classes.length) {
    for(let item of classes) {
      if(item) this.classList.toggle(item);
    }
  }
  return this;
}
Element.prototype.classExists = function(className) {
  return this.classList.contains(className);
}
Element.prototype.setAttributes = function(att) {
  for(let name in att) {
    this.setAttribute(name, att[name]);
  }
  return this;
}
Element.prototype.setID = function(id) {
  this.setAttribute("id", id);
  return this;
}
HTMLCollection.prototype.forEach = function(fn) {
  for(let i = 0; i < this.length; i++) {
    fn(this[i], i, this);
  }
}
Element.prototype.tagFilter = function(tagName) {
  let childNodes = [];
  this.children.forEach(value => {
    if(value.tagName == tagName.toUpperCase()) {
      childNodes.push(value);
    }
  });
  return childNodes;
}
Element.prototype.removeAllChildren = function() {
  while(this.firstChild) {
    this.removeChild(this.firstChild);
  }
  return this;
}
Element.prototype.removeAllNodes = function() {
  this.innerHTML = "";
  return this;
}
Element.prototype.forEachNodes = function(fn) {
  this.childNodes.forEach(fn);
  return this;
}
Element.prototype.setSrc = function(src) {
  this.src = src;
  return this;
}
Element.prototype.setHref = function(href) {
  this.href = href;
  return this;
}
_$.if = function(cond, node1, node2) {
  if(cond) {
    return node1;
  } else {
    return node2;
  }
}
_$.or = function(cond1, cond2, node1, node2) {
  if(cond1 || cond2) {
    return node1;
  } else {
    return node2;
  }
}
_$.and = function(cond1, cond2, node1, node2) {
  if(cond1 && cond2) {
    return node1;
  } else {
    return node2;
  }
}
Element.prototype.do = function(func) {
  func(this);
  return this;
}
function setLocal(name, value) {
  if(type(value) == "object" || type(value) == "array") {
    value = JSON.stringify(value);
  }
  localStorage.setItem(name, value);
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
  if(type(value) == "object" | type(value) == "array") {
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


let add_users = [];
if(getLocal("fd_add_users")) {
  add_users = getLocal("fd_add_users", true);
}
window.addEventListener("beforeunload", e => {
  removeSession("fd_load_friends");
  removeSession("fd_nav_focus");
  removeSession("fd_search_users");
  removeSession("fd_value_users");
  removeSession("fd_value_friends");
  removeSession("fd_value_search");
});

let is_friends_loaded = false
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
    setSession("fd_load_friends", friends);
    reloadFriendsList(getSession("fd_value_friends"));
  }
});

function getNavFocustUserList() {
  if(getSession("fd_nav_focus") == "users") {
    return getLocal("fd_add_users", true);
  } else if(getSession("fd_nav_focus") == "friends") {
    return getSession("fd_load_friends", true);
  } else if(getSession("fd_nav_focus") == "search") {
    return getSession("fd_search_users", true);
  }
  return undefined;
}
function getNowSearchQuery() {
  if(getSession("fd_nav_focus") == "users") {
    return getSession("fd_value_users");
  } else if(getSession("fd_nav_focus") == "friends") {
    return getSession("fd_value_friends");
  } else if(getSession("fd_nav_focus") == "search") {
    return getSession("fd_value_search");
  }
  return undefined;
}
function getDateOffset(date) {
  let offset = (new Date().getTime() - new Date(date).getTime()) / 1000;
  if(Number.isNaN(offset) || offset <= 0) {
    return "now";
  }
  if(offset < 60) {
    return offset + " second(s) ago";
  }
  offset =  offset / 60 | 0;
  if(offset < 60) {
    return offset + " minute(s) ago";
  }
  offset =  offset / 60 | 0;
  if(offset < 24) {
    return offset + " hour(s) ago";
  }
  offset = offset / 24 | 0;
  if(offset < 30) {
    return offset + " day(s) ago";
  }
  if(offset < 365) {
    return (offset / 30 | 0) + " month(s) ago";
  } else {
    return (offset / 365 | 0) + " year(s) ago";
  }
}
function findUserFromId(id) {
  if(!is_friends_loaded) return null;
  for(let value of getSession("fd_load_friends", true)) {
    if(value.id == id) {
      return value;
    }
  }
  return null;
}
function reloadFriendsList(query) {
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
    _$.getById("fd_screen_add_list").setHTML();
    _$.getById("fd_screen_add_list").append(
      ...users_list.map(value => {
        return _$("div")
        .addClass("fd_list_item", "fd_screen_add_list_item")
        .append(
          _$("img")
          .setSrc(value.icon),
          _$("a")
          .setHref("https://osu.ppy.sh/u/" + value.id)
          .setAttribute("rel", "nofollow")
          .append(
            _$("span")
            .setText(value.name)
          ),
          _$("div")
          .addClass("fd_hover_active", value.add ? "fd_add" : null)
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
    if(getSession("fd_nav_focus") == "friends") {
      _$.getById("fd_screen_add_list").setText("Loading, this may take a couple seconds (if this message does not disappear, an error may have occurred).");
    } else if(getSession("fd_nav_focus") == "search") {
      _$.getById("fd_screen_add_count_of_hits").setText("? hits");
      _$.getById("fd_screen_add_list").setText("Type to search user");
    } else {
      _$.getById("fd_screen_add_list").setText("An error may have occurred, please check the console.");
    }
  }
  if(add_users.length) {
    _$.getById("fd_screen_add_users").setHTML();
    _$.getById("fd_screen_add_users").append(
      ...add_users.map(value => {
        let status = findUserFromId(value.id);
        return _$("div")
        .addClass("fd_list_item", "fd_screen_list_item")
        .append(
          _$("img")
          .setSrc(value.icon),
          _$("a")
          .setHref("https://osu.ppy.sh/u/" + value.id)
          .setAttribute("rel", "nofollow")
          .append(
            _$("span")
            .setText(value.name)
          ),
          _$("div")
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
    reloadFriendsList(getNowSearchQuery());
  } else {
    for(let i = 0; i < add_users.length; i++) {
      if(add_users[i].id == user.id) {
        add_users.splice(i, 1);
        setLocal("fd_add_users", add_users);
        reloadFriendsList(getNowSearchQuery());
        break;
      }
    }
  }
}
function nav_change(type) {
  if(type == "users" && getSession("fd_nav_focus") != "users") {
    setSession("fd_nav_focus", "users");
    _$.getById("fd_screen_add_search").value = getSession("fd_value_users") || null;
    _$.getById("fd_screen_add_nav_users").addClass("fd_screen_add_nav_focus");
    _$.getById("fd_screen_add_nav_friends").removeClass("fd_screen_add_nav_focus");
    _$.getById("fd_screen_add_nav_search").removeClass("fd_screen_add_nav_focus");
    
    if(add_users.length == 0) {
      _$.getById("fd_screen_add_list").setText("Nothing added yet!");
    } else {
      reloadFriendsList(getSession("fd_value_users"));
    }
  } else if(type == "friends" && getSession("fd_nav_focus") != "friends") {
    setSession("fd_nav_focus", "friends");
    _$.getById("fd_screen_add_search").value = getSession("fd_value_friends") || null;
    _$.getById("fd_screen_add_nav_users").removeClass("fd_screen_add_nav_focus");
    _$.getById("fd_screen_add_nav_friends").addClass("fd_screen_add_nav_focus");
    _$.getById("fd_screen_add_nav_search").removeClass("fd_screen_add_nav_focus");
    
    reloadFriendsList(getSession("fd_value_friends"));
  } else if(type == "search" && getSession("fd_nav_focus") != "search") {
    setSession("fd_nav_focus", "search");
    _$.getById("fd_screen_add_search").value = getSession("fd_value_search") || null;
    _$.getById("fd_screen_add_nav_users").removeClass("fd_screen_add_nav_focus");
    _$.getById("fd_screen_add_nav_friends").removeClass("fd_screen_add_nav_focus");
    _$.getById("fd_screen_add_nav_search").addClass("fd_screen_add_nav_focus");
    
    reloadFriendsList();
  }
  _$.getById("fd_screen_add_search").focus();
}

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
              setLocal("fd_position", (getLocal("fd_position") == "right" ? "left" : "right"));
              e.currentTarget
              .setAttribute("title", "Move the position to " + getLocal("fd_position") + "-side.")
              _$.getById("fd_screen").toggleClass("fd_screen_right_side");
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
        _$("div")
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
            .addClass("fd_screen_add_close", "fd_hover_active")
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
                if(getSession("fd_nav_focus") == "users") {
                  setSession("fd_value_users", "");
                } else if(getSession("fd_nav_focus") == "friends") {
                  setSession("fd_value_friends", "");
                } else if(getSession("fd_nav_focus") == "search") {
                  setSession("fd_value_search", "");
                }
                e.target.value = "";
                reloadFriendsList();
              }
              if(!e.key.match(/[\w\-\[\]]/)) {
                e.preventDefault();
              }
            })
            .addListener("input", e => {
              if(getSession("fd_nav_focus") == "users") {
                setSession("fd_value_users", e.target.value);
                reloadFriendsList(e.target.value);
              } else if(getSession("fd_nav_focus") == "friends") {
                setSession("fd_value_friends", e.target.value);
                reloadFriendsList(e.target.value);
              } else if(getSession("fd_nav_focus") == "search") {
                setSession("fd_value_search", e.target.value);
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
                        setSession("fd_search_users", JSON.stringify(res_user));
                        if(getSession("fd_nav_focus") == "search") {
                          reloadFriendsList();
                        }
                      }
                    });
                  }
                  e.target.removeAttribute("data-interval-id");
                }, 400));
              }
            }),
            _$("span")
            .setID("fd_screen_add_count_of_hits")
            .setText("? hits")
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
          .setID("fd_screen_add_list_bottom")
          .addClass("fd_screen_shadow", "fd_screen_add_shadow", "fd_screen_shadow_bottom")
          .append(
            _$("div")
          )
        )
      )
    )
    addStyle({
      ".fd_hover_active": {
        transition: "0.25s",
        cursor: "pointer",
      },
      ".fd_hover_active:hover": {
        backgroundColor: "#e7e7e7 !important",
      },
      ".fd_hover_active:active": {
        backgroundColor: "#d1d1d1 !important",
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
        transition: "0.25s",
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
        padding: "0 0 1px 0",
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
      ".fd_screen_add > div": {
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
        transition: "0.25s",
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
      ".fd_screen_add_close": {
        height: "27px",
        width: "27px",
        marginLeft: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "5px",
        transition: "0.25s",
        cursor: "pointer",
      },
      ".fd_screen_add_close > span": {
        transform: "rotate(45deg)",
        fontSize: "24px",
        position: "relative",
        top: "-1.5px",
        left: "2px",
      },
      ".fd_screen_add_input": {
        marginBottom: "15px",
        width: "fit-content",
      },
      ".fd_screen_add_input > input": {
        width: "calc(43vw - 355px)",
        minWidth: "182px",
        height: "30px",
        fontSize: "14px",
        padding: "0 10px",
        borderRadius: "5px",
      },
      ".fd_screen_add_input > span": {
        marginLeft: "15px",
      },
      ".fd_screen_add_list": {
        overflowY: "auto",
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
      ".fd_list_item": {
        marginBottom: "7px",
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        height: "35px",
      },
      ".fd_list_item > img": {
        width: "35px",
        height: "35px",
        marginRight: "10px",
      },
      ".fd_screen_add_list_item > a": {
        display: "flex",
        alignItems: "center",
        width: "200px",
        height: "100%",
        marginRight: "5px",
      },
      ".fd_screen_add_list_item > div": {
        border: "solid 2px grey",
        height: "30px",
        width: "30px",
        borderRadius: "5px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "20px",
        paddingBottom: "3px",
      },
      ".fd_screen_add_list_item > div.fd_add": {
        borderColor: "red",
      },
      ".fd_screen_add_list_item > div:before": {
        content: "\"+\"",
      },
      ".fd_screen_add_list_item > div.fd_add:before": {
        content: "\"-\"",
      },
      ".fd_screen_list_item > a": {
        display: "flex",
        alignItems: "center",
        height: "100%",
        width: "110px",
      },
      ".fd_screen_list_item > a > span, .fd_screen_add_list_item > a > span": {
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflowX: "hidden",
      },
      ".fd_screen_list_item > div": {
        width: "25px",
        height: "25px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: "auto",
      },
      ".fd_screen_list_item > div > div" : {
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
      }
    });
    reloadFriendsList();
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
// .setStyle({
//   position: "fixed",
//   bottom: "10px",
//   right: "10px",
//   width: "200px",
//   backgroundColor: "black",
//   color: "white",
//   zIndex: "99999",
//   border: "red 2px solid",
//   padding: "7px",
//   borderRadius: "5px",
//   fontSize: "14px",
//   cursor: "pointer",
//   transition: "0.25s",
// }, true)
// .setHoverStyle({
//   backgroundColor: "#3e3e3e",
// })
// .addListener("click", e => {
//   e.currentTarget.remove();
// });

})();
