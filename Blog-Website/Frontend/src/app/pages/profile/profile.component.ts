import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthenticationService } from 'src/app/auth/authentication.service';
import { BlogPost } from 'src/app/shared/Interfaces/blog';
import { User } from 'src/app/shared/Interfaces/user';
import { UserService } from 'src/app/shared/Services/user.service';

import { Carousel, initTE } from 'tw-elements';

import SwiperCore, {
  SwiperOptions,
  Navigation,
  Pagination,
  Scrollbar,
  Autoplay,
} from 'swiper';

SwiperCore.use([Navigation, Pagination, Autoplay]);

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, AfterViewInit {
  constructor(
    private _authService: AuthenticationService,
    private _userService: UserService,
    private _sanitizer: DomSanitizer
  ) {}

  isPasswordChangeModalOpen: boolean = false;

  openPasswordChangeModal() {
    this.isPasswordChangeModalOpen = true;
    document.querySelector('body')?.classList.add('modal-open');
  }

  closePasswordChangeModal(event: boolean) {
    this.isPasswordChangeModalOpen = event;
    document.querySelector('body')?.classList.remove('modal-open');
  }

  @ViewChild('userBioData') userBioData!: HTMLElement;

  bioFormControl = new FormControl('', {
    validators: [Validators.required, Validators.maxLength(250)],
  });

  openBioEditor() {
    this.allowEditBio = true;
    this.bioFormControl.setValue(this.user.bio);
  }

  textEditorModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['blockquote', 'code-block'],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      ['clean'], //remove formatting
    ],
  };

  user!: User;
  blogPosts: BlogPost[] = [];
  allowNameChange: boolean = false;
  blankNameError: boolean = false;
  isNameUpdated: boolean = false;
  isBioUpdated: boolean = false;
  blankBioError: boolean = false;
  isModalClosed: boolean = true;
  allowEditBio: boolean = false;
  @ViewChild('nameInput') nameInput!: ElementRef;

  updateBio() {
    // console.log(newBio);

    const newBio = this.bioFormControl.value;

    console.log(newBio);
    // return;

    this.allowEditBio = false;
    if (newBio === this.user.bio) {
      return;
    }
    if (newBio === '') {
      this.blankBioError = true;
      setTimeout(() => {
        this.blankBioError = false;
      }, 3000);
      return;
    }
    this.user.bio = newBio!;

    this._userService.updateUser(this.user).subscribe({
      next: (res: User) => {
        // console.log(res);

        this.isBioUpdated = true;
        this.user = res;
        this._userService.setUser(res);
        setTimeout(() => {
          this.isBioUpdated = false;
        }, 3000);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  sanitizeUrls(url: string) {
    return this._sanitizer.bypassSecurityTrustUrl(url);
  }

  closeModal(event: boolean) {
    if (event) {
      this.isModalClosed = true;
    } else {
      this.isModalClosed = false;
    }
  }

  focusOnNameInput() {
    setTimeout(() => {
      this.nameInput.nativeElement.focus();
    }, 0);
  }

  items = [1, 2, 3, 4, 5, 6];

  swiperConfig: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 50,
    autoplay: {
      delay: 5000,
    },
    navigation: {
      enabled: true,
      // nextEl: '.swiper-button-next',
      // prevEl: '.swiper-button-prev',
    },
  };

  saveNameChange() {
    if (this.nameInput.nativeElement.value == '') {
      // console.log('err');
      this.nameInput.nativeElement.value = this.user.name;
      document.getElementById('nameInput')!.style.color = 'red';
      this.blankNameError = true;
      setTimeout(() => {
        document.getElementById('nameInput')!.style.color = 'black';
        this.blankNameError = false;
      }, 3000);
      this.allowNameChange = false;
      return;
    }
    if (this.nameInput.nativeElement.value === this.user.name) {
      this.allowNameChange = false;
      return;
    }
    this.user.name = this.nameInput.nativeElement.value;
    this.allowNameChange = false;

    this._userService.updateUser(this.user).subscribe({
      next: (res: User) => {
        this.user = res;
        this._userService.setUser(res);
        this.isNameUpdated = true;
        setTimeout(() => {
          this.isNameUpdated = false;
        }, 3000);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getUser() {
    this._userService.user$.subscribe({
      next: (user: User) => {
        this.user = user;
        // console.log(user._id);
      },
      error: (err) => {
        this._authService.logout();
      },
    });
  }

  getUserBlogPosts() {
    this._userService.getUserBlogPosts(this.user._id).subscribe({
      next: (res) => {
        // console.log(res);
        this.blogPosts = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  ngOnInit(): void {
    initTE({ Carousel });
    if (this._authService.isLoggedIn()) {
      this.getUser();
      this.getUserBlogPosts();
    }
  }
  ngAfterViewInit(): void {}
}
