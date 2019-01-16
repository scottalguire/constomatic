# constomatic

## Install

`$ npm install -D constomatic`

## Usage

Gulp not required, but recommended.

Create a gulp task. [_(See options reference below)_](#options)

**/gulpfile.js** _(Gulp v3 example)_

```javascript
var constomatic = require("constomatic");

gulp.task("hash-css", function() {
  constomatic({
    src: "functions.php",
    dest: "/",
    constNames: ["CSS_VERSION", "JS_VERSION"]
  });
});
```

**/gulpfile.js** _(Gulp v4 example)_

```javascript
var constomatic = require("constomatic");

const updateStylesVersion = cb => {
  constomatic({
    src: "functions.php",
    dest: "/",
    constNames: ["CSS_VERSION"],
    hashLength: 7
  });
  cb();
};
```

Create at least one const (define style) definition in your _src_ php file and set any alphanumeric string as the value.

**/functions.php**

```php
define('CSS_VERSION', 'abc123');
define('JS_VERSION', 'abc123');
```

Run the task in terminal, or set it as a part of your watch setup.

**Add to a watch task (gulp@v3)**

```javascript
gulp.task("default", ["browser-sync"], function() {
  gulp.watch("library/scss/**/*.scss", ["styles", "hash-css"]);
  gulp.watch("*.php", ["bs-reload"]);
});
```

**or gulp@v4**

```javascript
const watchStyles = () => {
  watch("library/scss/**/*.scss", series(compileStyles, updateStylesVersion));
};
```

Check out your newly hashed values in your php file.

**/functions.php**

```php
define('CSS_VERSION', 'gbkPNaG');
define('JS_VERSION', 'iO75jf5');
```

Now you can echo the const values into any corresponding **wp_register_style/script** statements

## Options

**src**

Type: `String`  
Default: `"/build/functions.php"`

Path to the source file. Usually set to `"/functions.php"`

**dest**

Type: `String`  
Default: `"/build"`

Path to the folder where file with the hashed consts will be output. Usually set to `"/"`

**constName**

Type: `Array`

Accepts an array of php constant names to be hashed

**hashLength**

Type: `Number`  
Default: `6`

Specifies the number of characters to be used in the hashed value provided to each constant

---

**semVer** - _Experimental Only! This feature is in development_

Type: `Boolean`  
Default: `false`

"Semantic-ish" versioning. Turning this on will increment a 0-9 counter using a format matching `define('CONST_NAME', '1.0.0');`

## LICENSE

MIT
