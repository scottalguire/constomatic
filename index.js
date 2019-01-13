var fs = require("fs");
var path = require("path");
var colors = require("colors");

var bump = function(settings) {
  const config = {
    inFilePath: "/build/functions.php",
    outPath: "/build",
    constName: "CSS_VERSION",
    ...settings
  };
  console.log(config);

  fs.readFile(__dirname + config.inFilePath, "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    }

    doBump(data)
      .then(res => {
        // call replacement func, have it return promise .then( res => updateFile ( response ) )
        // console.log(res);
        updateFile(res);
      })
      .catch(err => {
        console.log(err);
      });
  });

  function updateFile(data) {
    // console.log(data);
    fs.mkdir(__dirname + config.outPath, { recursive: true }, err => {
      // build folder exists just update file
      // if build folder doesnt exist create it, and updateFile ( recursive )
      fs.writeFile(
        path.join(__dirname + config.inFilePath),
        data,
        "utf8",
        function(err) {
          if (err) {
            return console.log(err);
          }
          console.log(
            colors.green(
              `New file written to ${__dirname +
                config.outPath +
                config.inFilePath}`
            )
          );
        }
      );
    });
  }

  function doBump(phpSource) {
    // const constName = config.constName;
    // const regExpBuilder = [
    //   "/(define)(()(s?)(')",
    //   constName,
    //   ")(')(,)(s?)(')(d)(.)(d)(.)(d)(')(s?)())(;)/"
    // ];
    const phpConstMatcher = new RegExp(
      /(define)(\()(\s?)(\')(CSS_VERSION)(\')(,)(\s?)(\')(\d)(\.)(\d)(\.)(\d)(\')(\s?)(\))(;)/,
      ["i"]
    );
    // const phpConstMatcher = new RegExp(regExpBuilder, ["i"]);
    let phpConst = phpSource.match(phpConstMatcher); // ['define('CSS_VERSION', '1.0.0');', 'define', '(', ... ]
    phpConst.splice(0, 1); // remove first index

    let foundConst = phpConst.join(""); // define('CSS_VERSION', '1.0.0');

    let semMatcher = new RegExp(/(\d)(.)(\d)(.)(\d)/);

    // reduce found php const string to it's semantic version
    let semFound = foundConst.match(semMatcher);
    let semArr = semFound[0].split("."); // [ '1.0.0' ] => [ '1', '0', '0' ]

    // call and save new version
    let newVersion = inc(semArr).join(".");
    let newPhpConst = `define('CSS_VERSION', '${newVersion}');`;

    let newFile = phpSource.replace(phpConstMatcher, newPhpConst);

    let prom1 = new Promise((resolve, reject) => {
      resolve(newFile);
      reject("Error!");
    });

    return prom1;

    function randHash() {
      let rand = "";
      let possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (let i = 0; i < 6; i++) {
        rand += possible.charAt(Math.floor(Math.random() * possible.length));
      }

      console.log(rand);

      this.setState({
        localInputs: {
          uniquePass: rand
        }
      });
    }

    function inc(arr) {
      /**
       *	bumps semantic version. ( ie. 1.0.0 => 1.0.1 )
       * @private
       * @param {string} arr
       **/

      let major = arr[0];
      let minor = arr[1];
      let patch = arr[2];

      if (patch < 9) {
        patch++;
      } else if (patch == 9) {
        if (minor < 9) {
          minor++;
          patch = 0;
        } else if (minor == 9) {
          if (major < 9) {
            major++;
            minor = 0;
            patch = 0;
          } else if (major == 9) {
            major = 1;
            minor = 0;
            patch = 0;
          }
        }
      }

      return [major, minor, patch];
    }
  }

  // function ensureDirectoryExistence(filePath, data) {
  //   let data = data;
  //   if (fs.existsSync(filePath)) {
  //     updateFile(data);
  //     return true;
  //   }
  //   fs.mkdirSync(filePath);
  //   ensureDirectoryExistence(filePath);
  // }
};

module.exports = bump;
