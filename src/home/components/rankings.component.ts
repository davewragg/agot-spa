import {Input, Component} from 'angular2/core';

import {SetOfResults} from '../../shared/models/set-of-results.model';

@Component({
  selector: 'agot-rankings',
  moduleId: module.id,
  templateUrl: './rankings.html',
  directives: []
})
export class RankingsComponent {
  @Input()
  name:string;
  @Input()
  rankings:SetOfResults;
  @Input()
  expanded:boolean = false;
}
