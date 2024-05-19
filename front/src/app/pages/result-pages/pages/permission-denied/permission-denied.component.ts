import {Component, OnInit} from '@angular/core';
import {AppHelper} from '@services/app-helper.service';

@Component({
  selector: 'app-permission-denied',
  templateUrl: './permission-denied.component.html',
  styleUrls: ['./permission-denied.component.scss']
})
export class PermissionDeniedComponent implements OnInit {
  route: string;

  constructor(private appHelper: AppHelper) {
  }

  ngOnInit(): void {
    this.route = this.appHelper.getFirstAvailablePageRoute();
  }
}
