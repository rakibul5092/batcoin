import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-under-construction',
  templateUrl: './under-construction.component.html',
  styleUrls: ['./under-construction.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnderConstructionComponent {
  language = '';

  constructor(private translateService: TranslateService) {}

  public translateLanguageTo(lang: string) {
    this.language = lang;
    this.translateService.use(lang);
  }
}
