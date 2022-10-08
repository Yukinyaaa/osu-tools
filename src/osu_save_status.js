function type(a) {
  if(a === null) return "null";
  if(["undefined", "boolean", "number", "bigint", "string", "symbol", "function"].includes(typeof a)) return typeof a;
  if(Array.isArray(a)) return "array";
  if(typeof a === "string" && !a.length) return "regexp";
  if(a instanceof Element) return "element";
  if(a.toString() === "[object Object]") return "object";
  return "constructor";
}
Element.prototype.append = function(...nodes) {
  if(type(nodes[0]) == "array") {
    nodes = nodes[0];
  }
  let element_temp = this;
  for(let i = 0; i < nodes.length; i++) {
    if(type(nodes[i]) == "element") {
      element_temp.innerHTML += nodes[i].outerHTML;
    } else if(type(nodes[i]) == "string") {
      element_temp.innerHTML += nodes[i];
    } else {
      console.warn(`警告: 第${i}引数は文字列または要素ではないため無視されました`);
    }
  }
  return element_temp;
}
Element.prototype.addListener = function(type, listener, options) {
  this.addEventListener(type, listener, options);
  return this;
}
function $(tagname, classes, attributes) {
  if(type(tagname) != "string") {
    throw new Error("第1引数には文字列を指定してください");
  }
  let att, pass = false;
  if(type(classes) == "array") {
    if(type(attributes) == "array") {
      throw new Error("クラスを指定できる引数は1つのみです。第2引数か第3引数のどちらかを削除してください");
    }
    if(type(attributes) == "object") {
      att = attributes;
    }
    pass = true;
  }
  if(type(classes) == "object") {
    if(type(attributes) == "array") {
      throw new Error("クラスと属性を引数に指定する順番が逆です");
    }
    if(attributes || attributes === false) {
      throw new Error("第2引数に属性を指定した場合、第3属性に何かを指定することはできません");
    }
    att = classes;
    pass = true;
  }
  if(type(classes) == "undefined") {
    pass = true;
  }
  if(pass == false) {
    throw new Error("第2引数または第3引数の型が違います");
  }
  let element = document.createElement(tagname);
  for(key in att) {
    if(type(att[key]) == "array") {
      element.setAttribute(key, att[key].join(" "));
    } else if(type(att[key]) == "string") {
      element.setAttribute(key, att[key]);
    } else {
      console.warn(`警告: 属性${key}の値は文字列ではないため無視されました`);
    }
  }
  if(att != classes) {
    element.setAttribute("class", classes.join(" "));
  }
  return element;
}

/* ----------------- */

document.head.append(
  $("style").append(`
    .us-bookmark-parent {
      width: 30px;
      height: 30px;
      margin-left: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: 0.2s;
      border-radius: 5px;
    }
    .us-bookmark-parent:hover {
      background-color: rgb(125 94 108);
    }
    .us-bookmark {
      width: 15px;
      fill: white;
    }
    .us-bookmark-icon_fill {
      opacity: 0;
      transition: 0.2s;
    }
    .us-bookmark-parent:hover .us-bookmark-icon_fill {
      opacity: 1;
    }
  `)
)

const bookmark_nothover = `<path d="M336 0h-288C21.49 0 0 21.49 0 48v431.9c0 24.7 26.79 40.08 48.12 27.64L192 423.6l143.9 83.93C357.2 519.1 384 504.6 384 479.9V48C384 21.49 362.5 0 336 0zM336 452L192 368l-144 84V54C48 50.63 50.63 48 53.1 48h276C333.4 48 336 50.63 336 54V452z"></path>`;
const bookmark_hover    = `<path class="us-bookmark-icon_fill" d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z"/>`;

let header = document.getElementsByClassName("header-v4__row header-v4__row--title")[0];
header.append(
  $("div", {
    "class": "us-bookmark-parent",
    "title": "現時点での統計を保存する"
  }).append(
    $("svg", {
      "viewBox": "0 0 384 512",
      "class": "us-bookmark",
    }).append(bookmark_nothover, bookmark_hover)
  )
)
