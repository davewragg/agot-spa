import { Input, Component } from '@angular/core';
import { SetOfResults } from '../shared/models/set-of-results.model';
import { PlayerLinkComponent } from '../shared/components/player-link.component';

@Component({
  selector: 'agot-rankings',
  templateUrl: 'rankings/rankings.html',
  styleUrls: ['rankings/rankings.css'],
  directives: [PlayerLinkComponent],
})
export class RankingsComponent {
  @Input()
  name: string;
  @Input()
  rankings: SetOfResults;
}
