import { Component } from '@angular/core';
import { Config } from './shared/index';
import './operators';
import * as _ from 'lodash';

/**
 * This class represents the main application component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-app',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  constructor() {
    console.log('Environment config', Config, _.merge);
  }
}
