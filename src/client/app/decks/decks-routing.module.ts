import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DecksContainerComponent } from './decks.container';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'decks', component: DecksContainerComponent }
    ])
  ],
  exports: [RouterModule]
})
export class DecksRoutingModule {
}
