import { Component, Input, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { GameResult } from '../../shared/models/game-result.model';

@Component({
  moduleId: module.id,
  selector: 'agot-player-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="player__results">
        <span *ngFor="let result of results"
              class="player-result player-result--{{ result | lowercase }}" title="{{ result }}">
          {{ result }}
        </span>
    </div>
  `,
  styleUrls: ['player-results-form.component.css']
})
export class PlayerResultsFormComponent implements OnInit {
  @Input()
  results: GameResult[];

  ngOnInit(): void {
    this.results = this.results.slice().reverse();
  }
}
