import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {PermissionCheckerDirective} from './permission-checker.directive';
import {CursorPointerDirective} from './cursor-pointer.directive';


@NgModule({
  declarations: [
    PermissionCheckerDirective,
    CursorPointerDirective
  ],
  exports: [
    PermissionCheckerDirective,
    CursorPointerDirective
  ],
  imports: [
    CommonModule,
  ]
})
export class DirectivesModule {
}
