import { Input, Component } from '@angular/core';
import { SetOfResults } from '../shared/models/set-of-results.model';
// import { PlayerLinkComponent } from '../shared/components/player-link.component';

@Component({
  moduleId: module.id,
  selector: 'agot-rankings',
  templateUrl: 'rankings.component.html',
  styleUrls: ['rankings.component.css'],
  // directives: [PlayerLinkComponent],
})
export class RankingsComponent {
  @Input()
  name: string;
  @Input()
  rankings: SetOfResults;
}
