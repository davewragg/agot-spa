import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToasterModule } from 'angular2-toaster';
import { ChartModule } from 'angular2-highcharts';
import { StatsTableComponent } from './stats-table/stats-table.component';
import { ColourRangeDirective } from './directives/index';
import {
  AgendaBadgeComponent,
  AgendaFilterComponent,
  CountComponent,
  DateRangeComponent,
  DeckClassBadgeComponent,
  DeckClassBlockComponent,
  DeckLinkComponent,
  FactionBadgeComponent,
  FactionFilterComponent,
  GameTimelineChartComponent,
  NgPluralizeComponent,
  PlayedStatsChartComponent,
  PlayerFilterComponent,
  PlayerLinkComponent,
  SpinnerComponent
} from './components/index';
import { DateFormatPipe, TimeAgoPipe } from './pipes/index';
import {
  CacheService,
  DataService,
  DeckService,
  GameService,
  NotificationService,
  PlayerService,
  RankingService,
  ReferenceDataService,
  SeasonService,
  StatsService,
  ThronesDbService
} from './services/index';
import { DateService } from './services/date.service';
import { PlayerGroupService } from './services/player-group.service';
import { PlayerGroupSelectorComponent } from './components/player-group-selector.component';
import { ThronesDbLinkComponent } from './components/thrones-db-link.component';
import { CurrentPlayerComponent } from './directives/current-player.directive';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, ToasterModule, ChartModule],
  declarations: [
    StatsTableComponent,
    DateFormatPipe,
    TimeAgoPipe,
    ColourRangeDirective,
    AgendaBadgeComponent,
    AgendaFilterComponent,
    CountComponent,
    DateRangeComponent,
    DeckClassBadgeComponent,
    DeckClassBlockComponent,
    DeckLinkComponent,
    FactionBadgeComponent,
    FactionFilterComponent,
    GameTimelineChartComponent,
    NgPluralizeComponent,
    PlayedStatsChartComponent,
    PlayerFilterComponent,
    PlayerGroupSelectorComponent,
    PlayerLinkComponent,
    ThronesDbLinkComponent,
    SpinnerComponent,
    CurrentPlayerComponent,
  ],
  exports: [
    StatsTableComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ToasterModule,
    DateFormatPipe,
    TimeAgoPipe,
    ColourRangeDirective,
    AgendaBadgeComponent,
    AgendaFilterComponent,
    CountComponent,
    DateRangeComponent,
    DeckClassBadgeComponent,
    DeckClassBlockComponent,
    DeckLinkComponent,
    FactionBadgeComponent,
    FactionFilterComponent,
    GameTimelineChartComponent,
    NgPluralizeComponent,
    PlayedStatsChartComponent,
    PlayerFilterComponent,
    PlayerGroupSelectorComponent,
    PlayerLinkComponent,
    ThronesDbLinkComponent,
    SpinnerComponent,
    CurrentPlayerComponent,
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        CacheService,
        DataService,
        DateService,
        DeckService,
        GameService,
        NotificationService,
        PlayerService,
        PlayerGroupService,
        RankingService,
        ReferenceDataService,
        SeasonService,
        StatsService,
        ThronesDbService
      ]
    };
  }
}
