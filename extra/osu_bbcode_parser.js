const bbcode_parser = (raw) => {
  raw.replace(/\n/g, "<br>");
  const html_colors = "black|silver|gray|white|maroon|red|purple|fuchsia|green|lime|olive|yellow|navy|blue|teal|aqua|orange|aliceblue|antiquewhite|aquamarine|azure|beige|bisque|blanchedalmond|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|gainsboro|ghostwhite|gold|goldenrod|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|limegreen|linen|magenta|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|oldlace|olivedrab|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|thistle|tomato|turquoise|violet|wheat|whitesmoke|yellowgreen|rebeccapurple";
  const tag_arg_check = (tagname, arg, text) => {
    var not_bbcode = "[" + tagname + (arg ? "=" + arg : "") + "]" + text + "[/" + tagname + "]";
    arg = arg.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    text = text.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
      switch (tagname) {
        case "b": 
          if(!arg) {
            return "<strong>" + text + "</strong>";
          } else {
            return not_bbcode;
          }
        case "i": 
          if(!arg) {
            return "<em>" + text + "</em>";
          } else {
            return not_bbcode;
          }
        case "u": 
          if(!arg) {
            return "<u>" + text + "</u>";
          } else {
            return not_bbcode;
          }
        case "s": 
        case "strike": 
          if(!arg) {
            return "<del>" + text + "</del>";
          } else {
            return not_bbcode;
          }
        case "color": 
          if(arg.match(new RegExp("^(?:(?:" + html_colors + ")|#[a-fA-F0-9]{6})$"))) {
            return "<span style=\"color:" + arg + "\">" + text + "</span>";
          } else {
            return not_bbcode;
          }
        case "size": 
          if(["50", "85", "100", "150"].indexOf(arg) != -1) {
            return "<span class=\"size-" + arg + "\">" + text + "</span>";
          } else {
            return not_bbcode;
          }
        case "spoiler": 
          if(!arg) {
            return "<span class=\"spoiler\">" + text + "</span>";
          } else {
            return not_bbcode;
          }
        case "spoilerbox": 
          if(!arg) {
            arg = "SPOILER";
          }
        case "box": 
          if(arg) {
            return "<div class=\"js-spoilerbox bbcode-spoilerbox\"><button class=\"js-spoilerbox__link bbcode-spoilerbox__link\" type=\"button\"><span class=\"bbcode-spoilerbox__link-icon\"></span>" + arg + "</button><div class=\"bbcode-spoilerbox__body\">" + text + "</div></div>";
          } else {
            return not_bbcode;
          }
        case "quote": 
          if(arg.match(/^".+"$/)) {
            return "<blockquote><h4>" + arg + " wrote:</h4>" + text + "</blockquote>"
          } else if(arg) {
            return not_bbcode;
          } else {
            return "<blockquote>" + text + "</blockquote>"
          }
        case "code": 
          if(!arg) {
            return "<pre>" + text + "</pre>";
          } else {
            return not_bbcode;
          }
        case "centre": 
          if(!arg) {
            return "<center>" + text + "</center>";
          } else {
            return not_bbcode;
          }
        case "url": 
          if(arg.match(/^(?:https?|ftp):\/\/.+?\..+?.*$/)) {
            if(text) {
              return "<a rel=\"nofollow\" href=\"" + arg.replaceAll("\"", "\\\"") + "\">" + text + "</a>";
            }
          } else if(!arg && text.match(/^(?:https?|ftp):\/\/\w+?\.\w+?.*$/)) {
            return "<a rel=\"nofollow\" href=\"" + text.replaceAll("\"", "\\\"") + "\">" + text + "</a>";
          } else {
            return not_bbcode;
          }
        case "profile": 
          if(arg.match(/^\d+$/) || text.match(/^[\w- \[\]]+$/)) {
            return "<a class=\"user-name js-usercard\" href=\"https://osu.ppy.sh/users/" + (arg ? arg : text) + "\" data-hasqtip=\"107\" aria-describedby=\"qtip-107\">" + text + "</a>";
          } else {
            return not_bbcode;
          }
        case "list": 
          if(arg) {
            return "<ol>" + text + "</ol>";
          } else if(!arg) {
            return "<ol class=\"unordered\">" + text + "</ol>";
          } else {
            return not_bbcode;
          }
        case "*": 
          if(!arg) {
            return "<li>" + text.split(/(?:\[*\]|<br>)/)[0] + "</li>";
          } else {
            return not_bbcode;
          }
        case "img": 
          if(!arg && text.match(/^(?:https?|ftp):\/\/.+?\..+?.*$/)) {
            return "<span class=\"proportional-container js-gallery\"><span class=\"proportional-container__height\" style=\"padding-bottom:55.952380952381%\"><img class=\"proportional-container__content\" src=\"" + text + "\" alt=\"\"></span></span>";
          } else {
            return not_bbcode;
          }
        case "youtube": 
          if(!arg && text.match(/^[\w-]{11}$/)) {
            "<div class=\"bbcode__video\"><iframe src=\"https://www.youtube.com/embed/" + text + "?rel=0\" frameborder=\"0\"></iframe></div>";
          } else {
            return not_bbcode;
          }
        case "audio": 
          if(!arg && text.match(/^(?:https?|ftp):\/\/.+?\..+?.*$/)) {
            "<div class=\"audio-player js-audio--player\" data-audio-url=\"" + text + "\" data-audio-state=\"paused\" data-audio-autoplay=\"1\" data-audio-has-duration=\"1\" data-audio-time-format=\"minute_minimal\" data-audio-over50=\"0\" style=\"--duration:&quot;0:00&quot;; --current-time:&quot;0:00&quot;; --progress:0;\"><button type=\"button\" class=\"audio-player__button audio-player__button--play js-audio--play\"><span class=\"fa-fw play-button\"></span></button><div class=\"audio-player__bar audio-player__bar--progress js-audio--seek\"><div class=\"audio-player__bar-current\"></div></div><div class=\"audio-player__timestamps\"><div class=\"audio-player__timestamp audio-player__timestamp--current\"></div><div class=\"audio-player__timestamp-separator\">/</div><div class=\"audio-player__timestamp audio-player__timestamp--total\"></div></div></div>";
          } else {
            return not_bbcode;
          }
        case "heading": 
          if(!arg) {
            return "<h2>" + text + "</h2>";
          } else {
            return not_bbcode;
          }
        case "notice": 
          if(!arg) {
            return "<div class=\"well\">" + text + "</div>";
          } else {
            return not_bbcode;
          }
      }
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
            console.log(values[tag_start] + " -> " + values[tag_end]);
          }
        } else {
          console.log(values[tag_start]);
        }
        counter++;
      }
    }
  }
  console.log("使用されている開始タグの数: " + counter);
}
