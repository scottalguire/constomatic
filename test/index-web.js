/** 
@description Button for Semantic Version Incrementing
@author Scott Alguire
@example: define('CSS_VERSION', '1.0.0'); => define('CSS_VERSION', '1.0.1');
@usage Click the button to handleClick version. In reality this would be performed by a node task so that saving a CSS file will trigger an fs.readFile/fs.writeFile to incerement a functions.php file automtically.
**/

const Button = function() {
  let phpSource = `
<?php 
	// PHP Constant for incrementing css version
	define( 'CSS_VERSION', '1.0.0' );
	register_style( 'css', 'file.css'. '?v=' . $CSS_VERSION, array(), null );
?>`;

  let btnEl = {
    render: function() {
      this.btnelement = document.createElement("button");
      this.btnelement.className = "btn";
      this.btnelement.value = "Increment Version";
      this.btnelement.textContent = "+ Increment Version";

      this.versionBox = document.createElement("div");
      this.versionBox.className = "container";

      this.versionP = document.createElement("p");
      this.versionP.id = "version";
      this.versionNum = document.createTextNode("");

      this.pre = document.createElement("PRE");

      document.body.appendChild(this.btnelement);
      document.body.appendChild(this.versionBox);
      this.versionBox.appendChild(this.versionP);
      this.versionP.appendChild(this.versionNum);
      document.body.appendChild(this.pre);
    },
    handleClick: function() {
      this.constMatcher = new RegExp(
        /(define)(\()(\s?)(\')(CSS_VERSION)(\')(,)(\s?)(\')(\d)(\.)(\d)(\.)(\d)(\')(\s?)(\))(;)/,
        ["i"]
      );

      // find const string in fs.readFile response (phpSource)
      let phpConst = phpSource.match(this.constMatcher); // ['define('CSS_VERSION', '1.0.0');', 'define', '(', ... ]
      phpConst.splice(0, 1); // remove first index
      this.foundConst = phpConst.join(""); // define('CSS_VERSION', '1.0.0');

      // reduce found php const string to it's semantic version
      this.semMatcher = new RegExp(/(\d)(.)(\d)(.)(\d)/);
      this.semFound = this.foundConst.match(this.semMatcher);
      let semArr = this.semFound[0].split("."); // [ '1.0.0' ] => [ '1', '0', '0' ]

      // call and save new version
      let newVersion = btnEl.bump(semArr).join(".");
      this.oldNum = document.getElementById("version");
      this.newVerEl = document.createTextNode(this.versionNum);
      this.newPhpConst = `define('CSS_VERSION', '${newVersion}');`;
      this.oldNum.textContent = this.newPhpConst;

      let newFile = phpSource.replace(this.constMatcher, this.newPhpConst);
      phpSource = newFile;

      btnEl.pre.textContent = phpSource;
      // console.log(newFile);
    },
    bump: function(arr) {
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
          major++;
          minor = 0;
          patch = 0;
        }
      }

      return [major, minor, patch];
    }
  };

  function init() {
    btnEl.render();
    attachEvents();
  }

  function attachEvents() {
    btnEl.btnelement.addEventListener("click", btnEl.handleClick);
  }

  return {
    init: init
  };
};

window.addEventListener("load", function() {
  let btn = new Button();
  btn.init();
});
