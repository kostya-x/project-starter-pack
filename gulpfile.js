const gulp = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync");
const cssnano = require("gulp-cssnano");
const rename = require("gulp-rename");
const rigger = require("gulp-rigger");
const sourcemaps = require("gulp-sourcemaps");
const htmlmin = require("gulp-htmlmin");
const del = require("del");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const imagemin = require("gulp-imagemin");
const pngquant = require("imagemin-pngquant");
const cache = require("gulp-cache");
const autoprefixer = require("gulp-autoprefixer");
const plumber = require("gulp-plumber");
const sassGlob = require("gulp-sass-glob");

gulp.task("clear", () => {
  return cache.clearAll();
});

gulp.task("clean", async () => {
  return del.sync("build");
});

gulp.task("browser-sync", () => {
  browserSync({
    server: {
      baseDir: "./build"
    },
    notify: false
  });
});

gulp.task("html", () => {
  return gulp
    .src(["src/**/*.html", "!src/components/**/*.*"], {
      cwd: ""
    })
    .pipe(plumber())
    .pipe(rigger())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("styles", () => {
  return gulp
    .src("src/styles/**/*.+(scss|sass|css)")
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(cssnano())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("build"))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("scripts", () => {
  return gulp
    .src("src/scripts/*.js")
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(rigger())
    .pipe(uglify())
    .pipe(gulp.dest("build"))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("images", () => {
  return gulp
    .src("src/images/**/*")
    .pipe(plumber())
    .pipe(
      cache(
        imagemin({
          interlaced: true,
          progressive: true,
          svgoPlugins: [{ removeViewBox: false }],
          use: [pngquant()]
        })
      )
    )
    .pipe(gulp.dest("build/images"));
});

gulp.task("watch", () => {
  gulp.watch("src/**/*.html", gulp.parallel("html"));
  gulp.watch("src/styles/**/*.*", gulp.parallel("styles"));
  gulp.watch("src/scripts/**/*.js", gulp.parallel("scripts"));
  gulp.watch("src/images/**/*.*", gulp.parallel("images"));
});

gulp.task(
  "build",
  gulp.parallel("clean", "html", "styles", "images", "scripts")
);

gulp.task(
  "start",
  gulp.parallel(
    "clean",
    "html",
    "styles",
    "images",
    "scripts",
    "browser-sync",
    "watch"
  )
);
