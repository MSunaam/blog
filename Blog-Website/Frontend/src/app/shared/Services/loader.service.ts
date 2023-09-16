import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  constructor() {}

  loader: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  showLoader() {
    setTimeout(() => {
      this.loader.next(true);
    });
  }

  hideLoader() {
    setTimeout(() => {
      this.loader.next(false);
    }, 500);
  }

  getLoader() {
    return this.loader.asObservable();
  }
}
