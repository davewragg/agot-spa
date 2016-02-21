import {Input, Component} from 'angular2/core';

import {SetOfResults} from '../../shared/models/set-of-results.model';

@Component({
  selector: 'agot-rankings',
  moduleId: module.id,
  //templateUrl: './rankings.cmp.html',
  styleUrls: ['./rankings.cmp.css'],
  template: `
    <section *ngIf="rankings">
      <h3>{{ name }} Rankings</h3>
      <div class="ranking-category">
        <h4>Player ranking</h4>
        <ol>
          <li *ngFor="#ranking of rankings.rankedPlayers">{{ ranking.playerName }}</li>
        </ol>
      </div>
      <div class="ranking-category">
        <h4>Faction ranking</h4>
        <ol>
          <li *ngFor="#ranking of rankings.rankedFactions">{{ ranking.playerName }}</li>
        </ol>
      </div>
      <div class="ranking-category">
        <h4>Agenda ranking</h4>
        <ol>
          <li *ngFor="#ranking of rankings.rankedAgendas">{{ ranking.playerName }}</li>
        </ol>
      </div>
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
