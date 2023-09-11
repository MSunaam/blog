import { Component, OnInit } from '@angular/core';
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
export class HomeComponent {
  constructor() {}
}
