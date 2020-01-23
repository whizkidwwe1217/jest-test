/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import {
  Component,
  OnDestroy,
  Optional,
  ContentChild,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input
} from "@angular/core";
import { Subscription } from "rxjs";
import { NgControl } from "@angular/forms";
import { ClrCommonStringsService, ClrPopoverToggleService } from "@clr/angular";
import { HfDateFormControlService } from "./providers/hf-date-form-control.service";
import { HfDatepickerEnabledService } from "./providers/hf-datepicker-enabled.service";
import { HfDateNavigationService } from "./providers/hf-date-navigation.service";
import { HfDateIOService } from "./providers/hf-date-io.service";
import { HfNgControlService } from "../common/providers/hf-ng-control.service";
import { HfFocusService } from "../common/providers/hf-focus.service";
import { HfControlClassService } from "../common/providers/hf-control-class.service";
import { HfIfErrorService } from "../common/if-error/hf-if-error.service";
import { HfLocaleHelperService } from "./providers/hf-locale-helper.service";
import { HfControlIdService } from "../common/providers/hf-control-id.service";
import { HfDynamicWrapper } from "../../clr-utils/host-wrapping/hf-dynamic-wrapper";
import { HfLabel } from "../common/hf-label";
import { HfLayoutService } from "../common/providers/hf-layout.service";
import { NgbPopover } from "../../popover/popover";

@Component({
  selector: "hf-date-container",
  template: `
    <ng-content select="label"></ng-content>
    <label *ngIf="!label && addGrid()"></label>
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-input-wrapper">
        <div
          class="clr-input-group"
          [class.clr-focus]="focus"
          [ngbPopover]="popContent"
          [placement]="['bottom-right', 'auto']"
          [useGpu]="false"
          [container]="container"
          [triggers]="'manual'"
          autoClose="outside"
          #popover="ngbPopover"
        >
          <ng-content select="[hfDate]"></ng-content>
          <button
            #actionButton
            type="button"
            class="clr-input-group-icon-action"
            [attr.title]="commonStrings.keys.datepickerToggle"
            [attr.aria-label]="commonStrings.keys.datepickerToggle"
            [disabled]="isInputDateDisabled"
            (click)="toggleDatepicker($event)"
            *ngIf="isEnabled"
          >
            <clr-icon shape="calendar"></clr-icon>
          </button>
          <ng-template #popContent>
            <hf-datepicker-view-manager clrFocusTrap></hf-datepicker-view-manager>
          </ng-template>
        </div>
        <clr-icon class="clr-validate-icon" shape="exclamation-circle"></clr-icon>
      </div>
      <ng-content select="hf-control-helper" *ngIf="!invalid"></ng-content>
      <ng-content select="hf-control-error" *ngIf="invalid"></ng-content>
    </div>
  `,
  providers: [
    HfControlIdService,
    ClrPopoverToggleService,
    HfLocaleHelperService,
    HfIfErrorService,
    HfControlClassService,
    HfFocusService,
    HfNgControlService,
    HfDateIOService,
    HfDateNavigationService,
    HfDatepickerEnabledService,
    HfDateFormControlService
  ],
  host: {
    "[class.clr-form-control-disabled]": "isInputDateDisabled",
    "[class.clr-form-control]": "true",
    "[class.clr-row]": "addGrid()"
  }
})
export class HfDateContainer implements HfDynamicWrapper, OnDestroy, AfterViewInit {
  _dynamic: boolean = false;
  invalid = false;
  focus = false;
  control: NgControl;
  @ContentChild(HfLabel, { static: false })
  label: HfLabel;
  @ViewChild("popover", { static: false })
  popover: NgbPopover;

  container: string = "body";
  get appendToBody(): boolean {
    return this.container === "body";
  }

  @Input() set appendToBody(append: boolean) {
    append ? (this.container = "body") : (this.container = null);
  }

  private toggleButton: ElementRef;
  @ViewChild("actionButton", { static: false })
  set actionButton(button: ElementRef) {
    this.toggleButton = button;
  }

  private subscriptions: Subscription[] = [];

  constructor(
    private _toggleService: ClrPopoverToggleService,
    private _dateNavigationService: HfDateNavigationService,
    private _datepickerEnabledService: HfDatepickerEnabledService,
    private dateFormControlService: HfDateFormControlService,
    public commonStrings: ClrCommonStringsService,
    private ifErrorService: HfIfErrorService,
    private focusService: HfFocusService,
    private controlClassService: HfControlClassService,
    @Optional() private layoutService: HfLayoutService,
    private ngControlService: HfNgControlService
  ) {
    this.subscriptions.push(
      this.focusService.focusChange.subscribe(state => {
        this.focus = state;
      })
    );
    this.subscriptions.push(
      this.ngControlService.controlChanges.subscribe(control => {
        this.control = control;
      })
    );
  }

  ngOnInit() {
    this.initializeCalendar();
    this.subscriptions.push(
      this.ifErrorService.statusChanges.subscribe(invalid => {
        this.invalid = invalid;
      })
    );
  }

  ngAfterViewInit(): void {
    this.subscriptions.push(
      this._toggleService.openChange.subscribe(open => {
        if (open) {
          this.initializeCalendar();
          this.popover.open();
        } else {
          this.toggleButton.nativeElement.focus();
          this.popover.close();
        }
      })
    );
  }

  /**
   * Returns the classes to apply to the control
   */
  controlClass() {
    return this.controlClassService.controlClass(this.invalid, this.addGrid());
  }

  /**
   * Determines if the control needs to add grid classes
   */
  addGrid() {
    return this.layoutService && !this.layoutService.isVertical();
  }

  /**
   * Returns if the Datepicker is enabled or not. If disabled, hides the datepicker trigger.
   */
  get isEnabled(): boolean {
    return this._datepickerEnabledService.isEnabled;
  }

  /**
   * Return if Datepicker is diabled or not as Form Control
   */
  get isInputDateDisabled(): boolean {
    /* clrForm wrapper or without clrForm */
    return (
      (this.control && this.control.disabled) ||
      (this.dateFormControlService && this.dateFormControlService.disabled)
    );
  }

  /**
   * Processes the user input and Initializes the Calendar everytime the datepicker popover is open.
   */
  private initializeCalendar(): void {
    this._dateNavigationService.initializeCalendar();
  }

  /**
   * Toggles the Datepicker Popover.
   */
  toggleDatepicker(event: MouseEvent) {
    if (this.popover.isOpen()) {
      this.popover.close();
    } else {
      this.popover.open();
    }
    this._toggleService.toggleWithEvent(event);
    this.dateFormControlService.markAsTouched();
  }

  /**
   * Unsubscribe from subscriptions.
   */
  ngOnDestroy() {
    this.subscriptions.map(sub => sub.unsubscribe());
  }
}
