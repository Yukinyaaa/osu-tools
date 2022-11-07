// ==UserScript==
// @name            users_direct
// @namespace       https://osu.ppy.sh/users/22136262
// @downloadURL     https://raw.githubusercontent.com/yuzupon1133/osu-tools/main/wip/users_direct.js
// @updateURL       https://raw.githubusercontent.com/yuzupon1133/osu-tools/main/wip/users_direct.js
// @version         0.2
// @description:ja  どのページからでも瞬時にユーザーページに移動
// @description     Quickly jump to a user page from any page
// @author          yuzupon1133
// @match           https://osu.ppy.sh/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=ppy.sh
// @grant           none
// ==/UserScript==

// > what's new in version 0.2 <
// - fixed z-index problem.
// - added online/offline status (this is only for user you have added as friends).
// - the mechanism for retrieving friend info has changed.

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
    styleList.push(propety.toSnakeCase() + ":" + styles[propety]);
  }
  return styleList.join(";");
}
function createUUID() { // https://mebee.info/2022/07/19/post-61487/
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, a => {
    let r = (new Date().getTime() + Math.random() * 16) % 16 | 0;
    let v = a == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
Element.prototype.setUUID = function() {
  this.uuid = createUUID();
  return this;
}
Element.prototype.isUUIDExists = function() {
  let hex = "[0-9a-f]";
  return !!this.uuid && !!this.uuid.match(new RegExp(`${hex}{8}-${hex}{4}-4${hex}{3}-[89ab]${hex}{3}-${hex}{12}`));
}
Element.prototype.getUUID = function() {
  return this.uuid;
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
Element.prototype.addStyle = function(styles) {
  let classesList = [];
  for(let name in styles) {
    classesList.push(name + "{" + ObjectStyleToString(styles[name]) + "}");
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
function addStyle(styles) {
  document.body.addStyle(styles);
}
Element.prototype.setStyle = function(styles, defineOnStyle) {
  if(type(styles) != "object") throw Error();
  if(defineOnStyle) {
    this.setPseudoStyle("", styles);
  } else {
    for(let propety in styles) {
      this.style[propety.toCamelCase()] = styles[propety];
    }
  }
  return this;
}
Element.prototype.setPseudoStyle = function(pseudo, styles) {
  if(type(styles) != "object") throw Error();
  if(!this.isUUIDExists()) {
    this.setUUID();
  }
  this.setAttribute("data-identify", this.getUUID());
  if(_$.getById("fd_styles")) {
    _$.getById("fd_styles")
    .append(
      _$("style")
      .setText(`*[data-identify="${this.getUUID()}"]${pseudo}{${ObjectStyleToString(styles)}}`)
    );
  } else {
    document.body.append(
      _$("div")
      .setID("fd_styles")
      .append(
        _$("style")
        .setText(`*[data-identify="${this.getUUID()}"]${pseudo}{${ObjectStyleToString(styles)}}`)
      )
    );
  }
  return this;
}
Element.prototype.setHoverStyle = function(styles) {
  this.setPseudoStyle(":hover", styles);
  return this;
}
Element.prototype.setActiveStyle = function(styles) {
  this.setPseudoStyle(":active", styles);
  return this;
}
Element.prototype.addListener = function(type, listener, options) {
  Element.prototype.addEventListener.call(this, type, listener, options);
  return this;
}
Element.prototype.addClass = function(...classes) {
  if(classes.length) {
    for(let item of classes) {
      this.classList.add(item);
    }
  }
  return this;
}
Element.prototype.removeClass = function(...classes) {
  if(classes.length) {
    for(let item of classes) {
      this.classList.remove(item);
    }
  }
  return this;
}
Element.prototype.toggleClass = function(...classes) {
  if(classes.length) {
    for(let item of classes) {
      this.classList.toggle(item);
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
function setLocal(name, value) {
  if(type(value) == "object" || type(value) == "array") {
    value = JSON.stringify(value);
  }
  localStorage.setItem(name, value);
}
function getLocal(name, json) {
  let value = localStorage.getItem(name);
  if(json) {
    value = JSON.parse(value);
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
    value = JSON.parse(value);
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
  removeSession("fd_load_users");
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
    console.log(friends);
    setSession("fd_load_users", friends);
    reloadFriendsList(getSession("fd_value_friends"));
  }
});

function getNavFocustUserList() {
  if(getSession("fd_nav_focus") == "users") {
    if(getLocal("fd_add_users")) {
      return getLocal("fd_add_users", true);
    }
  } else if(getSession("fd_nav_focus") == "friends") {
    if(getSession("fd_load_users")) {
      return getSession("fd_load_users", true);
    }
  } else if(getSession("fd_nav_focus") == "search") {
    if(getSession("fd_search_users")) {
      return getSession("fd_search_users", true);
    }
  }
  return [];
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
  for(let value of getSession("fd_load_users", true)) {
    if(value.id == id) {
      return value;
    }
  }
  return null;
}
function reloadFriendsList(query) {
  let users_list = getNavFocustUserList();
  if(users_list != undefined) {
    let added_id = [];
    for(let value of add_users) {
      added_id.push(value.id);
    }
    users_list = users_list.filter(value => {
      value.add = added_id.includes(value.id);
      if(query) {
        return value.name.toLowerCase().indexOf(query.toLowerCase()) != -1;
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
          .setText(value.name),
          _$("div")
          .addClass(value.add ? "fd_add" : null)
          .setAttribute("data-list-item-json", JSON.stringify({
            icon: value.icon,
            name: value.name,
            id: value.id,
          }))
          .addListener("click", e => {
            friend_toggle(e.currentTarget);
          })
          .setAttribute("title", !value.add ? "Add to list" : "Remove from list")
          .append(
            _$("span")
            .setText(!value.add ? "+" : "-")
          )
        )
      })
    );
    if(users_list.length == 0) {
      _$.getById("fd_screen_add_list").setText("No results!");
    }
  } else {
    if(getSession("fd_nav_focus") == "friends") {
      _$.getById("fd_screen_add_list").setText("Loading, this may take a couple seconds (if this message does not disappear, an error may have occurred).");
    } else {
      _$.getById("fd_screen_add_list").setText("An error may have occurred, please check the console.");
    }
  }
  if(add_users.length) {
    _$.getById("add_users").setHTML();
    _$.getById("add_users").append(
      ...add_users.map(value => {
        let status = findUserFromId(value.id);
        return _$("div")
        .addClass("fd_list_item", "fd_screen_list_item")
        .append(
          _$("img")
          .setSrc(value.icon),
          _$("a")
          .setHref("https://osu.ppy.sh/u/" + value.id)
          .setText(value.name),
          _$("div")
          .setAttribute("title", (() => {
            if(is_friends_loaded) {
              if(status) {
                console.log(status.online);
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
    _$.getById("add_users").setText("Click \"edit\" to add users!")
  }
}
function friend_toggle(e) {
  if(!e.classExists("fd_add")) {
    let user = JSON.parse(e.getAttribute("data-list-item-json"));
    for(let i = 0; i < add_users.length; i++) {
      if(add_users[i].id == user.id) {
        reloadFriendsList();
        return;
      }
    }
    add_users.push(user);
    setLocal("fd_add_users", add_users);
    reloadFriendsList();
  } else {
    let user = JSON.parse(e.getAttribute("data-list-item-json"));
    for(let i = 0; i < add_users.length; i++) {
      if(add_users[i].id == user.id) {
        add_users.splice(i, 1);
        setLocal("fd_add_users", add_users);
        reloadFriendsList();
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
}

function body_append() {
  if(!_$.getById("fd_screen")) {
    document.body.append(
      _$("div")
      .setStyle({
        position: "fixed",
        left: "-215px",
        top: "25vh",
        backgroundColor: "white",
        color: "black",
        width: "215px",
        height: "60vh",
        padding: "10px 5px",
        overflowY: "scroll",
        transition: "0.25s",
        zIndex: "99",
        userSelect: "none",
      }, true)
      .setID("fd_screen")
      .addStyle({
        ".fd_screen_show": {
          left: "0",
        }
      })
      .append(
        _$("div")
        .addStyle({
          ".fd_screen_button": {
            marginBottom: "10px",
            height: "26px",
            border: "3px solid black",
            borderRadius: "7px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "0.25s",
            cursor: "pointer",
          }
        }, true)
        .addClass("fd_screen_button")
        .setHoverStyle({
          backgroundColor: "#e7e7e7",
        })
        .setActiveStyle({
          backgroundColor: "#d1d1d1",
        })
        .addListener("click", e => {
          _$.getById("fd_screen_add").addClass("fd_screen_add_show");
          nav_change("friends");
        })
        .append(
          _$("span")
          .setText("edit")
          .setStyle({
            height: "fit-content",
            fontSize: "15px",
            position: "relative",
            top: "-1px",
          })
        ),
        _$("div")
        .setID("add_users")
      ),
      _$("div")
      .setStyle({
        position: "fixed",
        left: "0",
        top: "50vh",
        backgroundColor: "white",
        color: "black",
        width: "25px",
        height: "60px",
        borderRadius: "0 7px 7px 0",
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        transition: "0.25s",
        zIndex: "999",
        userSelect: "none",
      }, true)
      .setHoverStyle({
        width: "35px",
      })
      .setID("fd_button")
      .addStyle({
        ".fd_button_show": {
          left: "215px",
        }
      })
      .addListener("click", e => {
        _$.getById("fd_screen").toggleClass("fd_screen_show");
        _$.getById("fd_button").toggleClass("fd_button_show");
        _$.getById("fd_button").tagFilter("span")[0].setText(_$.getById("fd_button").tagFilter("span")[0].getText() == ">" ? "<" : ">");
      })
      .append(
        _$("span")
        .setStyle({
          height: "fit-content",
          position: "relative",
          top: "-3px",
          fontSize: "25px",
          marginLeft: "auto",
          marginRight: "7px",
        })
        .setText(">")
      ),
      _$("div")
      .setStyle({
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
      }, true)
      .addStyle({
        ".fd_screen_add_show": {
          display: "flex",
        }
      })
      .setID("fd_screen_add")
      .append(
        _$("div")
        .setStyle({
          width: "55vw",
          height: "65vh",
          backgroundColor: "white",
          padding: "15px",
        })
        .append(
          _$("div")
          .setStyle({
            display: "flex",
            flexDirection: "row",
            marginBottom: "15px",
          })
          .append(
            _$("div")
            .setText("Users List")
            .setID("fd_screen_add_nav_users")
            .addStyle({
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
              }
            })
            .addListener("click", e => {
              nav_change("users");
            })
            .addClass("fd_screen_add_nav_text")
            .setStyle({
              width: "80px",
              margin: "0 15px 0 5px",
            }, true)
            .setHoverStyle({
              width: "90px",
              margin: "0 10px 0 0",
            }),
            _$("div")
            .setID("fd_screen_add_nav_friends")
            .setText("Friends")
            .addClass("fd_screen_add_nav_text", "fd_screen_add_nav_focus")
            .addListener("click", e => {
              nav_change("friends");
            })
            .setStyle({
              width: "60px",
              margin: "0 15px 0 5px",
            }, true)
            .setHoverStyle({
              width: "70px",
              margin: "0 10px 0 0",
            }),
            _$("div")
            .setID("fd_screen_add_nav_search")
            .setText("Search user")
            .addClass("fd_screen_add_nav_text")
            .addListener("click", e => {
              nav_change("search");
            })
            .setStyle({
              width: "100px",
              margin: "0 5px",
            }, true)
            .setHoverStyle({
              width: "110px",
              margin: "0"
            }),
            _$("div")
            .setStyle({
              height: "27px",
              width: "27px",
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "5px",
              transition: "0.25s",
              cursor: "pointer",
            })
            .setHoverStyle({
              backgroundColor: "#e7e7e7",
            })
            .setActiveStyle({
              backgroundColor: "#d1d1d1"
            })
            .addListener("click", e => {
              _$.getById("fd_screen_add").removeClass("fd_screen_add_show");
            })
            .append(
              _$("span")
              .setText("+")
              .setStyle({
                transform: "rotate(45deg)",
                fontSize: "24px",
                position: "relative",
                top: "-1.5px",
                left: "2px",
              })
            )
          ),
          _$("div")
          .setStyle({
            marginBottom: "15px",
            width: "fit-content",
          })
          .append(
            _$("input")
            .setID("fd_screen_add_search")
            .setAttribute("placeholder", "type here to search...")
            .setAttribute("maxlength", "20")
            .addListener("keydown", e => {
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
                    _$.getById("fd_screen_add_search").setText("Loading...");
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
            })
            .setStyle({
              width: "312px",
              height: "30px",
              fontSize: "14px",
              padding: "0 10px",
              borderRadius: "5px",
            })
          ),
          _$("div")
          .setID("fd_screen_add_list")
          .setStyle({
            overflowY: "auto",
            height: "348px",
          })
          .addStyle({
            ".fd_list_item": {
              marginBottom: "5px",
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
              width: "233px",
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
              cursor: "pointer",
              transition: "0.25s",
            },
            ".fd_screen_add_list_item > div:hover": {
              backgroundColor: "#e7e7e7",
            },
            ".fd_screen_add_list_item > div:active": {
              backgroundColor: "#d1d1d1",
            },
            ".fd_screen_add_list_item > div > span": {
              position: "relative",
              top: "-2px",
              fontSize: "20px",
            },
            ".fd_screen_add_list_item > div.fd_add": {
              borderColor: "red",
            },
            ".fd_screen_list_item > a": {
              display: "flex",
              alignItems: "center",
              height: "100%",
              width: "120px",
            },
            ".fd_screen_list_item > div": {
              width: "25px",
              height: "25px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
          })
        )
      )
    )
    reloadFriendsList();
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
