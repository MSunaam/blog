import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { LoaderService } from '../Services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements AfterViewInit {
  constructor(private _loaderSerivce: LoaderService) {}

  showLoader: boolean = false;

  ngAfterViewInit(): void {
    this._loaderSerivce.getLoader().subscribe((showLoader) => {
      this.showLoader = showLoader;
    });
  }
}
