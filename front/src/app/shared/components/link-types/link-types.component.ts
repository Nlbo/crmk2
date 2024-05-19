import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';

@Component({
  selector: 'app-link-types',
  templateUrl: './link-types.component.html',
  styleUrls: ['./link-types.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LinkTypesComponent),
      multi: true
    }
  ]
})
export class LinkTypesComponent implements OnInit, ControlValueAccessor {

  @Input('isDirectLink') isDirectLink = true;
  @Input('isExternalLink') isExternalLink = true;
  @Output('removeButton') removeButtonEvent: EventEmitter<any> = new EventEmitter();
  onChange: any = null;
  isEditingButton = true;
  tabIndex = 0;
  isDisabled = false;

  originalFormGroup = new FormGroup({
    text: new FormControl('', [Validators.required]),
    url: new FormControl('', [Validators.required])
  });

  formGroup = new FormGroup({
    text: new FormControl('', [Validators.required]),
    url: new FormControl('', [Validators.required])
  });

  constructor() {
  }

  ngOnInit(): void {
    this.originalFormGroup.valueChanges.subscribe((data) => {
      if (this.onChange) {
        this.onChange({
          text: this.originalFormGroup.get('text').value,
          url: this.originalFormGroup.get('url').value
        });
      }
    });
  }

  save() {
    this.originalFormGroup.patchValue(this.formGroup.getRawValue());
    this.isEditingButton = false;
  }

  registerOnChange(fn: any): void {
    if (fn) {
      this.onChange = fn;
    }
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  writeValue(obj: any): void {
    if (obj) {
      this.formGroup.patchValue(obj);
      this.originalFormGroup.patchValue(obj);
      this.isEditingButton = false;
      this.setTabByUrl(obj.url);
    }
  }

  changeTab(tab) {
    switch (tab) {
      case 0:
        this.formGroup.get('url').setValue('');
        this.formGroup.get('text').setValue(this.formGroup.get('text').value);
        this.formGroup.get('url').enable();
        break;
      case 1:
        this.formGroup.get('url').setValue('{external_link}');
        this.formGroup.get('text').setValue(this.formGroup.get('text').value);
        this.formGroup.get('url').disable();
        break;
      case 2:
        this.formGroup.get('url').setValue('{direct_link}');
        this.formGroup.get('url').disable();
    }
  }

  setTabByUrl(url) {
    if (url) {
      if (url.includes('{external_link}')) {
        if (this.isExternalLink) {
          this.tabIndex = 1;
        } else {
          this.tabIndex = 0;
        }
      }
      if (url.includes('{direct_link}')) {
        if (this.isDirectLink) {
          this.tabIndex = 2;
        } else {
          this.tabIndex = 0;
        }
      } else {
        this.tabIndex = 0;
      }
      this.changeTab(this.tabIndex);
    }
  }

}
