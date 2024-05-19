import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import {PermissionsEnum} from '@enums/permissions.enum';
import {AuthHelperService} from '@pages/auth/services/auth-helper.service';
import {AppHelper} from '@services/app-helper.service';

@Directive({
  selector: '[appPermission]'
})
export class PermissionCheckerDirective implements OnInit {

  @Input() appPermission: PermissionsEnum[] = [];

  constructor(private elementRef: ElementRef, private authHelperService: AuthHelperService) {
  }

  ngOnInit() {
    if (!this.appPermission.includes(PermissionsEnum.AllowAnyway)) {
      if (!AppHelper.intersection(this.authHelperService.availablePermissionsList, this.appPermission).length) {
        this.elementRef.nativeElement.style.display = 'none';
      }
    }
  }
}
