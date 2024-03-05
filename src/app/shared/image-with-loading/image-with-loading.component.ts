import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-image-with-loading',
  templateUrl: './image-with-loading.component.html',
  styleUrls: ['./image-with-loading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageWithLoadingComponent implements OnInit {
  @Input() image: string;
  @Input() localImage: boolean = false;
  public imageUrl: string;

  constructor(private sharedService: SharedService) {}

  ngOnInit() {
    if (this.localImage || !this.image) {
      this.imageUrl = this.image;
      return;
    }
    this.imageUrl = this.imageUrl = this.image.startsWith('images') ? this.sharedService.getImageUrl(this.image) : this.sharedService.getS3ImageUrl(this.image);
  }
}
