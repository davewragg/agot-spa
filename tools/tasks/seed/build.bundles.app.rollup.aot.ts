import Config from '../../config';
import { writeFile } from 'fs';
import { join } from 'path';

const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const includePaths = require('rollup-plugin-includepaths');
const rollup = require('rollup');

const config = {
  entry: join(Config.TMP_DIR, Config.BOOTSTRAP_FACTORY_PROD_MODULE),
  sourceMap: true,
  treeshake: true,
  moduleName: 'main',
  plugins: [
    includePaths({
      include: {},
      paths: [join(Config.TMP_DIR, 'app')],
      external: [],
      extensions: ['.js', '.json', '.html', '.ts']
    }),
    nodeResolve({
      jsnext: true, main: true, module: true
    }),
    commonjs({
      include: 'node_modules/**',
      // TODO until commonjs plugin is updated
      namedExports: {
        'node_modules/date-fns/index.js': [
          'endOfDay',
          'format',
          'startOfQuarter',
          'endOfQuarter',
          'differenceInMinutes',
          'distanceInWordsToNow',
          'subDays',
          'startOfDay',
        ],
        'node_modules/lodash/lodash.js': Object.keys(require('lodash')), // TODO get specific
        'node_modules/angular2-highcharts/index.js': Object.keys(require('angular2-highcharts'))
      }
    })
  ]
};


export = (done: any) => {
  rollup.rollup(config)
    .then((bundle: any) => {
      const result = bundle.generate({
        format: 'iife'
      });
      const path = join(Config.TMP_DIR, 'bundle.js');
      writeFile(path, result.code, (error: any) => {
        if (error) {
          console.error(error);
          process.exit(0);
        }
        done();
      });
    })
    .catch((error: any) => {
      console.error(error);
      process.exit(0);
    });
};
