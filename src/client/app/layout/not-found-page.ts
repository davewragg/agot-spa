import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'agot-not-found-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <h2>Not Found</h2>
      <div>
        <p>What you're looking for doesn't exist.</p>
      </div>
      <div>
        <button class="btn btn-secondary" routerLink="/">Run Away</button>
      </div>
    </div>
  `,
})
export class NotFoundPageComponent { }
