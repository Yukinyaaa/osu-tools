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
    } else if(type(nodes[i]) == "string" || type(nodes[i]) == "number") {
      element_temp.innerHTML += String(nodes[i]);
    } else {
      console.warn(`警告: 第${i + 1}引数は文字列または要素ではないため無視されました`);
    }
  }
  return element_temp;
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
    } else if(type(att[key]) == "string" || type(att[key]) == "number") {
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
function createScoreDetail(score) {
  let [mode, top_rank, score_rank, title, artist, difficulty, beatmapid, scoreid, scoretime, mods, accuracy, pp, replayenable] =
  [score.beatmap.mode, 1, score.rank, score.beatmapset.title, score.beatmapset.artist, score.beatmap.version, score.beatmap_id, score.id, score.ended_at, score.mods, score.accuracy, score.pp, score.replay];
  function getTimeAgo(time) {
    time = (new Date(time)).getTime();
    let now = (new Date()).getTime();
    timediff = Math.abs(now - time) / 1000;
    let result;
    if(timediff < 60) {
      result =  "数秒";
    } else
    if(timediff < 3600) {
      result = Math.round(timediff / 60) + "分";
    } else
    if(timediff < 86400) {
      result = Math.round(timediff / 60 / 60) + "時間";
    } else
    if(timediff < 2592000) {
      result = Math.round(timediff / 60 / 60 / 24) + "日";
    } else
    if(timediff < 31104000) {
      result = Math.round(timediff / 60 / 60 / 24 / 30) + "ヶ月";
    }
    else {
      result = Math.round(timediff / 60 / 60 / 24 / 30 / 12) + "年";
    }
    if(timediff == 0) {
      return "今";
    } else
    if(now - time < 0) {
      return result + "後";
    }
    else {
      return result + "前";
    }
  }
  const modeName = ({
    "osu": "osu!",
    "taiko": "osu!taiko",
    "fruits": "osu!catch",
    "mania": "osu!mania"
  })[mode];
  const modtitle = {
    NF: "No Fail",
    EZ: "Eazy",
    HD: "Hidden",
    HR: "Hard Rock",
    SD: "Sudden Death",
    HT: "Half Time",
    DT: "Double Time",
    NC: "Nightcore",
    FL: "Flashlight",
    SO: "Spun Out",
    PF: "Perfect"
  }
  return(
    $("div", ["play-detail", "play-detail--highlightable"]).append(
      $("div", ["play-detail__group", "play-detail__group--top"]).append(
        $("span", ["fal", "fa-extra-mode-" + mode], {
          style: ["margin-right: 12px;", "font-size: 18px;"],
          title: modeName
        }),
        $("div", ["play-detail__icon", "play-detail__icon--main"]).append(
          $("div", ["score-rank", "score-rank--full", "score-rank--" + score_rank])
        ),
        $("div", ["play-detail__detail"]).append(
          $("a", ["play-detail__title", "u-ellipsis-overflow"], {
            href: "https://osu.ppy.sh/beatmaps/" + beatmapid + "?mode=" + mode
          }).append(
            title + " ",
            $("small", ["play-detail__artist"]).append("by " + artist)
          ),
          $("div", ["play-detail__beatmap-and-time"]).append(
            $("span", ["play-detail__beatmap"]).append(difficulty),
            $("span", ["play-detail__time"]).append(
              $("time", ["js-timeago"], {
                datetime: scoretime,
                title: scoretime
              }).append(getTimeAgo(scoretime))
            )
          )
        )
      ),
      $("div", ["play-detail__group", "play-detail__group--bottom"]).append(
        $("div", ["play-detail__score-detail", "play-detail__score-detail--score"]).append(
          $("div", ["play-detail__icon", "play-detail__icon--extra"]).append(
            $("div", ["score-rank", "score-rank--full", "score-rank--" + score_rank])
          ),
          $("div", ["play-detail__score-detail-top-right"]).append(
            $("div", ["play-detail__accuracy-and-weighted-pp"]).append(
              $("span", ["play-detail__accuracy"]).append(Math.floor(accuracy * 10000) / 100 + "%"),
              $("span", ["play-detail__weighted-pp"]).append(Math.round(pp) + "pp")
            ),
            $("div", ["play-detail__pp-weight"]).append("割合 100%")
          )
        ),
        $("div", ["play-detail__score-detail", "play-detail__score-detail--mods"]).append(
          mods.map(value => {
            return $("div", ["mod", "mod--" + value.acronym], {
              title: modtitle[value.acronym]
            })
          })
        ),
        $("div", ["play-detail__pp"]).append(
          $("span", {
            title: pp
          }).append(
            Math.round(pp),
            $("span", ["play-detail__pp-unit"]).append("pp")
          )
        ),
        $("div", ["play-detail__more"]).append(
          $("button", ["popup-menu"], {
            type: "button"
          }).append(
            $("span", ["fas", "fa-ellipsis-v"])
          )
        )
      )
    )
  )
}
