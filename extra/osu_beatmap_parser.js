const beatmap_parser = (raw) => {
  if(!raw) return null;
  
  const tonum = (str) => {
    if(!isNaN(str)) {
      return Number(str);
    } else {
      throw new SyntaxError("Value of '" + key + "' must be a number");
    }
  }
  const isInt = (num) => {
    if(Number.isInteger(num)) {
      return true;
    } else {
      throw new Error("Value of '" + key + "' must be an integer");
    }
  }
  const numCheck = (num, cond) => {
    let bool = new Function("return(" + cond.replaceAll("n", num) + ")")();
    if(bool) {
      return true;
    } else {
      throw new Error("Value of '" + key + "' must be " + cond);
    }
  }
  const oneOf = (str, arr) => {
    if(arr.indexOf(str) != -1) {
      return true;
    } else {
      throw new Error(
        "Value of '" + key + "' must be one of " + 
        arr.map((value, index) => {
          return `'${value}'${index == arr.length - 2 ? " or " : (index == arr.length -1 ? "" : ", ")}`;
        }).join("")
      );
    }
  }
  const ASCIICheck = (str) => {
    if(str.match(/^[\x20-\x7e]*$/)) {
      return true;
    } else {
      throw new Error("Value of '" + key + "' must be ASCII");
    }
  }
  const rule = {
    "General": {
      "AudioFilename: (.+)": (p1) => {
        beatmap.general.audioFilename = p1;
      },
      "AudioLeadIn: (.+)": (p1) => {
        p1 = tonum(p1);
        if(isInt(p1)) {
          beatmap.general.audioLeadIn = p1;
        }
      },
      "PreviewTime: (.+)": (p1) => {
        p1 = tonum(p1);
        if(isInt(p1) && numCheck(p1, "-1 <= n")) {
          beatmap.general.previewTime = p1;
        }
      } ,
      "Countdown: (.+)": (p1) => {
        p1 = tonum(p1);
        if(isInteger(p1) && numCheck(p1, "0 <= n && n <= 3")) {
          beatmap.general.countdown = p1;
        }
      },
      "SampleSet: (.+)": (p1) => {
        if(oneOf(p1, ["Normal","Soft","Drum"])) {
          beatmap.general.sampleSet = p1;
        }
      },
      "StackLeniency: (.+)": (p1) => {
        p1 = tonum(p1);
        if(numCheck(p1, "0 <= n && n <= 1")) {
          beatmap.general.stackLeniency = p1;
        }
      },
      "Mode: (.+)": (p1) => {
        p1 = tonum(p1);
        if(isInt(p1) && numCheck(p1, "0 <= n && n <= 3")) {
          beatmap.general.modeName = ["osu!","osu!taiko","osu!catch","osu!mania"][p1];
          beatmap.general.mode = p1;
        }
      },
      "LetterboxInBreaks: (.+)": (p1) => {
        p1 = tonum(p1);
        if(numCheck(p1, "n == 0 || n == 1")) {
          beatmap.general.letterboxInBreaks = !!p1;
        }
      },
      "UseSkinSprites: (.+)": (p1) => {
        p1 = tonum(p1);
        if(numCheck(p1, "n == 0 || n == 1")) {
          beatmap.general.useSkinSprites = !!p1;
        }
      },
      "OverlayPosition: (.+)": (p1) => {
        if(oneOf(p1, ["NoChange","Below","Above"])) {
          beatmap.general.overlayPosition = p1;
        }
      },
      "SkinPreference: (.+)": (p1) => {
        beatmap.general.skinPreference = p1;
      },
      "EpilepsyWaring: (.+)": (p1) => {
        p1 = tonum(p1);
        if(numCheck(p1, "n == 0 || n == 1")) {
          beatmap.general.epilepsyWaring = !!p1;
        }
      },
      "CountdownOffset: (.+)": (p1) => {
        p1 = tonum(p1);
        if(numCheck(p1, "0 <= n && n <= 3")) {
          beatmap.general.countdownOffset = p1;
        }
      },
      "SpecialStyle: (.+)": (p1) => {
        p1 = tonum(p1);
        if(numCheck(p1, "n == 0 || n == 1")) {
          beatmap.general.specialStyle = !!p1;
        }
      },
      "WidescreenStoryboard: (.+)": (p1) => {
        p1 = tonum(p1);
        if(numCheck(p1, "n == 0 || n == 1")) {
          beatmap.general.widescreenStoryboard = !!p1;
        }
      },
      "SamplesMatchPlaybackRate: (.+)": (p1) => {
        p1 = tonum(p1);
        if(numCheck(p1, "n == 0 || n == 1")) {
          beatmap.general.samplesMatchPlaybackRate = !!p1;
        }
      }
    },
    "Editor": {
      "Bookmarks: (.+)": (p1) => {
        beatmap.editor.bookmarks = p1.split(",");
      },
      "DistanceSpacing: (.+)": (p1) => {
        p1 = tonum(p1);
        if(numCheck(p1, "0.1 <= n && n <= 6")) {
          beatmap.editor.distanceSpacing = p1;
        }
      },
      "BeatDivisor: (.+)": (p1) => {
        p1 = tonum(p1);
        if(isInt(p1) && numCheck(p1, "1 <= n && n <= 16")) {
          beatmap.editor.beatDivisor = p1;
        }
      },
      "GridSize: (.+)": (p1) => {
        p1 = tonum(p1);
        if(oneOf(p1, [4,8,16,32])) {
          beatmap.editor.gridSize = p1;
        }
      },
      "TimelineZoom: (.+)": (p1) => {
        p1 = tonum(p1);
        if(numCheck(p1, "0.1 <= n && n <= 8")) {
          beatmap.editor.timelineZoom = p1;
        }
      }
    },
    "Metadata": {
      "Title:(.+)": (p1) => {
        if(ASCIICheck(p1)) {
          beatmap.metadata.title = p1;
        }
      },
      "TitleUnicode:(.+)": (p1) => {
        beatmap.metadata.titleUnicode = p1;
      },
      "Artist:(.+)": (p1) => {
        if(ASCIICheck(p1)) {
          beatmap.metadata.artist = p1;
        }
      },
      "ArtistUnicode:(.+)": (p1) => {
        beatmap.metadata.artist = p1;
      },
      "Creator:(.+)": (p1) => {
        beatmap.metadata.creator = p1;
      },
      "Version:(.+)": (p1) => {
        beatmap.metadata.version = p1;
      },
      "Source:(.+)": (p1) => {
        beatmap.metadata.source = p1;
      },
      "Tags:(.+)": (p1) => {
        beatmap.metadata.tags = p1.split(" ");
      },
      "BeatmapID:(.+)": (p1) => {
        p1 = tonum(p1);
        if(isInt(p1) && numCheck(p1, "0 <= n")) {
          beatmap.metadata.beatmapID = p1;
        }
      },
      "BeatmapSetID:(.+)": (p1) => {
        p1 = tonum(p1);
        if(isInt(p1) && numCheck(p1, "-1 <= n")) {
          beatmap.metadata.beatmapSetID = p1;
        }
      }
    },
    "Difficulty": {
      "HPDrainRate:(.+)": (p1) => {
        p1 = tonum(p1);
        if(numCheck(p1, "0 <= n && n <= 10")) {
          beatmap.difficulty.HPDrainRate = p1;
        }
      },
      "CircleSize:(.+)": (p1) => {
        p1 = tonum(p1);
        if(numCheck(p1, "0 <= n && n <= 10")) {
          beatmap.difficulty.HPDrainRate = p1;
        }
      },
      "OverrallDifficulty:(.+)": (p1) => {
        p1 = tonum(p1);
        if(numCheck(p1, "0 <= n && n <= 10")) {
          beatmap.difficulty.HPDrainRate = p1;
        }
      },
      "ApproachRate:(.+)": (p1) => {
        p1 = tonum(p1);
        if(numCheck(p1, "0 <= n && n <= 10")) {
          beatmap.difficulty.HPDrainRate = p1;
        }
      },
      "SliderMultiplier:.+",
      "SliderTiclRate:.+"
    },
    "Events": [
      ".+"
    ],
    "TimingPoints": [
      ".+"
    ],
    "Colours": [
      "Combo1 : .+",
      "Combo2 : .+",
      "Combo3 : .+",
      "Combo4 : .+",
      "Combo5 : .+",
      "Combo6 : .+",
      "Combo7 : .+",
      "Combo8 : .+",
      "Combo9 : .+"
    ],
    "HitObjects": [
      ".+"
    ]
  };
  raw = raw.split("\n");
  let category, beatmap = new Object();
  for(let i = 0; i < raw.length; i++) {
    let match = raw[i].match(/^\[(General|Editor|Metadata|Difficulty|Events|TimingPoints|Colours|HitObjects)\]$/);
    if(match) {
      category = match[1];
      continue;
    }
    for(let key in rule[category]) {
      let match = raw[i].match(new RegExp("^" + key + "$"));
      if(match) {
        rule[category][key](match[1]);
      }
    }
  }
}
