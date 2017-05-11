import { Input, Component, ChangeDetectionStrategy } from '@angular/core';
import { SetOfResults } from '../shared/models/set-of-results.model';

@Component({
  moduleId: module.id,
  selector: 'agot-rankings-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'rankings-table.component.html',
  styles: [`
    .icon {
      height: 2.4em;
    }
  `],
})
export class RankingsTableComponent {
  @Input()
  rankings: SetOfResults;
}
