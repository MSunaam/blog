import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements AfterViewInit {
  @Input() color: string = 'white';

  @ViewChild('loader') loader!: ElementRef;

  ngAfterViewInit(): void {
    this.loader.nativeElement.style.setProperty('border-color', this.color);
    this.loader.nativeElement.style.setProperty(
      'border-bottom-color',
      'transparent'
    );
  }
}
