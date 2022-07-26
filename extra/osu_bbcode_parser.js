const bbcode_parser = (raw) => {
  raw = raw.replace(/\n/g, "<br>").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  const html_colors = "black|silver|gray|white|maroon|red|purple|fuchsia|green|lime|olive|yellow|navy|blue|teal|aqua|orange|aliceblue|antiquewhite|aquamarine|azure|beige|bisque|blanchedalmond|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|gainsboro|ghostwhite|gold|goldenrod|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|limegreen|linen|magenta|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|oldlace|olivedrab|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|thistle|tomato|turquoise|violet|wheat|whitesmoke|yellowgreen|rebeccapurple";
  const tags_list = "b|i|u|s|strike|color|size|spoiler|box|spoilerbox|quote|code|centre|url|profile|list|\\*|img|youtube|audio|heading|notice";
  const tag_check = (tag) => {
    if(!tag) {
      return "";
    }
    var tag_match = new RegExp("^\\[(" + tags_list + ")(?:=(.*?))?\\](.*)\\[\\/(" + tags_list + ")\\]$");
    if(tag.match(/^\[\*\].+$/) {
      return tag.split(/(?:hfjfjfjfjgjgngngg\n
    }
    var tag_syntax_check = tag.match(tag_match);
    if(!tag_syntax_check || tag_syntax_check[1] != tag_syntax_check[4]) {
      return tag;
    }
    var arg = tag_syntax_check[2];
    var text = tag_syntax_check[3]
    switch(tag_syntax_check[1]) {
      case "b": 
        if(!arg) {
          return tag.replace(tag_match, "<strong>$3</strong>");
        } else {
          return tag;
        }
      case "i": 
        if(!arg) {
          return tag.replace(tag_match, "<em>$3</em>");
        } else {
          return tag;
        }
      case "u": 
        if(!arg) {
          return tag.replace(tag_match, "<u>$3</u>");
        } else {
          return tag;
        }
      case "s": 
      case "strike": 
        if(!arg) {
          return tag.replace(tag_match, "<del>$3</del>");
        } else {
          return tag;
        }
      case "color": 
        if(arg && arg.match(new RegExp("^(?:(?:" + html_colors + ")|#[a-fA-F0-9]{6})$"))) {
          return tag.replace(tag_match, "<span style=\"color:$2\">$3</span>");
        } else {
          return tag;
        }
      case "size": 
        if(["50", "85", "100", "150"].indexOf(arg) != -1) {
          return tag.replace(tag_match, "<span class=\"size-$2\">$3</span>");
        } else {
          return tag;
        }
      case "spoiler": 
        if(!arg) {
          return tag.replace(tag_match, "<span class=\"spoiler\">$3</span>");
        } else {
          return tag;
        }
      case "spoilerbox": 
        if(!arg) {
          tag = tag.replace(tag_match, "[box=SPOILER]$3[/box]");
          arg = true;
        } else {
          return tag;
        }
      case "box": 
        if(arg) {
          return tag.replace(tag_match, "<div class=\"js-spoilerbox bbcode-spoilerbox\"><button class=\"js-spoilerbox__link bbcode-spoilerbox__link\" type=\"button\"><span class=\"bbcode-spoilerbox__link-icon\"></span>$2</button><div class=\"bbcode-spoilerbox__body\">$3</div></div>");
        } else {
          return tag;
        }
      case "quote": 
        if(arg && arg.match(/^".+"$/)) {
          return tag.replace(tag_match, "<blockquote><h4>$2 wrote:</h4>$3</blockquote>");
        } else if(arg) {
          return tag;
        } else {
          return tag.replace(tag_match, "<blockquote>$3</blockquote>");
        }
      case "code": 
        if(!arg) {
          return tag.replace(tag_match, "<pre>$3</pre>");
        } else {
          return tag;
        }
      case "centre": 
        if(!arg) {
          return tag.replace(tag_match, "<center>$3</center>");
        } else {
          return tag;
        }
      case "url": 
        if(arg && arg.match(/^(?:https?|ftps?):\/\/.+?\..+?.*$/) && text) {
          return tag.replace(tag_match, "<a rel=\"nofollow\" href=\"$2\">$3</a>");
        } else if(!arg && text.match(/^(?:https?|ftps?):\/\/\w+?\.\w+?.*$/)) {
          return tag.replace(tag_match, "<a rel=\"nofollow\" href=\"$3\">$3</a>");
        } else {
          return tag;
        }
      case "profile": 
        if((arg && arg.match(/^\d+$/)) || text.match(/^[\w- \[\]]+$/)) {
          return tag.replace(tag_match, "<a class=\"user-name js-usercard\" href=\"https://osu.ppy.sh/users/$3\" data-hasqtip=\"107\" aria-describedby=\"qtip-107\">$3</a>");
        } else {
          return tag;
        }
      case "list": 
        if(arg) {
          return tag.replace(tag_match, "<ol>$3</ol>");
        } else {
          return tag.replace(tag_match, "<ol class=\"unordered\">" + text + "</ol>";
        }
      case "img": 
        if(!arg && text.match(/^(?:https?|ftps?):\/\/.+?\..+?.*$/)) {
          return tag.replace(tag_match, "<span class=\"proportional-container js-gallery\"><span class=\"proportional-container__height\" style=\"padding-bottom:55.952380952381%\"><img class=\"proportional-container__content\" src=\"$3\" alt=\"\"></span></span>");
        } else {
          return tag;
        }
      case "youtube": 
        if(!arg && text.match(/^[\w-]{11}$/)) {
          return tag.replace(tag_match, "<div class=\"bbcode__video\"><iframe src=\"https://www.youtube.com/embed/$3?rel=0\" frameborder=\"0\"></iframe></div>");
        } else {
          return tag;
        }
      case "audio": 
        if(!arg && text.match(/^(?:https?|ftps?):\/\/.+?\..+?.*$/)) {
          return tag.replace(tag_match, "<div class=\"audio-player js-audio--player\" data-audio-url=\"$3\" data-audio-state=\"paused\" data-audio-autoplay=\"1\" data-audio-has-duration=\"1\" data-audio-time-format=\"minute_minimal\" data-audio-over50=\"0\" style=\"--duration:&quot;0:00&quot;; --current-time:&quot;0:00&quot;; --progress:0;\"><button type=\"button\" class=\"audio-player__button audio-player__button--play js-audio--play\"><span class=\"fa-fw play-button\"></span></button><div class=\"audio-player__bar audio-player__bar--progress js-audio--seek\"><div class=\"audio-player__bar-current\"></div></div><div class=\"audio-player__timestamps\"><div class=\"audio-player__timestamp audio-player__timestamp--current\"></div><div class=\"audio-player__timestamp-separator\">/</div><div class=\"audio-player__timestamp audio-player__timestamp--total\"></div></div></div>");
        } else {
          return tag;
        }
      case "heading": 
        if(!arg) {
          return tag.replace(tag_match, "<h2>$3</h2>");
        } else {
          return tag;
        }
      case "notice": 
        if(!arg) {
          return tag.replace(tag_match, "<div class=\"well\">$3</div>");
        } else {
          return tag;
        }
    }
    return tag;
  }
  const part_of_list = (list, start, end) => {
    var part_list = [];
    for(let k = start; k < end; k++) {
      part_list.push(list[k]);
    }
    return part_list;
  }
  const values = raw.split(new RegExp("(\\[\\/?(?:" + tags_list + ")(?:=.*?)?\\])"));
  const tag_regexp = new RegExp("^\\[(\\/)?(" + tags_list + ")(?:=(.*?))?\\]$");
  var counter = 0;
  for(let i = 0; i < values.length; i++) {
    var tag_i_match = values[i].match(tag_regexp);
    if(tag_i_match) {
      var tag_start = i;
      var tag_end = -1;
      if(tag_i_match[1] == undefined) {
        if(tag_i_match[2] != "*") {
          var tag_se_check = 0;
          for(let j = i + 1; j < values.length; j++) {
            if(j == values.length - 1) {
              break;
            }
            var tag_j_match = values[j].match(tag_regexp);
            if(tag_j_match && tag_i_match[2] == tag_j_match[2]) {
              if(tag_j_match[1] == undefined) {
                tag_se_check++;
              } else {
                if(tag_se_check == 0) {
                  tag_end = j;
                  break;
                }
                tag_se_check--;
              }
            }
          }
          if(tag_end != -1) {
            console.log(tag_check(part_of_list(values, tag_start, tag_end).join("")));
          }
        } else {
          console.log(tag_check(part_of_list(values, tag_start, values.length).join("")));
        }
        counter++;
      }
    }
  }
  console.log("使用されている開始タグの数: " + counter);
}
