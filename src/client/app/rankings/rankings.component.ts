import { Input, Component } from '@angular/core';
import { SetOfResults } from '../shared/models/set-of-results.model';
// import { PlayerLinkComponent } from '../shared/components/player-link.component';

@Component({
  moduleId: module.id,
  selector: 'agot-rankings',
  templateUrl: 'rankings.html',
  styleUrls: ['rankings.css'],
  // directives: [PlayerLinkComponent],
})
export class RankingsComponent {
  @Input()
  name: string;
  @Input()
  rankings: SetOfResults;
}
