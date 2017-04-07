import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'agot-not-authorised-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <h2>Whoa</h2>
      <div>
        <p>You're not allowed in here.</p>
      </div>
      <div>
        <button class="btn btn-warning" (click)="getOut()">Log in</button>
      </div>
    </div>
  `,
})
export class NotAuthorisedPageComponent {
  private static LOGIN_PAGE_LOCATION = '/User/Account/Login';
  private static REDIRECT_PARAM = '?returnUrl=';

  constructor(private route: ActivatedRoute) {
  }

  getOut() {
    const redirectUrl = this.route.snapshot.params['q'];
    window.location.href = NotAuthorisedPageComponent.LOGIN_PAGE_LOCATION +
      NotAuthorisedPageComponent.REDIRECT_PARAM +
      redirectUrl;
  }
}
