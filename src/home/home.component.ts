import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {GamesComponent} from './components/games.component';
import {AllRankingsComponent} from './components/all-rankings.component';

@Component({
  selector: 'agot-home',
  moduleId: module.id,
  templateUrl: './home.html',
  //styleUrls: ['./home.cmp.css'],
  directives: [GamesComponent, AllRankingsComponent, ROUTER_DIRECTIVES]
})
export class HomeComponent {
}
