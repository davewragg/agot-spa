import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToasterModule } from 'angular2-toaster/angular2-toaster';
import { ToolbarComponent } from './toolbar/index';
import { NavbarComponent } from './navbar/index';
import { NameListService } from './name-list/index';
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
  imports: [CommonModule, RouterModule, ToasterModule],
  declarations: [
    ToolbarComponent,
    NavbarComponent,
    CalendarPipe,
    DateFormatPipe,
    TimeAgoPipe,
  ],
  exports: [
    ToolbarComponent,
    NavbarComponent,
    CommonModule,
    FormsModule,
    RouterModule,
    CalendarPipe,
    DateFormatPipe,
    TimeAgoPipe,
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        NameListService,
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
