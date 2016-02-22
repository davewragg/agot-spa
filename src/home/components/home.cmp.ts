import {Component} from 'angular2/core';
import {GamesComponent} from './games.component';
import {AllRankingsCmp} from './all-rankings.cmp';

@Component({
  selector: 'agot-home',
  moduleId: module.id,
  templateUrl: './home.cmp.html',
  styleUrls: ['./home.cmp.css'],
  directives: [GamesComponent, AllRankingsCmp]
})
export class HomeCmp {
}
