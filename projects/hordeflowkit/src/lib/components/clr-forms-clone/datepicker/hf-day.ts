/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input } from "@angular/core";
import { HfDayViewModel } from "./model/hf-day-view.model";
import { HfDateNavigationService } from "./providers/hf-date-navigation.service";
import { ClrPopoverToggleService } from "@clr/angular";
import { HfDateFormControlService } from "./providers/hf-date-form-control.service";
import { HfDayModel } from "./model/hf-day.model";

@Component({
  selector: "hf-day",
  template: `
    <button
      class="day-btn"
      type="button"
      [class.is-today]="dayView.isTodaysDate"
      [class.is-excluded]="dayView.isExcluded"
      [class.is-disabled]="dayView.isDisabled"
      [class.is-selected]="dayView.isSelected"
      [attr.tabindex]="dayView.tabIndex"
      (click)="selectDay()"
      (focus)="onDayViewFocus()"
      [attr.aria-label]="dayString"
    >
      {{ dayView.dayModel.date }}
    </button>
  `,
  host: { "[class.day]": "true" }
})
export class HfDay {
  private _dayView: HfDayViewModel;
  public dayString: string;

  constructor(
    private _dateNavigationService: HfDateNavigationService,
    private _toggleService: ClrPopoverToggleService,
    private dateFormControlService: HfDateFormControlService
  ) {}

  /**
   * HfDayViewModel input which is used to build the Day View.
   */

  @Input("hfDayView")
  public set dayView(day: HfDayViewModel) {
    this._dayView = day;
    this.dayString = this._dayView.dayModel.toDateString();
  }

  public get dayView(): HfDayViewModel {
    return this._dayView;
  }

  /**
   * Updates the focusedDay in the DateNavigationService when the ClrDay is focused.
   */
  onDayViewFocus() {
    this._dateNavigationService.focusedDay = this.dayView.dayModel;
  }

  /**
   * Updates the selectedDay when the ClrDay is selected and closes the datepicker popover.
   */
  selectDay(): void {
    const day: HfDayModel = this.dayView.dayModel;
    this._dateNavigationService.notifySelectedDayChanged(day);
    this.dateFormControlService.markAsDirty();
    this._toggleService.open = false;
  }
}
