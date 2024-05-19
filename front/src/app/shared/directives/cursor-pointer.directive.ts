import {Directive, ElementRef, Input} from '@angular/core';

@Directive({
  selector: '[appCursor]'
})
export class CursorPointerDirective {

  @Input('appCursor') appCursor;

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.elementRef.nativeElement.style.cursor = this.appCursor ? this.appCursor : 'pointer';
  }
}
