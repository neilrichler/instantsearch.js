/* eslint-disable no-console */

import webpack from 'webpack';
import watch from 'watch';
import {join} from 'path';
import config from './webpack.config.jsdelivr.babel.js';
const compiler = webpack(config);

export default cb => {
  // watch webpack
  compiler.watch({
    aggregateTimeout: 300,
    usePolling: true,
  }, compilationDone);

  // watch test files
  // first call triggers a watch, but we already have webpack watch triggering
  // so we ignore first call
  watch.watchTree(join(__dirname, '..', 'functional-tests'), (f, curr, prev) => {
    if (typeof f === 'object' && prev === null && curr === null) {
      return;
    }

    console.log('Got test file change');
    cb();
  });

  function compilationDone(err) {
    if (err) {
      throw err;
    }

    console.log('Got webpack compilation event');
    cb();
  }
};
