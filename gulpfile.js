var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sass = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps");
var browserSync = require("browser-sync");
var hashomatic = require("./index.js");

//local Tasks
gulp.task("hashomatic", function() {
  hashomatic({
    inFilePath: "/functions.php",
    outPath: "/",
    constNames: ["CSS_VERSION"],
    semVer: false,
    hashLength: 7
  });
});

gulp.task("browser-sync", function() {
  browserSync({
    domain: "localhost:3000"
  });
});

gulp.task("bs-reload", function() {
  browserSync.reload();
});

gulp.task("styles", function() {
  gulp
    .src(["library/scss/**/*.scss"])
    .pipe(
      plumber({
        errorHandler: function(error) {
          console.log(error.message);
          this.emit("end");
        }
      })
    )
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("library/css/"))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("default", ["browser-sync"], function() {
  gulp.watch("library/scss/**/*.scss", ["styles", "hashomatic"]);
  gulp.watch("*.php", ["bs-reload"]);
});
