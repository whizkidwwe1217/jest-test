import {
  ElementRef,
  Directive,
  Input,
  TemplateRef,
  EventEmitter,
  Renderer2,
  Injector,
  ComponentFactoryResolver,
  ViewContainerRef,
  NgZone,
  OnInit,
  OnDestroy,
  Inject,
  ApplicationRef,
  ChangeDetectorRef
} from "@angular/core";

import { DOCUMENT } from "@angular/common";
import { NgbPopover } from "./popover";
import { NgbPopoverConfig } from "./popover-config";

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: "[stickyPopover]",
  exportAs: "stickyPopover"
})
export class StickyPopoverDirective extends NgbPopover implements OnInit, OnDestroy {
  @Input() stickyPopover: TemplateRef<any>;

  popoverTitle: string;

  // tslint:disable-next-line:max-line-length
  placement:
    | "auto"
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "left-top"
    | "left-bottom"
    | "right-top"
    | "right-bottom"
    | (
        | "auto"
        | "top"
        | "bottom"
        | "left"
        | "right"
        | "top-left"
        | "top-right"
        | "bottom-left"
        | "bottom-right"
        | "left-top"
        | "left-bottom"
        | "right-top"
        | "right-bottom"
      )[];

  triggers: string;

  container: string;

  ngpPopover: TemplateRef<any>;

  canClosePopover: boolean;
  toggle(): void {
    super.toggle();
  }

  isOpen(): boolean {
    return super.isOpen();
  }

  constructor(
    private _elRef: ElementRef,
    private _render: Renderer2,
    injector: Injector,
    componentFactoryResolver: ComponentFactoryResolver,
    viewContainerRef: ViewContainerRef,
    config: NgbPopoverConfig,
    ngZone: NgZone,
    @Inject(DOCUMENT) _document: any,
    _changeDetector: ChangeDetectorRef,
    applicationRef: ApplicationRef
  ) {
    super(
      _elRef,
      _render,
      injector,
      componentFactoryResolver,
      viewContainerRef,
      config,
      ngZone,
      _document,
      _changeDetector,
      applicationRef
    );
    this.triggers = "manual";
    this.popoverTitle = "Permissions";
    this.container = "body";
  }
  ngOnInit(): void {
    super.ngOnInit();
    this.ngbPopover = this.stickyPopover;

    this._render.listen(this._elRef.nativeElement, "mouseenter", () => {
      this.canClosePopover = true;
      this.open();
    });

    this._render.listen(this._elRef.nativeElement, "mouseleave", (event: Event) => {
      setTimeout(() => {
        if (this.canClosePopover) {
          this.close();
        }
      }, 100);
    });

    this._render.listen(this._elRef.nativeElement, "click", () => {
      this.close();
    });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  open() {
    super.open();
    const popover = window.document.querySelector(".popover");
    this._render.listen(popover, "mouseover", () => {
      this.canClosePopover = false;
    });

    this._render.listen(popover, "mouseout", () => {
      this.canClosePopover = true;
      setTimeout(() => {
        if (this.canClosePopover) {
          this.close();
        }
      }, 0);
    });
  }

  close() {
    super.close();
  }
}
