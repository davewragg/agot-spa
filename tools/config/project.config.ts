import {join} from 'path';
import {SeedConfig} from './seed.config';
import {InjectableDependency} from './seed.config.interfaces';

export class ProjectConfig extends SeedConfig {
  PROJECT_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');

  constructor() {
    super();
    // has to be set in seed.config.ts :(
    //this.APP_BASE = '/agot/';
    this.APP_TITLE = 'AGOT Tracker';
    let additional_deps: InjectableDependency[] = [
      {src: 'angular2-toaster/lib/toaster.css', inject: true, vendor: true},
      // {src: 'jquery/dist/jquery.min.js', inject: 'libs'},
      // {src: 'lodash/lodash.min.js', inject: 'libs'},
      {src: 'autotrack/autotrack.js', inject: 'libs'},
    ];

    const seedDependencies = this.NPM_DEPENDENCIES;

    this.NPM_DEPENDENCIES = seedDependencies.concat(additional_deps);

    this.APP_ASSETS = [
      // {src: `${this.ASSETS_SRC}/css/toastr.min.css`, inject: true},
      // {src: `${this.APP_DEST}/assets/scss/global.css`, inject: true},
      // { src: `${this.ASSETS_SRC}/main.css`, inject: true }, // the old css file
      { src: `${this.ASSETS_SRC}/main.scss`, inject: true }, // renamed SASS file
    ];
    // Dev
    this.SYSTEM_CONFIG.paths['lodash'] = `${this.APP_BASE}node_modules/lodash/index`;
    // Prod
    this.SYSTEM_BUILDER_CONFIG.paths['lodash'] = `node_modules/lodash/index.js`;

    this.CSS_PROD_BUNDLE = 'main.css';
  }
}
