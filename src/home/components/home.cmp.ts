import {Component} from 'angular2/core';
import {GamesCmp} from './games.cmp';
import {AllRankingsCmp} from './all-rankings.cmp';

@Component({
  selector: 'agot-home',
  moduleId: module.id,
  templateUrl: './home.cmp.html',
  styleUrls: ['./home.cmp.css'],
  directives: [GamesCmp, AllRankingsCmp]
})
export class HomeCmp {
}