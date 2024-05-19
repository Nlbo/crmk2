import {DragDropModule} from '@angular/cdk/drag-drop';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ImgCropperComponent} from '@components/image-cropper/img-cropper.component';
import {DirectivesModule} from '@directives/directives.module';
import {NavigateBackDirective} from '@directives/navigate-back';
import {TranslateModule} from '@ngx-translate/core';
import {FindElementByAttributeValueInArrOfObjectsPipe} from '@pipes/find-element-by-attribute-value-in-arr-of-objects.pipe';
import {GetArrByObjKeyPipe} from '@pipes/get-arr-by-obj-key.pipe';
import {JoinByObjectKeyInArr} from '@pipes/join-by-key-in-arr.pipe';
import {JoinByObjectKeyPipe} from '@pipes/join-by-key.pipe';
import {ReturnArrFieldsPipe} from '@pipes/return-arr-fields.pipe';
import {PaginationService} from '@services/pagination.service';
import {NzAutocompleteModule} from 'ng-zorro-antd/auto-complete';
import {NzAvatarModule} from 'ng-zorro-antd/avatar';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {NzResultModule} from 'ng-zorro-antd/result';
import {ImageCropperModule} from 'ngx-image-cropper';
import {IconsProviderModule} from '../icons-provider.module';
import {ReturnArrayFromNumberPipe} from '@pipes/return=array-from-number.pipe';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {NzPageHeaderModule} from 'ng-zorro-antd/page-header';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';
import {NzMessageModule} from 'ng-zorro-antd/message';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzPopconfirmModule} from 'ng-zorro-antd/popconfirm';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import {NzRateModule} from 'ng-zorro-antd/rate';
import {NzTagModule} from 'ng-zorro-antd/tag';
import {NzPopoverModule} from 'ng-zorro-antd/popover';
import {NzDescriptionsModule} from 'ng-zorro-antd/descriptions';
import {NzTabsModule} from 'ng-zorro-antd/tabs';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzTypographyModule} from 'ng-zorro-antd/typography';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzBreadCrumbModule} from 'ng-zorro-antd/breadcrumb';
import {NzUploadModule} from 'ng-zorro-antd/upload';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzSliderModule} from 'ng-zorro-antd/slider';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzRadioModule} from 'ng-zorro-antd/radio';
import {NzSwitchModule} from 'ng-zorro-antd/switch';
import {NzCalendarModule} from 'ng-zorro-antd/calendar';
import {NzBadgeModule} from 'ng-zorro-antd/badge';
import {NzDrawerModule} from 'ng-zorro-antd/drawer';
import {NzTimePickerModule} from 'ng-zorro-antd/time-picker';
import {NzListModule} from 'ng-zorro-antd/list';
import {UcWidgetModule} from 'ngx-uploadcare-widget';
import {NgAudioRecorderModule} from 'ng-audio-recorder';
import {TextEditorComponent} from '@components/text-editor/text-editor.component';
import {ObjectUrlPipe} from '@pipes/object-url.pipe';
import {FindObjInArrayByKeyValuePipe} from '@pipes/find-obj-in-array-by-key-value.pipe';
import {LinkTypesComponent} from '@components/link-types/link-types.component';
import {AvatarGeneratorComponent} from '@components/avatar-generator/avatar-generator.component';
import {HtmlTextLengthPipe} from '@pipes/html-text-length.pipe';
import {ReturnValueFromLocalstoragePipe} from '@pipes/return-value-from-localstorage.pipe';

@NgModule({
  declarations: [
    JoinByObjectKeyPipe,
    ReturnArrFieldsPipe,
    ImgCropperComponent,
    NavigateBackDirective,
    JoinByObjectKeyInArr,
    GetArrByObjKeyPipe,
    FindElementByAttributeValueInArrOfObjectsPipe,
    ReturnArrayFromNumberPipe,
    TextEditorComponent,
    ObjectUrlPipe,
    FindObjInArrayByKeyValuePipe,
    LinkTypesComponent,
    AvatarGeneratorComponent,
    HtmlTextLengthPipe,
    ReturnValueFromLocalstoragePipe,
  ],
  imports: [
    FormsModule,
    CommonModule,
    DirectivesModule,
    NzGridModule,
    NzInputModule,
    NzIconModule,
    ReactiveFormsModule,
    NzFormModule,
    NzButtonModule,
    NzCheckboxModule,
    NzLayoutModule,
    NzMenuModule,
    NzBreadCrumbModule,
    NzTableModule,
    NzTagModule,
    NzDropDownModule,
    NzPageHeaderModule,
    NzMessageModule,
    NzUploadModule,
    IconsProviderModule,
    NzUploadModule,
    NzModalModule,
    NzIconModule,
    NzGridModule,
    NzRadioModule,
    NzDatePickerModule,
    NzSelectModule,
    NzAutocompleteModule,
    NzToolTipModule,
    NzPopoverModule,
    NzAvatarModule,
    NzTypographyModule,
    NzPopconfirmModule,
    NzDescriptionsModule,
    NzResultModule,
    NzRateModule,
    NzSliderModule,
    ImageCropperModule,
    TranslateModule,
    NzSpinModule,
    DragDropModule,
    NzTabsModule,
    NzSwitchModule,
    NzCalendarModule,
    NzBadgeModule,
    NzDrawerModule,
    NzTimePickerModule,
    NzListModule,
    UcWidgetModule,
    NgAudioRecorderModule
  ],
  exports: [
    FormsModule,
    DirectivesModule,
    NzGridModule,
    NzInputModule,
    NzIconModule,
    ReactiveFormsModule,
    NzFormModule,
    NzButtonModule,
    NzCheckboxModule,
    NzLayoutModule,
    NzMenuModule,
    NzBreadCrumbModule,
    NzTableModule,
    NzTagModule,
    NzDropDownModule,
    NzPageHeaderModule,
    NzMessageModule,
    NzUploadModule,
    IconsProviderModule,
    NzUploadModule,
    NzModalModule,
    NzIconModule,
    NzGridModule,
    NzRadioModule,
    NzDatePickerModule,
    NzSelectModule,
    NzAutocompleteModule,
    NzToolTipModule,
    NzPopoverModule,
    NzAvatarModule,
    NzTypographyModule,
    NzPopconfirmModule,
    NzDescriptionsModule,
    NzResultModule,
    NzRateModule,
    NzSliderModule,
    JoinByObjectKeyPipe,
    ReturnArrFieldsPipe,
    TranslateModule,
    ImageCropperModule,
    ImgCropperComponent,
    NavigateBackDirective,
    JoinByObjectKeyInArr,
    GetArrByObjKeyPipe,
    NzSpinModule,
    DragDropModule,
    NzTabsModule,
    FindElementByAttributeValueInArrOfObjectsPipe,
    ReturnArrayFromNumberPipe,
    NzSwitchModule,
    NzCalendarModule,
    NzBadgeModule,
    NzDrawerModule,
    NzTimePickerModule,
    TextEditorComponent,
    NzListModule,
    NgAudioRecorderModule,
    ObjectUrlPipe,
    FindObjInArrayByKeyValuePipe,
    LinkTypesComponent,
    AvatarGeneratorComponent,
  ]
})
export class SharedModule {
  constructor(private paginationService: PaginationService) {
    PaginationService.paginationInfo = paginationService;
  }
}
