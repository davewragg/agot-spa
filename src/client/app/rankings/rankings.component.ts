import { Input, Component, ChangeDetectionStrategy } from '@angular/core';
import { SetOfResults } from '../shared/models/set-of-results.model';

@Component({
  moduleId: module.id,
  selector: 'agot-rankings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'rankings.component.html',
  styleUrls: ['rankings.component.css'],
})
export class RankingsComponent {
  @Input()
  name: string;
  @Input()
  rankings: SetOfResults;
}
