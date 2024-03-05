import { Component, Input } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-related-item',
  templateUrl: './related-item.component.html',
  styleUrls: ['./related-item.component.scss'],
})
export class RelatedItemComponent {
  @Input() item;

  constructor(private router: Router) {}

  public openProduct() {
    this.router.navigate(['/product', this.item.slug]);
  }
}
