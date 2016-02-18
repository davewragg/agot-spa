import {Component, ViewEncapsulation} from 'angular2/core';
import {ROUTER_PROVIDERS, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';

import {HomeCmp} from '../../home/components/home.cmp';
import {AboutCmp} from '../../about/components/about';
import {NameListService} from '../../shared/services/name-list.service';

@Component({
  selector: 'agot-app',
  viewProviders: [NameListService],
  providers: [ROUTER_PROVIDERS, HTTP_PROVIDERS],
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
