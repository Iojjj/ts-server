const gulp = require("gulp");
const merge = require("merge2");
const sourcemaps = require("gulp-sourcemaps");
const spawn = require("child_process").spawn;
const gulpTs = require("gulp-typescript");
const runSequence = require('gulp-run-sequence');
const plumber = require("gulp-plumber");

const sources = ["./src/**/*.ts", "./samples/**/*.ts", "./tests/**/*.ts"];

const tsProject = gulpTs.createProject("tsconfig.json");

gulp.task("build:ts", () => {
    "use strict";
    const res = gulp.src(sources, {base: "."})
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(tsProject());
    return merge([
        res.dts.pipe(gulp.dest("build/definitions")),
        res.js
            .pipe(sourcemaps.write())
            .pipe(gulp.dest("build/js"))
    ]);
});

let node;

gulp.task('server', () => {
    if (node) node.kill();
    node = spawn('node', ['build/js/samples/express/index.js'], {stdio: 'inherit'});
    node.on('close', function (code) {
        if (code === 8) {
            gulp.log('Error detected, waiting for changes...');
        }
    });
});

gulp.task("watch", ["build:ts"], () => {
    "use strict";
    gulp.run("server");
    gulp.watch(sources, () => {
        runSequence("build:ts", "server");
    });
});

process.on('exit', function() {
    if (node) node.kill()
});