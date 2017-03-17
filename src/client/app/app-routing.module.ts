import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotFoundPageComponent } from './layout/not-found-page';

@NgModule({
  imports: [
    RouterModule.forRoot([
      /* define app module routes here, e.g., to lazily load a module
         (do not place feature module routes here, use an own -routing.module.ts in the feature instead)
       */
      {
        path: '404',
        component: NotFoundPageComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

