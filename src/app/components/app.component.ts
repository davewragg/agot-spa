import {Component, ViewEncapsulation} from 'angular2/core';
import {ROUTER_PROVIDERS, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';

import {DataService} from '../../shared/services/data.service';
import {ReferenceDataService} from '../../shared/services/reference-data.service';
import {NameListService} from '../../shared/services/name-list.service';

import {ToolbarComponent} from './toolbar.component';
import {NavbarComponent} from './navbar.component';

import {HomeCmp} from '../../home/components/home.cmp';
import {AboutComponent} from '../../about/components/about.component';
import {GameDetailsComponent} from '../../game/game-details.component';

@Component({
  selector: 'agot-app',
  viewProviders: [NameListService],
  providers: [ROUTER_PROVIDERS, HTTP_PROVIDERS, DataService, ReferenceDataService],
  moduleId: module.id,
  templateUrl: './app.html',
  encapsulation: ViewEncapsulation.None,
  directives: [ROUTER_DIRECTIVES, ToolbarComponent, NavbarComponent]
})
@RouteConfig([
  {path: '/', component: HomeCmp, name: 'Home', useAsDefault: true},
  {path: '/about', component: AboutComponent, name: 'About'},
  {path: '/game/:id', component: GameDetailsComponent, name: 'GameDetails'},
  //{path: '/decks', component: DecksCmp, name: 'Decks'},
  //{path: '/players', component: PlayersCmp, name: 'Players'},
])
export class AppComponent {
}