import { join } from 'path';
import { SeedConfig } from './seed.config';
import { ExtendPackages } from './seed.config.interfaces';

/**
 * This class extends the basic seed configuration, allowing for project specific overrides. A few examples can be found
 * below.
 */
export class ProjectConfig extends SeedConfig {

  PROJECT_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');

  constructor() {
    super();
    this.APP_TITLE = 'AGOT Tracker';

    /* Enable typeless compiler runs (faster) between typed compiler runs. */
    // this.TYPED_COMPILE_INTERVAL = 5;

    // Add `NPM` third-party libraries to be injected/bundled.
    this.NPM_DEPENDENCIES = [
      ...this.NPM_DEPENDENCIES,
      // {src: 'jquery/dist/jquery.min.js', inject: 'libs'},
      // {src: 'lodash/lodash.min.js', inject: 'libs'},
      // {src: 'angular2-toaster/toaster.css', inject: true, vendor: true},
      { src: 'autotrack/autotrack.js', inject: 'libs' },
    ];

    // Add `local` third-party libraries to be injected/bundled.
    this.APP_ASSETS = [
      ...this.APP_ASSETS,
      // {src: `${this.APP_SRC}/your-path-to-lib/libs/jquery-ui.js`, inject: true, vendor: false}
      // {src: `${this.CSS_SRC}/path-to-lib/test-lib.css`, inject: true, vendor: false},
    ];

    let additionalPackages: ExtendPackages[] = [
      {
        name: 'angular2-toaster',
        path: 'node_modules/angular2-toaster/bundles/angular2-toaster.umd.min.js'
      },
      {
        name: 'angular2-toaster/*',
        path: 'node_modules/angular2-toaster/bundles/angular2-toaster.umd.min.js'
      },
      {
        name: 'moment',
        path: 'node_modules/moment',
        packageMeta: {
          main: 'moment.js',
          defaultExtension: 'js'
        }
      },
      {
        name: 'angular2-highcharts',
        path: 'node_modules/angular2-highcharts',
        packageMeta: {
          main: 'index.js',
          defaultExtension: 'js'
        }
      },
      {
        name: 'highcharts',
        path: 'node_modules/highcharts',
        packageMeta: {
          main: 'highcharts.js',
          defaultExtension: 'js'
        }
      },
      {
        name: '@ngrx/core',
        path: 'node_modules/@ngrx/core/bundles/core.min.umd.js'
      },
      {
        name: '@ngrx/db',
        path: 'node_modules/@ngrx/db/bundles/db.min.umd.js'
      },
      {
        name: '@ngrx/effects',
        path: 'node_modules/@ngrx/effects/bundles/effects.min.umd.js'
      },
      {
        name: '@ngrx/router-store',
        path: 'node_modules/@ngrx/router-store/bundles/router-store.min.umd.js'
      },
      {
        name: '@ngrx/store',
        path: 'node_modules/@ngrx/store/bundles/store.min.umd.js'
      },
      {
        name: '@ngrx/store-devtools',
        path: 'node_modules/@ngrx/store-devtools/bundles/store-devtools.min.umd.js'
      },
      {
        name: 'ngrx-store-freeze',
        path: 'node_modules/ngrx-store-freeze',
        packageMeta: {
          main: 'dist/index.js',
          defaultExtension: 'js'
        }
      },
      {
        name: 'reselect',
        path: 'node_modules/reselect',
        packageMeta: {
          main: 'dist/reselect.js',
          defaultExtension: 'js'
        }
      },
      {
        name: 'deep-freeze-strict',
        path: 'node_modules/deep-freeze-strict',
        packageMeta: {
          main: 'index.js',
          defaultExtension: 'js'
        }
      }
    ];
    this.addPackagesBundles(additionalPackages);

    this.SYSTEM_CONFIG.paths['lodash'] = `${this.APP_BASE}node_modules/lodash/index`;
    this.SYSTEM_BUILDER_CONFIG.paths['lodash'] = `node_modules/lodash/index.js`;

    this.ENABLE_SCSS = true;

    /* Add to or override NPM module configurations: */
    this.mergeObject(this.PLUGIN_CONFIGS['browser-sync'], { ghostMode: false });
  }

  // getProxyMiddleware(): Array<any> {
  //   const proxyMiddleware = require('http-proxy-middleware');
  //   const apiContext = `${this.APP_BASE}api`;
  //   const userContext = `${this.APP_BASE}User`;
  //   const middleware = proxyMiddleware([apiContext, userContext], {
  //     // target: 'http://paulhoughton.org',
  //     target: 'http://agottracker-dev.eu-west-2.elasticbeanstalk.com',
  //     // target: 'https://agot.local.com:443',
  //     // protocolRewrite: true,
  //     // secure: true,
  //     changeOrigin: true,
  //     logLevel: 'debug'
  //   });
  //
  //   return [
  //     middleware
  //   ];
  // }
}
