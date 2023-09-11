import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BlogPost } from '../../Interfaces/blog';

@Component({
  selector: 'app-new-card',
  templateUrl: './new-card.component.html',
  styleUrls: ['./new-card.component.scss'],
})
export class NewCardComponent {
  hover: boolean = false;
  @Input() blogDetails!: BlogPost;
  @Output() blogClicked = new EventEmitter<BlogPost>();
}
