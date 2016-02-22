import {Input, Component} from 'angular2/core';

import {SetOfResults} from '../../shared/models/set-of-results.model';

@Component({
  selector: 'agot-rankings',
  moduleId: module.id,
  templateUrl: './rankings.cmp.html',
  styleUrls: ['./rankings.cmp.css'],
  directives: []
})
export class RankingsCmp {
  @Input()
  name:string;
  @Input()
  rankings:SetOfResults;
}
