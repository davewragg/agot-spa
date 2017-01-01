import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { HomeModule } from './home/home.module';
import { GamesModule } from './games/games.module';
import { RankingsModule } from './rankings/rankings.module';
import { DecksModule } from './decks/decks.module';
// import { DeckModule } from './deck/deck.module';
import { PlayersModule } from './players/players.module';
import { PlayerModule } from './player/player.module';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    SharedModule.forRoot(),
    HomeModule,
    GamesModule,
    RankingsModule,
    DecksModule,
    // DeckModule,
    PlayersModule,
    PlayerModule
  ],
  declarations: [AppComponent],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '<%= APP_BASE %>'
    },
  ],
  bootstrap: [AppComponent]

})
export class AppModule {
}
