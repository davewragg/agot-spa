import {Component, ViewEncapsulation} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {HomeCmp} from '../../home/components/home';
import {AboutCmp} from '../../about/components/about';
import {NameList} from '../../shared/services/name_list';

@Component({
  selector: 'agot-app',
  viewProviders: [NameList],
  moduleId: module.id,
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  encapsulation: ViewEncapsulation.None,
  directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
  {path: '/', component: HomeCmp, name: 'Home', useAsDefault: true},
  {path: '/about', component: AboutCmp, name: 'About'},
  //{path: '/decks', component: DecksCmp, name: 'Decks'},
  //{path: '/players', component: PlayersCmp, name: 'Players'},
])
export class AppCmp {
}
