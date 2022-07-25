const bbcode_parser = (raw) => {
  raw.replace(/\n/g, "<br>");
  const html_colors = "black|silver|gray|white|maroon|red|purple|fuchsia|green|lime|olive|yellow|navy|blue|teal|aqua|orange|aliceblue|antiquewhite|aquamarine|azure|beige|bisque|blanchedalmond|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|gainsboro|ghostwhite|gold|goldenrod|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|limegreen|linen|magenta|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|oldlace|olivedrab|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|thistle|tomato|turquoise|violet|wheat|whitesmoke|yellowgreen|rebeccapurple";
  const tag_arg_check = (tagname, arg, text) => {
    if(!text) {
      return false;
    }
    switch (tagname) {
      case "b": 
        if(!arg) {
          // return "<strong>" + text + "</strong>";
          return true;
        } else {
          return false;
        }
      case "i": 
        if(!arg) {
          // return "<em>" + text + "</em>";
          return true;
        } else {
          return false;
        }
      case "u": 
        if(!arg) {
          // return "<u>" + text + "</u>";
          return true;
        } else {
          return false;
        }
      case "s": 
      case "strike": 
        if(!arg) {
          // return "<del>" + text + "</del>";
          return true;
        } else {
          return false;
        }
      case "color": 
        if(arg && arg.match(new RegExp("^(?:(?:" + html_colors + ")|#[a-fA-F0-9]{6})$"))) {
          // return "<span style=\"color:" + arg + "\">" + text + "</span>";
          return true;
        } else {
          return false;
        }
      case "size": 
        if(["50", "85", "100", "150"].indexOf(arg) != -1) {
          // return "<span class=\"size-" + arg + "\">" + text + "</span>";
          return true;
        } else {
          return false;
        }
      case "spoiler": 
        if(!arg) {
          // return "<span class=\"spoiler\">" + text + "</span>";
          return true;
        } else {
          return false;
        }
      case "spoilerbox": 
      case "box": 
        if(arg) {
          // return "<div class=\"js-spoilerbox bbcode-spoilerbox\"><button class=\"js-spoilerbox__link bbcode-spoilerbox__link\" type=\"button\"><span class=\"bbcode-spoilerbox__link-icon\"></span>" + arg + "</button><div class=\"bbcode-spoilerbox__body\">" + text + "</div></div>";
          return true;
        } else {
          return false;
        }
      case "quote": 
        if(arg && arg.match(/^".+"$/)) {
          // return "<blockquote><h4>" + arg + " wrote:</h4>" + text + "</blockquote>";
          return true;
        } else if(arg) {
          return false;
        } else {
          // return "<blockquote>" + text + "</blockquote>";
          return true;
        }
      case "code": 
        if(!arg) {
          // return "<pre>" + text + "</pre>";
          return true;
        } else {
          return false;
        }
      case "centre": 
        if(!arg) {
          // return "<center>" + text + "</center>";
          return true;
        } else {
          return false;
        }
      case "url": 
        if(arg && arg.match(/^(?:https?|ftp):\/\/.+?\..+?.*$/) && text) {
          // return "<a rel=\"nofollow\" href=\"" + arg.replaceAll("\"", "\\\"") + "\">" + text + "</a>";
          return true;
        } else if(!arg && text.match(/^(?:https?|ftp):\/\/\w+?\.\w+?.*$/)) {
          // return "<a rel=\"nofollow\" href=\"" + text.replaceAll("\"", "\\\"") + "\">" + text + "</a>";
          return true;
        } else {
          return false;
        }
      case "profile": 
        if((arg && arg.match(/^\d+$/)) || text.match(/^[\w- \[\]]+$/)) {
          // return "<a class=\"user-name js-usercard\" href=\"https://osu.ppy.sh/users/" + (arg ? arg : text) + "\" data-hasqtip=\"107\" aria-describedby=\"qtip-107\">" + text + "</a>";
          return true;
        } else {
          return false;
        }
      case "list": 
        if(arg) {
          // return "<ol>" + text + "</ol>";
          return true;
        } else {
          // return "<ol class=\"unordered\">" + text + "</ol>";
          return true;
        }
      case "*": 
        if(!arg) {
          // return "<li>" + text.split(/(?:\[*\]|<br>)/)[0] + "</li>";
          return true;
        } else {
          return false;
        }
      case "img": 
        if(!arg && text.match(/^(?:https?|ftp):\/\/.+?\..+?.*$/)) {
          // return "<span class=\"proportional-container js-gallery\"><span class=\"proportional-container__height\" style=\"padding-bottom:55.952380952381%\"><img class=\"proportional-container__content\" src=\"" + text + "\" alt=\"\"></span></span>";
          return true;
        } else {
          return false;
        }
      case "youtube": 
        if(!arg && text.match(/^[\w-]{11}$/)) {
          // return "<div class=\"bbcode__video\"><iframe src=\"https://www.youtube.com/embed/" + text + "?rel=0\" frameborder=\"0\"></iframe></div>";
          return true;
        } else {
          return false;
        }
      case "audio": 
        if(!arg && text.match(/^(?:https?|ftp):\/\/.+?\..+?.*$/)) {
          // return "<div class=\"audio-player js-audio--player\" data-audio-url=\"" + text + "\" data-audio-state=\"paused\" data-audio-autoplay=\"1\" data-audio-has-duration=\"1\" data-audio-time-format=\"minute_minimal\" data-audio-over50=\"0\" style=\"--duration:&quot;0:00&quot;; --current-time:&quot;0:00&quot;; --progress:0;\"><button type=\"button\" class=\"audio-player__button audio-player__button--play js-audio--play\"><span class=\"fa-fw play-button\"></span></button><div class=\"audio-player__bar audio-player__bar--progress js-audio--seek\"><div class=\"audio-player__bar-current\"></div></div><div class=\"audio-player__timestamps\"><div class=\"audio-player__timestamp audio-player__timestamp--current\"></div><div class=\"audio-player__timestamp-separator\">/</div><div class=\"audio-player__timestamp audio-player__timestamp--total\"></div></div></div>";
          return true;
        } else {
          return false;
        }
      case "heading": 
        if(!arg) {
          // return "<h2>" + text + "</h2>";
          return true;
        } else {
          return false;
        }
      case "notice": 
        if(!arg) {
          // return "<div class=\"well\">" + text + "</div>";
          return true;
        } else {
          return false;
        }
    }  
  }
  const part_of_list = (list, start, end) => {
    var part_list = [];
    for(let k = start; k < end; k++) {
      part_list.push(list[k]);
    }
    return part_list;
  }
  const tags_list = "b|i|u|s|strike|color|size|spoiler|box|spoilerbox|quote|code|centre|url|profile|list|\\*|img|youtube|audio|heading|notice";
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
          var tag_check = 0;
          for(let j = i + 1; j < values.length; j++) {
            if(j == values.length - 1) {
              break;
            }
            var tag_j_match = values[j].match(tag_regexp);
            if(tag_j_match && tag_i_match[2] == tag_j_match[2]) {
              if(tag_j_match[1] == undefined) {
                tag_check++;
              } else {
                if(tag_check == 0) {
                  tag_end = j;
                  break;
                }
                tag_check--;
              }
            }
          }
          if(tag_end != -1) {
            console.log(tag_arg_check(tag_i_match[2], tag_i_match[3], part_of_list(values, tag_start, tag_end).join("")));
          }
        } else {
          console.log(tag_arg_check("*", undefined, part_of_list(values, tag_start, values.length).join("")));
        }
        counter++;
      }
    }
  }
  console.log("使用されている開始タグの数: " + counter);
}
