import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// import { DBModule } from '@ngrx/db';
import { RouterStoreModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { HomeModule } from './home/home.module';
import { GamesModule } from './games/games.module';
import { GameModule } from './game/game.module';
import { RankingsModule } from './rankings/rankings.module';
import { DecksModule } from './decks/decks.module';
import { DeckModule } from './deck/deck.module';
import { PlayersModule } from './players/players.module';
import { PlayerModule } from './player/player.module';
import { GameEffects } from './state-management/effects/game';
import { RankingsEffects } from './state-management/effects/rankings';
import { PlayerEffects } from './state-management/effects/player';
import { DeckEffects } from './state-management/effects/deck';
import { RefDataEffects } from './state-management/effects/ref-data';
import { CurrentPlayerEffects } from './state-management/effects/current-player';
import { reducer } from './state-management/reducers/root';
// import { schema } from './db';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    SharedModule.forRoot(),

    /**
     * StoreModule.provideStore is imported once in the root module, accepting a reducer
     * function or object map of reducer functions. If passed an object of
     * reducers, combineReducers will be run creating your application
     * meta-reducer. This returns all providers for an @ngrx/store
     * based application.
     */
    StoreModule.provideStore(reducer),

    /**
     * @ngrx/router-store keeps router state up-to-date in the store and uses
     * the store as the single source of truth for the router's state.
     */
    RouterStoreModule.connectRouter(),

    /**
     * Store devtools instrument the store retaining past versions of state
     * and recalculating new states. This enables powerful time-travel
     * debugging.
     *
     * To use the debugger, install the Redux Devtools extension for either
     * Chrome or Firefox
     *
     * See: https://github.com/zalmoxisus/redux-devtools-extension
     */
    StoreDevtoolsModule.instrumentOnlyWithExtension(),

    /**
     * EffectsModule.run() sets up the effects class to be initialized
     * immediately when the application starts.
     *
     * See: https://github.com/ngrx/effects/blob/master/docs/api.md#run
     */
    EffectsModule.run(CurrentPlayerEffects),
    EffectsModule.run(GameEffects),
    EffectsModule.run(RankingsEffects),
    EffectsModule.run(DeckEffects),
    EffectsModule.run(PlayerEffects),
    EffectsModule.run(RefDataEffects),

    /**
     * `provideDB` sets up @ngrx/db with the provided schema and makes the Database
     * service available.
     */
    // DBModule.provideDB(schema),

    HomeModule,
    GamesModule,
    GameModule,
    RankingsModule,
    DecksModule,
    DeckModule,
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
