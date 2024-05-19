import { Component, OnInit } from '@angular/core';
import {AppHelper} from '@services/app-helper.service';

@Component({
  selector: 'app-have-not-permissions',
  templateUrl: './have-not-permissions.component.html',
  styleUrls: ['./have-not-permissions.component.scss']
})
export class HaveNotPermissionsComponent implements OnInit {

  route: string;

  constructor(private appHelper: AppHelper) {
  }

  ngOnInit(): void {
    this.route = this.appHelper.getFirstAvailablePageRoute();
  }

  logout() {
    localStorage.clear();
    window.location.href = window.location.origin;
  }

}
