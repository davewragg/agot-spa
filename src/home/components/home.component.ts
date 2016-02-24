import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {GamesComponent} from './games.component';
import {AllRankingsCmp} from './all-rankings.cmp';

@Component({
  selector: 'agot-home',
  moduleId: module.id,
  templateUrl: './home.html',
  //styleUrls: ['./home.cmp.css'],
  directives: [GamesComponent, AllRankingsCmp, ROUTER_DIRECTIVES]
})
export class HomeComponent {
}
