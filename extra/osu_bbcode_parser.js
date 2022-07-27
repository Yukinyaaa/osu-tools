const bbcode_parser = (raw) => {
  raw = raw.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replace(/\n/g, "<br>");
  const html_colors = "black|silver|gray|white|maroon|red|purple|fuchsia|green|lime|olive|yellow|navy|blue|teal|aqua|orange|aliceblue|antiquewhite|aquamarine|azure|beige|bisque|blanchedalmond|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|gainsboro|ghostwhite|gold|goldenrod|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|limegreen|linen|magenta|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|oldlace|olivedrab|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|thistle|tomato|turquoise|violet|wheat|whitesmoke|yellowgreen|rebeccapurple";
  const tags_list = "b|i|u|s|strike|color|size|spoiler|box|spoilerbox|quote|code|centre|url|profile|list|\\*|img|youtube|audio|heading|notice";
  const tag_arg_check = (start, end) => {
    let tag = values[start] + values[start + 1] + values[end];
    if(!tag) {
      return;
    }
    let list_len = end - start + 1;
    let tagname, arg = null, text = null;
    let tag_ast_match = tag.match(/^\[\*\](.*)/);
    let tag_tag_match = tag.match(new RegExp("^\\[(" + tags_list + ")(?:=(.*?))?\\](.*)\\[\\/(" + tags_list + ")\\]$"));
    if(tag_ast_match) {
      values[start] = "<li>";
      values[start + 1] = tag_ast_match[1].split(/(?:\[\*\]|\[\/list\]|\n)/)[0] + "</li>";
      return;
    } else if(tag_tag_match && tag_tag_match[1] == tag_tag_match[4]) {
      tagname = tag_tag_match[1];
      arg = tag_tag_match[2];
      text = tag_tag_match[3];
    } else {
      return;
    }
    switch (tagname) {
      case "b": 
        if(!arg) {
          values[start] = "<strong>";
          values[end] = "</strong>";
        }
        return;
      case "i": 
        if(!arg) {
          values[start] = "<em>";
          values[end] = "</em>";
        }
        return;
      case "u": 
        if(!arg) {
          values[start] = "<u>";
          values[end] = "</u>";
        }
        return;
      case "s": 
      case "strike": 
        if(!arg) {
          values[start] = "<del>";
          values[end] = "</del>";
        }
        return;
      case "color": 
        if(arg && arg.match(new RegExp("^(?:(?:" + html_colors + ")|#[a-fA-F0-9]{6})$"))) {
          values[start] = "<span style=\"color:" + arg + "\">";
          values[end] = "</span>";
        }
        return;
      case "size": 
        if(["50", "85", "100", "150"].indexOf(arg) != -1) {
          values[start] = "<span class=\"size-" + arg + "\">";
          values[end] = "</span>";
        }
        return;
      case "spoiler": 
        if(!arg) {
          values[start] = "<span class=\"spoiler\">";
          values[end] = "</span>";
        }
        return;
      case "spoilerbox": 
        arg = "SPOILER";
      case "box": 
        if(arg) {
          values[start] = "<div class=\"js-spoilerbox bbcode-spoilerbox\"><button class=\"js-spoilerbox__link bbcode-spoilerbox__link\" type=\"button\"><span class=\"bbcode-spoilerbox__link-icon\"></span>" + arg + "</button><div class=\"bbcode-spoilerbox__body\">";
          values[end] = "</div></div>";
        }
        return;
      case "quote": 
        if(arg && arg.match(/^".+"$/)) {
          values[start] = "<blockquote><h4>" + arg.replace(/"(.+)"/, "$1") + " wrote:</h4>";
          values[end] = "</blockquote>";
        } else if(!arg) {
          values[start] = "<blockquote>";
          values[end] = "</blockquote>";
        }
        return;
      case "code": 
        if(!arg) {
          values[start] = "<pre>";
          values[end] = "</pre>";
        }
        return;
      case "centre": 
        if(!arg) {
          values[start] = "<center>";
          values[end] = "</center>";
        }
        return;
      case "url": 
        if(arg && arg.match(/^(?:https?|ftps?):\/\/.+?\..+?.*$/) && text) {
          values[start] = "<a rel=\"nofollow\" href=\"" + arg.replaceAll("\"", "\\\"") + "\">";
          values[end] = "</a>";
        } else if(!arg && text.match(/^(?:https?|ftps?):\/\/\w+?\.\w+?.*$/) && list_len == 3) {
          values[start] = "<a rel=\"nofollow\" href=\"" + text.replaceAll("\"", "\\\"") + "\">";
          values[end] = "</a>";
        }
        return;
      case "profile": 
        if(text.match(/^[\w- \[\]]+$/) && list_len == 3) {
          values[start] = "<a class=\"user-name js-usercard\" href=\"https://osu.ppy.sh/users/" + text + "\" data-hasqtip=\"107\" aria-describedby=\"qtip-107\">";
          values[end] = "</a>";
        }
        return;
      case "list": 
        if(arg) {
          values[start] = "<ol>";
          values[end] = "</ol>";
        } else {
          values[start] = "<ol class=\"unordered\">";
          values[end] = "</ol>";
        }
        return;
      case "img": 
        if(!arg && text.match(/^(?:https?|ftps?):\/\/.+?\..+?.*$/) && list_len == 3) {
          values[start] = "<span class=\"proportional-container js-gallery\"><span class=\"proportional-container__height\"><img style=\"position:relative\" src=\"" + text + "\" alt=\"\"></span></span><br>";
          values[start + 1] = "";
          values[end] = "";
        }
        return;
      case "youtube": 
        if(!arg && text.match(/^[\w-]{11}$/) && list_len == 3) {
          values[start] = "<div class\"bbcode__video-box\"><div class=\"bbcode__video\"><iframe src=\"https://www.youtube.com/embed/" + text + "?rel=0\" frameborder=\"0\"></iframe></div></div>";
          values[start + 1] = "";
          values[end] = "";
        }
        return;
      case "audio": 
        if(!arg && text.match(/^(?:https?|ftps?):\/\/.+?\..+?.*$/) && list_len == 3) {
          values[start] = "<div class=\"audio-player js-audio--player\" data-audio-url=\"" + text + "\" data-audio-state=\"paused\" data-audio-autoplay=\"1\" data-audio-has-duration=\"1\" data-audio-time-format=\"minute_minimal\" data-audio-over50=\"0\" style=\"--duration:&quot;0:00&quot;; --current-time:&quot;0:00&quot;; --progress:0;\"><button type=\"button\" class=\"audio-player__button audio-player__button--play js-audio--play\"><span class=\"fa-fw play-button\"></span></button><div class=\"audio-player__bar audio-player__bar--progress js-audio--seek\"><div class=\"audio-player__bar-current\"></div></div><div class=\"audio-player__timestamps\"><div class=\"audio-player__timestamp audio-player__timestamp--current\"></div><div class=\"audio-player__timestamp-separator\">/</div><div class=\"audio-player__timestamp audio-player__timestamp--total\"></div></div></div>";
          values[start + 1] = "";
          values[end] = "";
        }
        return;
      case "heading": 
        if(!arg) {
          values[start] = "<h2>";
          values[end] = "</h2>";
        }
        return;
      case "notice": 
        if(!arg) {
          values[start] = "<div class\"well\">";
          values[end] = "</div>";
        }
        return;
    }
    return;
  }
  let temp_values = raw.split(new RegExp("(\\[\\/?(?:" + tags_list + ")(?:=.*?)?\\]|\n)"));
  let values = temp_values.filter(item => item != "");
  const tag_regexp = new RegExp("^\\[(\\/)?(" + tags_list + ")(?:=(.*?))?\\]$");
  // for(let i = 0; i < values.length; i++) {
  //   if(values[i] == "\n") {
  //     if(values[i - 1].match(tag_regexp)) {
  //       values[i] = "";
  //     } else {
  //       values[i] = "<br>";
  //     }
  //   }
  // }
  for(let i = 0; i < values.length; i++) {
    let tag_i_match = values[i].match(tag_regexp);
    if(tag_i_match) {
      let tag_start = i;
      let tag_end = -1;
      if(tag_i_match[1] == undefined) {
        if(tag_i_match[2] != "*") {
          let tag_check = 0;
          for(let j = i + 1; j < values.length; j++) {
            let tag_j_match = values[j].match(tag_regexp);
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
            tag_arg_check(tag_start, tag_end);
          }
        } else {
          tag_arg_check(tag_start, values.length - 1);
        }
      }
    }
  }
  return values.join("");
}
