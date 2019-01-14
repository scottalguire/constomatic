# hash-o-matic

## How it works

Create a gulp task. _(See options reference below)_

**/gulpfile.js**

```javascript
gulp.task("hash-css", function() {
  hashomatic({
    inFilePath: "/functions.php",
    outPath: "/",
    constNames: ["CSS_VERSION", "JS_VERSION"],
    semVer: false,
    hashLength: 7
  });
});
```

Create at least one const (define style) definition in your _inFilePath_ php file and set any alphanumeric string as the value.

**/functions.php**

```php
define('CSS_VERSION', 'abc123');
define('JS_VERSION', 'abc123');
```

Run the task in terminal, or set it as a part of your watch setup.

**In terminal**

`$ gulp hash-css`

**(or more likely, a watch task)**

```javascript
gulp.task("default", ["browser-sync"], function() {
  gulp.watch("library/scss/**/*.scss", ["styles", "hash-css"]);
  gulp.watch("*.php", ["bs-reload"]);
});
```

Check out your newly hashed values in your php file.

**/functions.php**

```php
define('CSS_VERSION', 'gbkPNaG');
define('JS_VERSION', 'iO75j');
```

Now you can echo the const values into any corresponding **wp_register_style/script** statements

## Options

Create a gulp task with the following options.

**inFilePath {string}**: (Recommended, default: "/build/functions.php") Where the file is you are going to be using as the source

**outPath {string}**: (Recommended, default: "/build") Where the new file with the hashed consts will be output (make this the same as inFilePath to update hash more than once)

**constName {array}**: (Required) Accepts an array of php constant names to be hashed

**semVer {boolean}**: (Optional, default: false) Turning this on will increment consts with a value scheme that matches 0.0.0. _NOTE: this feature has not been tested fully, inFilePath file must have exisiting define('CONST_NAME', '1.0.0');_

**hashLength {number}**: (Optional, default: 6) Specifies the number of characters to be used in the hashed value provided to each constant
