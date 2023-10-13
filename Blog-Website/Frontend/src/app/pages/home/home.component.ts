import { Component, OnInit } from '@angular/core';
import { CredentialResponse } from 'google-one-tap';
import { ReplaySubject } from 'rxjs';
import { AuthenticationService } from 'src/app/auth/authentication.service';
import { User } from 'src/app/shared/Interfaces/user';
import { GuestPageService } from 'src/app/shared/Services/guest-page.service';
import { UserService } from 'src/app/shared/Services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private _authService: AuthenticationService) {}

  handleCredentialResponse = (response: CredentialResponse) => {
    this._authService.signInWithGoogle(response.credential);
  };

  signInWithGoogle() {
    if (this._authService.isLoggedIn()) {
      return;
    }

    // @ts-ignore
    google.accounts.id.initialize({
      client_id:
        '316939370269-upanebcdsktfe2l8oa522a6ne17nhlpu.apps.googleusercontent.com',
      callback: (res: any) => {
        this.handleCredentialResponse(res);
      },
      cancel_on_tap_outside: false,
    });
    // @ts-ignore
    google.accounts.id.prompt();
  }

  ngOnInit(): void {
    this.signInWithGoogle();
    console.log(new Date().toISOString());
  }
}
