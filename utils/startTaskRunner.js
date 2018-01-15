const gulp = require('gulp');
const chalk = require('chalk');
const prettyTime = require('pretty-hrtime');
const log = require('./log');
require('../config/gulpfile');

gulp.on('start', (event) => {
  log.gulp(`Starting ${chalk.cyan(event.name)}...`);
});

gulp.on('stop', (event) => {
  const time = prettyTime(event.duration);
  log.gulp(`Finished ${chalk.cyan(event.name)} after ${chalk.magenta(time)}`);
});

gulp.on('error', (err) => {
  console.log(err);
});

module.exports = function startTaskRunner() {
  gulp.task('default')();
};
