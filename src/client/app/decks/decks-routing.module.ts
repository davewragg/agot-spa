import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DecksComponent } from './decks.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'decks', component: DecksComponent }
    ])
  ],
  exports: [RouterModule]
})
export class DecksRoutingModule {
}
