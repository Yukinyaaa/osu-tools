<!DOCTYPE html>
<html lang="jq">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>osu replay (.osr) parser</title>
  <script src="./lzma_worker.js"></script>
  <style>
    .file-input {
      display: flex;
      align-items: center;
    }
    .file-label {
      user-select: none;
      cursor: pointer;
      border: grey 1.5px solid;
      border-radius: 5px;
      width: 125px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: black 1px 1px 1px;
      position: relative;
    }
    .file-label:active {
      left: 1px;
      top: 1px;
      box-shadow: none;
    }
    .file-elm {
      display: none;
    }
    .err {
      margin-left: 10px;
    }
    .result {
      margin-top: 10px;
      width: 100%;
      height: 600px;
      font-size: 16px;
      white-space: nowrap;
    }
  </style>
</head>
<body>
  <div class="file-input">
    <label for="file" class="file-label">ファイルを選択</label>
    <input type="file" id="file" accept=".osr" class="file-elm">
    <span id="err" class="err"></span>
  </div>
  <textarea id="result" class="result"></textarea>
  <script>
    function err(data) {
      document.getElementById("err").innerHTML = data;
    }
    function readAsArrayBufferReader(file) {
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onerror = () => {
          reader.abort();
          reject('Unknown error occurred during reading the file');
        };
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.readAsArrayBuffer(file);
      });
    };
    document.getElementById("file").addEventListener("change", (e) => {
      let file = e.target.files;
      if(file.length == 0 || file[0] == undefined) {
        err("ファイルが選択されていません");
      }
      if(file.length != 1) {
        err("複数ファイルは選択できません。");
      }
      file = file[0];
      if(file.name.substr(-4) != ".osr") {
        err("選択可能なファイル拡張子は.osrのみです");
      }
      readAsArrayBufferReader(file)
        .then(buff => {
          let s = '';
          let uint8 = new Uint8Array(buff);
          function byteToInt(bytes) {
            return BigInt("0x" + 
              [...bytes].map(value => {
                return value.toString(16).padStart(2, '0');
              }).reverse().join("")
            );
          }
          function getbytes(len) {
            let index2 = index;
            index+=len;
            if(len == 1) return uint8[index2];
            return byteToInt(uint8.slice(index2, index2 + len));
          }
          function getString() {
            if(uint8[index] != 0x0b) {
              throw new Error("文字列ではない");
            }
            let i = index, index2 = index, diff = 0;
            let quantity = "";
            while(true) {
              i++, diff++;
              let b = uint8[i].toString(2).padStart(8, "0");
              quantity = b.substr(1) + quantity;
              if(b.substr(0, 1) == "1") {
                continue;
              } else
              if(b.substr(0, 1) == "0") {
                break;
              } else {
                throw new Error();
              }
            }
            quantity = parseInt(quantity, 2);
            index = i + quantity + 1;
            return String.fromCodePoint(...uint8.slice(index2 + diff + 1, index2 + diff + 1 + quantity));
          }
          function log_append(data) {
            s += data + "\n";
          }
          let index = 0, byte_length;
          log_append("mode: " + getbytes(1));
          log_append("version: " + getbytes(4));
          log_append("beatmapMD5: " + getString());
          log_append("player: " + getString());
          log_append("replayMD5: " + getString());
          log_append("300s: " + getbytes(2));
          log_append("100s: " + getbytes(2));
          log_append("50s: " + getbytes(2));
          log_append("Gekis: " + getbytes(2));
          log_append("Katus: " + getbytes(2));
          log_append("misses: " + getbytes(2));
          log_append("score: " + getbytes(4));
          log_append("max combo: " + getbytes(2));
          log_append("perfect: " + Boolean(getbytes(1)));
          log_append("mods: " + getbytes(4));
          log_append("life bar: " + getString());
          log_append("timestamp: " + getbytes(8));
          let data_length = Number(getbytes(4));
          log_append("replay data length: " + data_length);
          log_append("replay data: " + LZMA.decompress(uint8.slice(index, index + data_length)));
          let pre = document.getElementById('result');
          pre.value = s;
        })
      });
  </script>
</body>
</html>
