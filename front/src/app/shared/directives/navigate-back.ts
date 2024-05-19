import {Directive, ElementRef, HostListener, Input, OnInit, Renderer2} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';

@Directive({
  selector: '[appNavigateBack]',
})

export class NavigateBackDirective implements OnInit {
  @Input('appNavigateBack') url: string | string[] = '';

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.renderer.setAttribute(this.elementRef.nativeElement, 'type', 'button');
  }

  @HostListener('click', ['$event'])
  public onClick(event: Event) {
    if (window.history.length > 2) {
      this.location.back();
    } else if (this.url) {
      if (Array.isArray(this.url)) {
        this.url = this.url.join('/');
      }
      this.router.navigate([this.url]);
    } else {
      this.router.navigate(['../'], {relativeTo: this.activatedRoute});
    }
  }
}
