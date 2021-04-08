let fileswatch = 'php,html,htm,txt,json,md,woff,woff2';
let online = true;

const { src, dest, parallel, series, watch } = require('gulp');
const browserSync  = require('browser-sync').create();
const webpack      = require('webpack-stream');
const sass         = require('gulp-sass');
const sassglob     = require('gulp-sass-glob');
const cleancss     = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename       = require('gulp-rename');
const imagemin     = require('gulp-imagemin');
const newer        = require('gulp-newer');
const del          = require('del');

function browsersync() {
  browserSync.init({
    server: { baseDir: 'src' },
    notify: false,
    online: online
  })
}

function scripts() {
	return src(['src/js/index.js'])
		.pipe(webpack({
			mode: 'production',
			performance: { hints: false },
      // devtool: 'eval-source-map',
			module: {
				rules: [
					{
						test: /\.(js)$/,
						exclude: /(node_modules)/,
						loader: 'babel-loader',
						query: {
							presets: ['@babel/env'],
							plugins: ['babel-plugin-root-import', '@babel/plugin-proposal-class-properties']
						}
					}
				]
			}
		})).on('error', function handleError() {
			this.emit('end')
		})
		.pipe(rename('index.min.js'))
		.pipe(dest('src/js'))
		.pipe(browserSync.stream())
}

function styles() {
	return src('src/sass/main.sass')
    .pipe(sassglob())
    .pipe(sass())
		.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
		.pipe(cleancss({ level: { 1: { specialComments: 0 } },/* format: 'beautify' */ }))
		.pipe(rename({ suffix: ".min" }))
		.pipe(dest('src/css'))
		.pipe(browserSync.stream())
}

function images() {
  return src('src/img/*')
  .pipe(newer('dist/img'))
  .pipe(imagemin())
  .pipe(dest('dist/img'))
}

function buildcopy() {
	return src([
		'{src/js,src/css}/*.min.*',
		'src/fonts/**/*',
		'src/**/*.{html,php}',
		'src/**/.htaccess'
	], { base: 'src/' })
	.pipe(dest('dist'))
}

function cleandist() {
	return del('dist/**/*', { force: true })
}

function startwatch() {
	watch('src/sass/**/*', { usePolling: true }, styles)
	watch(['src/js/**/*.js', '!src/js/**/*.min.js'], { usePolling: true }, scripts)
	watch('src/img/**/*.{jpg,jpeg,png,webp,svg,gif}', { usePolling: true }, browserSync.reload)
	watch(`src/**/*.{${fileswatch}}`, { usePolling: true }).on('change', browserSync.reload)
}

exports.scripts = scripts
exports.styles  = styles
exports.build   = series(cleandist, scripts, styles, images, buildcopy)
exports.default = series(scripts, styles, parallel(browsersync, startwatch))
