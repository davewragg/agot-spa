import {join} from 'path';
import {SeedConfig, normalizeDependencies} from './seed.config';

export class ProjectConfig extends SeedConfig {
  PROJECT_TASKS_DIR    = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');

  constructor() {
    super();
     this.APP_TITLE = 'AGOT Tracker';
    let additional_deps = [
      { src: 'bootstrap/dist/css/bootstrap.min.css', inject: true },
      { src: 'angular2-toaster/lib/toaster.css', inject: true },
      // {src: 'jquery/dist/jquery.min.js', inject: 'libs'},
      // {src: 'lodash/lodash.min.js', inject: 'libs'},
    ];

    this.DEV_NPM_DEPENDENCIES = this.DEV_DEPENDENCIES.concat(normalizeDependencies(additional_deps));
    this.PROD_NPM_DEPENDENCIES = this.PROD_NPM_DEPENDENCIES.concat(normalizeDependencies(additional_deps));

    this.APP_ASSETS = [
      // {src: `${this.ASSETS_SRC}/css/toastr.min.css`, inject: true},
      // {src: `${this.APP_DEST}/assets/scss/global.css`, inject: true},
      {src: `${this.ASSETS_SRC}/main.css`, inject: true},
    ];

    this.DEV_DEPENDENCIES = this.DEV_NPM_DEPENDENCIES.concat(this.APP_ASSETS);
    this.PROD_DEPENDENCIES = this.PROD_NPM_DEPENDENCIES.concat(this.APP_ASSETS);
  }
}
