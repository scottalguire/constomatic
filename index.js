var fs = require("fs");
var path = require("path");
var colors = require("colors");
var check = require("check-types");

var hashomatic = function(settings) {
  /**
   * Default settings + user settings
   */
  const config = {
    inFilePath: "/build/functions.php",
    outPath: "/build",
    constNames: [],
    semVer: false,
    hashLength: 6,
    ...settings
  };

  checkSettingsTypes(config);

  function checkSettingsTypes(config) {
    let checkTypes = check.all(
      check.map(
        {
          ...config
        },
        {
          inFilePath: check.string,
          outPath: check.string,
          constNames: check.array,
          semVer: check.boolean,
          hashLength: check.number
        }
      )
    );

    if (!checkTypes) {
      console.log(checkTypes);
      throw new TypeError(
        colors.red(
          `One of the hash-o-matic config options is the wrong type. Check your gulpfile.`
        )
      );
    } else {
      init();
    }
  }

  function init() {
    /**
     * Read the input .php file, call modifyInputData with php data
     */
    fs.readFile(__dirname + config.inFilePath, "utf8", function(err, data) {
      if (err) {
        return console.log(err);
      }

      modifyInputData(data)
        .then(res => {
          // call replacement func, have it return promise .then( res => writeNewFile ( response ) )
          // console.log(res);
          writeNewFile(res);
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  /**
   * Write output to a new .php file
   * @param {String} data
   */
  function writeNewFile(data) {
    // console.log(data);
    fs.mkdir(__dirname + config.outPath, { recursive: true }, err => {
      // build folder exists just update file
      // if build folder doesnt exist create it, and writeNewFile ( recursive )
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

  /**
   * Takes a php constant name, returns a RegEx that searches for "define('PHP_CONST_NAME', 'd.d.d');"
   * @param {String} phpConstName
   */
  function makeRegEx(phpConstName) {
    let m1 = "(define)(\\()(\\s?)(\\')(";
    let m2;
    if (config.semVer) {
      m2 = ")(\\')(,)(\\s?)(\\')(\\d)(.)(\\d)(.)(\\d)(\\')(\\s?)(\\))(;)";
    } else {
      m2 = ")(\\')(,)(\\s?)(\\')(\\w+)(\\')(\\s?)(\\))(;)";
    }
    return new RegExp(m1 + phpConstName + m2, ["i"]);
  }

  /**
   * Returns a random alphanumeric hash, hlength characters long
   * @param {Number} hlength
   */
  function randHash(hlength) {
    let hash = "";
    let possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < hlength; i++) {
      hash += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    // console.log(hash);
    return hash;
  }

  /**
   * Performs string replacement, recieves a PHP constant name, and RegEx
   * @param {String} phpConstName
   * @param {RegEx} customRegEx
   * @returns {Promise} prom1
   */
  function modifyInputData(phpSource) {
    let matches = [];
    let newFile = phpSource; //save copy of source data

    config.constNames.forEach(name => {
      // find each php constant in the source in a loop
      let phpConst = newFile.match(makeRegEx(name)); // ['define('CSS_VERSION', '1.0.0');', 'define', '(', ... ]
      if (phpConst != null) {
        phpConst.splice(0, 1); // remove first index
        let foundConst = phpConst.join(""); // define('CSS_VERSION', '1.0.0');
        console.log(
          `\n${colors.rainbow(
            "HASH-O-MATIC"
          )}: found php constant "${colors.green(foundConst)}", in file ${
            config.inFilePath
          }. \n`
        );
        matches.push({ name: name, def: foundConst });
      } else {
        console.log(
          `\n${colors.rainbow("HASH-O-MATIC")}: ${colors.red(
            `Error: No php constants found to hash.`
          )}`
        );
        matches = false;
      }
    });

    if (matches) {
      if (config.semVer) {
        let semMatcher = new RegExp(/(\d)(.)(\d)(.)(\d)/);
        // reduce found php const string to it's semantic version
        let semFound = foundConst.match(semMatcher);
        let semArr = semFound[0].split("."); // [ '1.0.0' ] => [ '1', '0', '0' ]
        let newVersion = inc(semArr).join(".");
        let newPhpConst = `define('CSS_VERSION', '${newVersion}');`;
        let newFile = phpSource.replace(customRegEx, newPhpConst);
        return new Promise((resolve, reject) => {
          resolve(newFile);
        });
      } else {
        matches.forEach(curConst => {
          // let hashMatcher = new RegExp(/(\s?)(\,)(\')(\w+)(\')(\))(;)/);
          // reduce found php const string to it's semantic version
          // let hashFound = curConst.def.match(hashMatcher);
          let newHash = randHash(config.hashLength);
          let newPhpConst = `define('${curConst.name}', '${newHash}');`;
          newFile = newFile.replace(curConst.def, newPhpConst);
        });

        return new Promise((resolve, reject) => {
          resolve(newFile);
        });
      }
    } else {
      return new Promise((resolve, reject) => {
        reject(colors.red(`Hashomatic aborted.`));
      });
    }
  }

  /**
   * Semantic-ish versioning counter, bumps a three digit version ie. "1.0.0" up to 9 digits
   * Allows for exactly 1000 versions, then restarts at 1
   * @param {Array} arr
   */
  function inc(arr) {
    /**
     *	bumps semantic version. ( ie. 1.0.0 => 1.0.1 )
     * @private
     * @param {String} arr
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
};

module.exports = hashomatic;
