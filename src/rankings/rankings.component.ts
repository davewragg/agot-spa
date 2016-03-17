import {Input, Component} from 'angular2/core';

import {SetOfResults} from '../shared/models/set-of-results.model';
import {ReversePipe} from '../shared/pipes/reverse-pipe';
import {PlayerLinkComponent} from '../shared/components/player-link.component';

@Component({
  selector: 'agot-rankings',
  moduleId: module.id,
  templateUrl: './rankings.html',
  styleUrls: ['./rankings.css'],
  directives: [PlayerLinkComponent],
  pipes: [ReversePipe],
})
export class RankingsComponent {
  @Input()
  name:string;
  @Input()
  rankings:SetOfResults;
}
