import {Component, ViewEncapsulation} from 'angular2/core';
import {ROUTER_PROVIDERS, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {ToasterContainerComponent, ToasterService} from 'angular2-toaster/angular2-toaster';
import {DataService} from '../shared/services/data.service';
import {ReferenceDataService} from '../shared/services/reference-data.service';
import {NotificationService} from '../shared/services/notification.service';
import {NameListService} from '../shared/services/name-list.service';
import {ToolbarComponent} from './components/toolbar.component';
import {NavbarComponent} from './components/navbar.component';
import {FooterComponent} from './components/footer.component';
import {HomeComponent} from '../home/home.component';
import {GamesComponent} from '../home/components/games.component';
import {GameDetailsComponent} from '../game/game-details.component';
import {AllRankingsComponent} from '../rankings/all-rankings.component';
import {PlayersComponent} from '../players/players.component';
import {PlayerDetailsComponent} from '../players/player-details.component';
import {DeckService} from '../shared/services/deck.service';
import {ThronesDbService} from '../shared/services/thrones-db.service';
import {PlayerService} from '../shared/services/player.service';
import {DecksComponent} from '../decks/decks.component';
import {DeckDetailsComponent} from '../decks/deck-details.component';

@Component({
  selector: 'agot-app',
  viewProviders: [NameListService],
  providers: [ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    ToasterService,
    NotificationService,
    DataService,
    ReferenceDataService,
    PlayerService,
    DeckService,
    ThronesDbService],
  moduleId: module.id,
  templateUrl: './app.html',
  encapsulation: ViewEncapsulation.None,
  directives: [ROUTER_DIRECTIVES, ToasterContainerComponent, ToolbarComponent, NavbarComponent, FooterComponent],
})
@RouteConfig([
  {path: '/', component: HomeComponent, name: 'Home', useAsDefault: true},
  {path: '/games', component: GamesComponent, name: 'Games'},
  {path: '/games/new', component: GameDetailsComponent, name: 'NewGameDetails'},
  {path: '/games/:id', component: GameDetailsComponent, name: 'GameDetails'},
  {path: '/rankings', component: AllRankingsComponent, name: 'AllRankings'},
  {path: '/decks', component: DecksComponent, name: 'Decks'},
  {path: '/decks/:id', component: DeckDetailsComponent, name: 'DeckDetails'},
  {path: '/players', component: PlayersComponent, name: 'Players'},
  {path: '/players/:id', component: PlayerDetailsComponent, name: 'PlayerDetails'},
])
export class AppComponent {
}
