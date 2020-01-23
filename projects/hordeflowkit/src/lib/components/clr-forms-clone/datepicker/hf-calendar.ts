/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, ElementRef, HostListener, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

import { HfLocaleHelperService } from "./providers/hf-locale-helper.service";
import { HfDateNavigationService } from "./providers/hf-date-navigation.service";
import { HfDatepickerFocusService } from "./providers/hf-datepicker-focus.service";
import { HfDateIOService } from "./providers/hf-date-io.service";
import { HfCalendarViewModel } from "./model/hf-calendar-view.model";
import { HfDayOfWeek } from "./interfaces/hf-day-of-week.interface";
import { HfCalendarModel } from "./model/hf-calendar.model";
import { HfDayModel } from "./model/hf-day.model";
import { NO_OF_DAYS_IN_A_WEEK } from "./utils/constants";
import { UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW } from "../../clr-utils/key-codes";

@Component({ selector: "hf-calendar", templateUrl: "./hf-calendar.html" })
export class HfCalendar implements OnDestroy {
  private _subs: Subscription[] = [];
  constructor(
    private _localeHelperService: HfLocaleHelperService,
    private _dateNavigationService: HfDateNavigationService,
    private _datepickerFocusService: HfDatepickerFocusService,
    private _dateIOService: HfDateIOService,
    private _elRef: ElementRef
  ) {
    this.generateCalendarView();
    this.initializeSubscriptions();
  }

  /**
   * Calendar View Model to generate the Calendar.
   */
  calendarViewModel: HfCalendarViewModel;

  /**
   * Gets the locale days according to the TranslationWidth.Narrow format.
   */
  get localeDays(): ReadonlyArray<HfDayOfWeek> {
    return this._localeHelperService.localeDays;
  }

  get calendar(): HfCalendarModel {
    return this._dateNavigationService.displayedCalendar;
  }

  get selectedDay(): HfDayModel {
    return this._dateNavigationService.selectedDay;
  }

  get focusedDay(): HfDayModel {
    return this._dateNavigationService.focusedDay;
  }

  get today(): HfDayModel {
    return this._dateNavigationService.today;
  }

  /**
   * Initialize subscriptions to:
   * 1. update the calendar view model.
   * 2. update the focusable day in the calendar view model.
   * 3. focus on the focusable day in the calendar.
   */
  private initializeSubscriptions(): void {
    this._subs.push(
      this._dateNavigationService.displayedCalendarChange.subscribe(() => {
        this.generateCalendarView();
      })
    );

    this._subs.push(
      this._dateNavigationService.focusedDayChange.subscribe((focusedDay: HfDayModel) => {
        this.calendarViewModel.updateFocusableDay(focusedDay);
      })
    );

    this._subs.push(
      this._dateNavigationService.focusOnCalendarChange.subscribe(() => {
        this._datepickerFocusService.focusCell(this._elRef);
      })
    );
  }

  /**
   * Generates the Calendar View based on the calendar retrieved from the DateNavigationService.
   */
  private generateCalendarView(): void {
    this.calendarViewModel = new HfCalendarViewModel(
      this.calendar,
      this.selectedDay,
      this.focusedDay,
      this.today,
      this._localeHelperService.firstDayOfWeek,
      this._dateIOService.disabledDates
    );
  }

  /**
   * Delegates Keyboard arrow navigation to the DateNavigationService.
   */
  @HostListener("keydown", ["$event"])
  onKeyDown(event: KeyboardEvent) {
    if (event && this.focusedDay) {
      switch (event.keyCode) {
        case UP_ARROW:
          event.preventDefault();
          this._dateNavigationService.incrementFocusDay(-1 * NO_OF_DAYS_IN_A_WEEK);
          break;
        case DOWN_ARROW:
          event.preventDefault();
          this._dateNavigationService.incrementFocusDay(NO_OF_DAYS_IN_A_WEEK);
          break;
        case LEFT_ARROW:
          event.preventDefault();
          this._dateNavigationService.incrementFocusDay(-1);
          break;
        case RIGHT_ARROW:
          event.preventDefault();
          this._dateNavigationService.incrementFocusDay(1);
          break;
        default:
          break; // No default case. TSLint x-(
      }
    }
  }

  /**
   * Focuses on the focusable day when the Calendar View is initialized.
   */
  ngAfterViewInit() {
    this._datepickerFocusService.focusCell(this._elRef);
  }

  /**
   * Unsubscribe from subscriptions.
   */
  ngOnDestroy(): void {
    this._subs.forEach((sub: Subscription) => sub.unsubscribe());
  }
}
