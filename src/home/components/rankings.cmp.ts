import {Input, Component} from 'angular2/core';

import {SetOfResults} from '../../shared/models/set-of-results.model';

@Component({
  selector: 'agot-rankings',
  moduleId: module.id,
  //templateUrl: './rankings.cmp.html',
  //styleUrls: ['./rankings.cmp.css'],
  template: `
    <section>
      <h3>{{ name }}</h3>
      <div>Player ranking</div>
      <div>Faction ranking</div>
      <div>Agenda ranking</div>
    </section>
  `,
  pipes: []
})
export class RankingsCmp {
  @Input()
  name:string;
  @Input()
  rankings:SetOfResults;
}
