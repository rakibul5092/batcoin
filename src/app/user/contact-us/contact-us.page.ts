import { Component, OnInit } from '@angular/core';
import { Cms } from '../../modules/cms/cms.model';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {
  public cmsSettings: Cms;
  constructor(private sharedService: SharedService) {}

  ngOnInit() {
    this.cmsSettings = this.sharedService.getCmsSettings();
  }

  public constructAddress() {
    if (this.cmsSettings.contact_us.city && this.cmsSettings.contact_us.state && this.cmsSettings.contact_us.zip) {
      return this.cmsSettings.contact_us.city + ', ' + this.cmsSettings.contact_us.state + ' ' + this.cmsSettings.contact_us.zip;
    } else {
      return '';
    }
  }
}
