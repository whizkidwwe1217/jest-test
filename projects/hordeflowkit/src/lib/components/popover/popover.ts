import {
  Directive,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  OnChanges,
  Inject,
  Injector,
  Renderer2,
  ComponentRef,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
  ComponentFactoryResolver,
  NgZone,
  SimpleChanges,
  ChangeDetectorRef,
  ApplicationRef,
  ContentChild
} from "@angular/core";
import { DOCUMENT } from "@angular/common";

import { listenToTriggers } from "./triggers";
import { ngbAutoClose } from "./autoclose";
import { positionElements, PlacementArray } from "./positioning";
import { PopupService } from "./popup";
import { ngbWindowResize } from "./utils/resize";
import { ngbScroll } from "./utils/scroll";
import { NgbPopoverConfig } from "./popover-config";
import { take } from "rxjs/operators";
import { NgbPopoverWindow } from "./popover-window";

let nextId = 0;
/**
 * A lightweight and extensible directive for fancy popover creation.
 */
@Directive({ selector: "[ngbPopover]", exportAs: "ngbPopover" })
export class NgbPopover implements OnInit, OnDestroy, OnChanges {
  /**
   * Indicates whether the popover should be closed on `Escape` key and inside/outside clicks:
   *
   * * `true` - closes on both outside and inside clicks as well as `Escape` presses
   * * `false` - disables the autoClose feature (NB: triggers still apply)
   * * `"inside"` - closes on inside clicks as well as Escape presses
   * * `"outside"` - closes on outside clicks (sometimes also achievable through triggers)
   * as well as `Escape` presses
   *
   * @since 3.0.0
   */
  @Input() autoClose: boolean | "inside" | "outside";

  /**
   * The string content or a `TemplateRef` for the content to be displayed in the popover.
   *
   * If the title and the content are empty, the popover won't open.
   */
  @Input() ngbPopover: string | TemplateRef<any>;

  /**
   * The title of the popover.
   *
   * If the title and the content are empty, the popover won't open.
   */
  @Input() popoverTitle: string | TemplateRef<any>;

  /**
   * The preferred placement of the popover.
   *
   * Possible values are `"top"`, `"top-left"`, `"top-right"`, `"bottom"`, `"bottom-left"`,
   * `"bottom-right"`, `"left"`, `"left-top"`, `"left-bottom"`, `"right"`, `"right-top"`,
   * `"right-bottom"`
   *
   * Accepts an array of strings or a string with space separated possible values.
   *
   * The default order of preference is `"auto"` (same as the sequence above).
   *
   * Please see the [positioning overview](#/positioning) for more details.
   */
  @Input() placement: PlacementArray;

  /**
   * Specify if the GPU must be used for the placement
   *
   * If true, translate will be used, otherwise it's top and left
   */
  @Input() useGpu = true;

  /**
   * Specifies events that should trigger the tooltip.
   *
   * Supports a space separated list of event names.
   * For more details see the [triggers demo](#/components/popover/examples#triggers).
   */
  @Input() triggers: string;

  /**
   * A selector specifying the element the popover should be appended to.
   *
   * Currently only supports `body`.
   */
  @Input() container: string;

  /**
   * If `true`, popover is disabled and won't be displayed.
   *
   * @since 1.1.0
   */
  @Input() disablePopover: boolean;

  /**
   * If `true`, popover is disabled and won't be displayed.
   *
   * @since 2.2.0
   */
  @Input() showArrowTip: boolean;

  /**
   * An optional class applied to the popover window element.
   *
   * @since 2.2.0
   */
  @Input() popoverClass: string;

  /**
   * The opening delay in ms. Works only for "non-manual" opening triggers defined by the `triggers` input.
   *
   * @since 4.1.0
   */
  @Input() openDelay: number;

  /**
   * The closing delay in ms. Works only for "non-manual" opening triggers defined by the `triggers` input.
   *
   * @since 4.1.0
   */
  @Input() closeDelay: number;

  /**
   * An event emitted when the popover is shown. Contains no payload.
   */
  @Output() shown = new EventEmitter<void>();

  /**
   * An event emitted when the popover is hidden. Contains no payload.
   */
  @Output() hidden = new EventEmitter<void>();

  private _ngbPopoverWindowId = `ngb-popover-${nextId++}`;
  private _popupService: PopupService<NgbPopoverWindow>;
  private _windowRef: ComponentRef<NgbPopoverWindow>;
  private _unregisterListenersFn;
  private _zoneSubscription: any;
  private _isDisabled(): boolean {
    if (this.disablePopover) {
      return true;
    }
    if (!this.ngbPopover && !this.popoverTitle) {
      return true;
    }
    return false;
  }

  constructor(
    private _elementRef: ElementRef<HTMLElement>,
    private _renderer: Renderer2,
    injector: Injector,
    componentFactoryResolver: ComponentFactoryResolver,
    viewContainerRef: ViewContainerRef,
    config: NgbPopoverConfig,
    private _ngZone: NgZone,
    @Inject(DOCUMENT) private _document: any,
    private _changeDetector: ChangeDetectorRef,
    applicationRef: ApplicationRef
  ) {
    this.autoClose = config.autoClose;
    this.placement = config.placement;
    this.triggers = config.triggers;
    this.container = config.container;
    this.disablePopover = config.disablePopover;
    this.popoverClass = config.popoverClass;
    this.showArrowTip = config.showArrowTip;
    this.openDelay = config.openDelay;
    this.closeDelay = config.closeDelay;
    this._popupService = new PopupService<NgbPopoverWindow>(
      NgbPopoverWindow,
      injector,
      viewContainerRef,
      _renderer,
      componentFactoryResolver,
      applicationRef
    );
    this._zoneSubscription = _ngZone.onStable.subscribe(() => {
      this.position();
    });
  }

  // Gets the id of the window
  getWindowId() {
    return this._ngbPopoverWindowId;
  }

  getWindowContentBody() {
    return this._windowRef.instance.getContentBody();
  }

  /**
   * Opens the popover.
   *
   * This is considered to be a "manual" triggering.
   * The `context` is an optional value to be injected into the popover template when it is created.
   */
  open(context?: any) {
    if (!this._windowRef && !this._isDisabled()) {
      this._windowRef = this._popupService.open(this.ngbPopover, context);
      this._windowRef.instance.title = this.popoverTitle;
      this._windowRef.instance.context = context;
      this._windowRef.instance.popoverClass = this.popoverClass;
      this._windowRef.instance.showArrowTip = this.showArrowTip;
      this._windowRef.instance.id = this._ngbPopoverWindowId;

      this._renderer.setAttribute(
        this._elementRef.nativeElement,
        "aria-describedby",
        this._ngbPopoverWindowId
      );

      if (this.container === "body") {
        this._document
          .querySelector(this.container)
          .appendChild(this._windowRef.location.nativeElement);
      }

      ngbWindowResize(this._ngZone, () => this.position(), this.hidden);
      ngbScroll(this._ngZone, this._elementRef.nativeElement, () => this.position(), this.hidden);

      // We need to detect changes, because we don't know where .open() might be called from.
      // Ex. opening popover from one of lifecycle hooks that run after the CD
      // (say from ngAfterViewInit) will result in 'ExpressionHasChanged' exception
      this._windowRef.changeDetectorRef.detectChanges();

      // We need to mark for check, because popover won't work inside the OnPush component.
      // Ex. when we use expression like `{{ popover.isOpen() : 'opened' : 'closed' }}`
      // inside the template of an OnPush component and we change the popover from
      // open -> closed, the expression in question won't be updated unless we explicitly
      // mark the parent component to be checked.
      this._windowRef.changeDetectorRef.markForCheck();

      ngbAutoClose(this._ngZone, this._document, this.autoClose, () => this.close(), this.hidden, [
        this._windowRef.location.nativeElement
      ]);
      this.shown.emit();
    }
  }

  /**
   * Closes the popover.
   *
   * This is considered to be a "manual" triggering of the popover.
   */
  close(): void {
    if (this._windowRef) {
      this._renderer.removeAttribute(this._elementRef.nativeElement, "aria-describedby");
      this._popupService.close();
      this._windowRef = null;
      this.hidden.emit();
      this._changeDetector.markForCheck();
    }
  }

  /**
   * Toggles the popover.
   *
   * This is considered to be a "manual" triggering of the popover.
   */
  toggle(): void {
    if (this._windowRef) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Returns `true`, if the popover is currently shown.
   */
  isOpen(): boolean {
    return this._windowRef != null;
  }

  ngOnInit() {
    this._unregisterListenersFn = listenToTriggers(
      this._renderer,
      this._elementRef.nativeElement,
      this.triggers,
      this.isOpen.bind(this),
      this.open.bind(this),
      this.close.bind(this),
      +this.openDelay,
      +this.closeDelay
    );
  }

  ngOnChanges({ ngbPopover, popoverTitle, disablePopover, popoverClass }: SimpleChanges) {
    if (popoverClass && this.isOpen()) {
      this._windowRef.instance.popoverClass = popoverClass.currentValue;
    }
    // close popover if title and content become empty, or disablePopover set to true
    if ((ngbPopover || popoverTitle || disablePopover) && this._isDisabled()) {
      this.close();
    }
  }

  ngOnDestroy() {
    this.close();
    // This check is needed as it might happen that ngOnDestroy is called before ngOnInit
    // under certain conditions, see: https://github.com/ng-bootstrap/ng-bootstrap/issues/2199
    if (this._unregisterListenersFn) {
      this._unregisterListenersFn();
    }
    this._zoneSubscription.unsubscribe();
  }

  /**
   * Trigger a repositioning of the popover
   */
  position() {
    if (this._windowRef) {
      positionElements(
        this._elementRef.nativeElement,
        this._windowRef.location.nativeElement,
        this.placement,
        this.container === "body",
        "bs-popover",
        this.hidden,
        this.useGpu
      );
    }
  }
}
