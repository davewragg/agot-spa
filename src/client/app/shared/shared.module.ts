import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToasterModule } from 'angular2-toaster/angular2-toaster';
import { ChartModule } from 'angular2-highcharts';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
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
import { CalendarPipe, DateFormatPipe, TimeAgoPipe } from './pipes/index';
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

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, ToasterModule, ChartModule],
  declarations: [
    ToolbarComponent,
    NavbarComponent,
    FooterComponent,
    StatsTableComponent,
    CalendarPipe,
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
    PlayerLinkComponent,
    SpinnerComponent
  ],
  exports: [
    ToolbarComponent,
    NavbarComponent,
    FooterComponent,
    StatsTableComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ToasterModule,
    CalendarPipe,
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
    PlayerLinkComponent,
    SpinnerComponent
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        // NameListService,
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
      ]
    };
  }
}
