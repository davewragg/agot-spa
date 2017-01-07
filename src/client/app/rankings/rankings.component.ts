import { Input, Component, ChangeDetectionStrategy } from '@angular/core';
import { SetOfResults } from '../shared/models/set-of-results.model';

@Component({
  moduleId: module.id,
  selector: 'agot-rankings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'rankings.component.html',
  styles: [`
    .icon {
      height: 2.4em;
    }
  `],
})
export class RankingsComponent {
  @Input()
  rankings: SetOfResults;
}
