const gulp = require('gulp');
const { src, dest, series, parallel, watch } = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const rigger = require('gulp-rigger');
const del = require('del');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const cache = require('gulp-cache');
const server = require('browser-sync').create();
const svgSprite = require('gulp-svg-sprite');
const svgmin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');
const groupMedia = require('gulp-group-css-media-queries');
const rename = require('gulp-rename');
const cleanCss = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const webp = require('gulp-webp');
const imageCompress = require('imagemin-jpeg-recompress');
const imageWebp = require('imagemin-webp');
const uglify = require('gulp-uglify-es');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const webpack = require('webpack-stream');

const path = {
  build: {
    html: 'build/',
    css: 'build/css/',
    js: 'build/js/',
    img: 'build/img/',
    fonts: 'build/fonts/',
  },
  src: {
    html: 'src/*.html',
    css: 'src/styles/main.scss',
    js: 'src/js/main.js',
    img: ['src/img/**/*.{jpg,png,svg,gif,ico,webp}', '!src/img/sprite/**'],
    svgIcon: 'src/img/sprite/icon-*.svg',
    fonts: 'src/fonts/*.ttf',
  },
  watch: {
    html: ['src/*.html', 'src/templates/*.html'],
    css: ['src/styles/*.scss', 'src/styles/partials/*.scss'],
    js: ['src/js/*.js', 'src/js/partials/*.js'],
    img: [
      'src/img/**/*.{jpg, png, svg, gif, ico, webp}',
      '!src/img/svg/icon-*.svg',
    ],
    fonts: 'src/fonts/*.ttf',
  },
  clean: './build',
};

const serverConfig = {
  server: {
    baseDir: './build',
  },
  // tunnel: true,
  port: 8000,
  host: 'localhost',
  logPrefix: 'Frontend_Devil',
  notify: false,
};

const isDev = true;

const webpackConfig = {
  output: {
    filename: 'script.js',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: '/node_modules/',
        loader: 'babel-loader',
        // use: {
        //   loader: 'babel-loader',
        //   options: {
        //     presets: [['@babel/preset-env', {
        //         debug: true,
        //         corejs: 3,
        //         useBuiltIns: "usage"
        //     }]]
        //   }
        // }
      },
    ],
  },
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'eval-source-map' : 'none',
};

function htmlBuild() {
  return src(path.src.html)
    .pipe(rigger())
    .pipe(dest(path.build.html))
    .pipe(server.stream());
}

function styleBuild() {
  return src(path.src.css)
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: 'expanded',
      }),
    )
    .pipe(groupMedia())
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(rename('style.css'))
    .pipe(dest(path.build.css))
    .pipe(server.stream());
}

function styleProd() {
  return src(path.src.css)
    .pipe(
      sass({
        outputStyle: 'expanded',
      }),
    )
    .pipe(groupMedia())
    .pipe(autoprefixer())
    .pipe(cleanCss())
    .pipe(
      rename({
        extname: '.min.css',
      }),
    )
    .pipe(dest(path.build.css));
}

function jsBuild() {
  return src(path.src.js)
    .pipe(webpack(webpackConfig))
    .pipe(dest(path.build.js))
    .pipe(server.stream());
}

function imgWebp() {
  return src(path.src.img)
    .pipe(webp({ quality: 70 }))
    .pipe(dest(path.build.img));
}

function imgBuild() {
  return src(path.src.img)
    .pipe(
      cache(
        imagemin([
          imagemin.gifsicle({ interlaced: true }),
          imageCompress({
            loops: 4,
            min: 70,
            max: 80,
            quality: 'high',
          }),
          imagemin.optipng({ optimizationLevel: 5 }),
          imagemin.svgo({
            plugins: [{ removeViewBox: false }, { cleanupIDs: false }],
          }),
        ]),
      ),
    )
    .pipe(dest(path.build.img))
    .pipe(server.stream());
}

function svgSpriteIcon() {
  return src(path.src.svgIcon)
    .pipe(
      cheerio({
        run($) {
          $('[fill]').removeAttr('fill');
          $('[stroke]').removeAttr('stroke');
          $('[style]').removeAttr('style');
        },
        parserOptions: { xmlMode: false },
      }),
    )
    .pipe(replace('&gt;', '>'))
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            sprite: 'icon-sprite.svg',
          },
        },
      }),
    )
    .pipe(dest(path.build.img));
}

function fontTtf2woff() {
  return src(path.src.fonts).pipe(ttf2woff()).pipe(dest(path.build.fonts));
}

function fontTtf2woff2() {
  return src(path.src.fonts).pipe(ttf2woff2()).pipe(dest(path.build.fonts));
}

function watchFiles() {
  // gulp.watch(path.watch.html).on('change', gulp.series(htmlBuild, server.reload));
  watch(path.watch.html, htmlBuild);
  watch(path.watch.css, styleBuild);
  watch(path.watch.js, jsBuild);
  watch(path.watch.img, parallel(imgBuild, imgWebp));
}

function webserver() {
  return server.init(serverConfig);
}

function clean() {
  return del(path.clean);
}

// function build(done) {
//   parallel(htmlBuild, styleBuild, jsBuild, imgBuild);
//   done();
// }

// gulp.task('webserver', webserver);

gulp.task('img:clean', done => {
  del.sync(`${path.clean}/img`);
  done();
});

gulp.task('html:build', htmlBuild);

gulp.task('style:build', styleBuild);

gulp.task('js:build', jsBuild);

gulp.task('img:build', imgBuild);

gulp.task('sprite:build', svgSpriteIcon);

gulp.task('clean', clean);
// gulp.task('build', build);

// gulp.task('watch', series(webserver, watchFiles));

// gulp.task('default', series(webserver, watchFiles));

const convertFonts = parallel(fontTtf2woff, fontTtf2woff2);
const imageMin = parallel(imgBuild, imgWebp, svgSpriteIcon);
const cleanBuild = series(clean);
const build = parallel(htmlBuild, styleBuild, jsBuild, imageMin, convertFonts);
const watchBuild = series(clean, build, parallel(watchFiles, webserver));

exports.convertFonts = convertFonts;
exports.cleanBuild = cleanBuild;
exports.build = build;
exports.watchBuild = watchBuild;
exports.default = watchBuild;
