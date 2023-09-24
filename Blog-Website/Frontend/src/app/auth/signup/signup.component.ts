import { Component, OnInit } from '@angular/core';
import { Input, initTE } from 'tw-elements';
import { AuthenticationService } from '../authentication.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs';
import { Router } from '@angular/router';
import { SignInRes } from 'src/app/shared/Interfaces/signInRes.interface';
import { CredentialResponse } from 'google-one-tap';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  constructor(
    private _authService: AuthenticationService,
    private _router: Router
  ) {}

  isSigningUp: boolean = false;

  nameErrorMessages: string = '';
  emailErrorMessages: string = '';
  passwordErrorMessages: string = '';
  authError: boolean = false;
  authErrorsMessage: string = '';

  signUpForm = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required, Validators.minLength(5)],
      updateOn: 'blur',
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      updateOn: 'blur',
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(8)],
      updateOn: 'blur',
    }),
  });

  signup() {
    if (this.signUpForm.invalid) {
      this.checkNameErrors();
      this.checkEmailErrors();
      this.checkPasswordErrors();
      return;
    }

    this.isSigningUp = true;

    const { name, email, password } = this.signUpForm.value;

    this._authService.signup(email!, password!, name!).subscribe({
      next: (res: SignInRes) => {
        this.isSigningUp = false;
        this._authService.storeUserAndToken(res);
        this._router.navigate(['/home']);
      },
      error: (error: any) => {
        this.isSigningUp = false;
        console.log(error);
        this.authErrorsMessage = error.message;
        this.authError = true;
        setTimeout(() => {
          this.authErrorsMessage = '';
          this.authError = false;
        }, 5000);
      },
    });
  }

  get emailControl() {
    return this.signUpForm.get('email');
  }

  get passwordControl() {
    return this.signUpForm.get('password');
  }

  get nameControl() {
    return this.signUpForm.get('name');
  }

  checkNameErrors() {
    if (this.nameControl?.errors) {
      document.getElementById('name')?.classList.add('invalidInput');
      document.getElementById('nameLabel')?.classList.add('invalidLabel');

      if (this.nameControl?.hasError('required')) {
        this.nameErrorMessages = 'Name is required';
      } else if (this.nameControl?.hasError('minlength')) {
        this.nameErrorMessages = 'Name must be at least 5 characters';
      }
    } else {
      document.getElementById('name')?.classList.remove('invalidInput');
      document.getElementById('nameLabel')?.classList.remove('invalidLabel');
      this.nameErrorMessages = '';
    }
  }

  checkEmailErrors() {
    if (this.emailControl?.errors) {
      document.getElementById('email')?.classList.add('invalidInput');
      document.getElementById('emailLabel')?.classList.add('invalidLabel');
      if (this.emailControl?.hasError('required')) {
        this.emailErrorMessages = 'Email is required';
      } else if (this.emailControl?.hasError('email')) {
        this.emailErrorMessages = 'Email is invalid';
      }
    } else {
      document.getElementById('email')?.classList.remove('invalidInput');
      document.getElementById('emailLabel')?.classList.remove('invalidLabel');
      this.emailErrorMessages = '';
    }
  }

  checkPasswordErrors() {
    if (this.passwordControl?.errors) {
      document.getElementById('password')?.classList.add('invalidInput');
      document.getElementById('passwordLabel')?.classList.add('invalidLabel');
      if (this.passwordControl?.hasError('required')) {
        this.passwordErrorMessages = 'Password is required';
      } else if (this.passwordControl?.hasError('minlength')) {
        this.passwordErrorMessages = 'Password must be at least 8 characters';
      }
    } else {
      document.getElementById('password')?.classList.remove('invalidInput');
      document
        .getElementById('passwordLabel')
        ?.classList.remove('invalidLabel');
      this.passwordErrorMessages = '';
    }
  }

  handleCredentialResponse = (response: CredentialResponse) => {
    this._authService.signInWithGoogle(response.credential);
  };

  googleSignIn() {
    // @ts-ignore
    google.accounts.id.initialize({
      client_id:
        '316939370269-upanebcdsktfe2l8oa522a6ne17nhlpu.apps.googleusercontent.com',
      callback: (res: any) => {
        this.handleCredentialResponse(res);
      },
    });
    // @ts-ignore
    google.accounts.id.renderButton(
      document.getElementById('buttonDiv')!,
      {
        theme: 'outline',
        size: 'large',
        shape: 'pill',
      } // customization attributes
    );
  }

  ngOnInit(): void {
    initTE({ Input });

    this.googleSignIn();

    //@ts-ignore
    window.fbAsyncInit = function () {
      //@ts-ignore
      FB.getLoginStatus(function (response: Facebook.StatusResponse) {
        console.log(response.status);
      });
    };

    this.nameControl?.valueChanges.pipe(distinctUntilChanged()).subscribe({
      next: (value) => {
        this.checkNameErrors();
      },
    });

    this.emailControl?.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((value) => {
        this.checkEmailErrors();
      });

    this.passwordControl?.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((value) => {
        this.checkPasswordErrors();
      });
  }
}
