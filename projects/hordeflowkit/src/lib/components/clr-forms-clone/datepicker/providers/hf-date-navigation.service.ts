/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Subject } from "rxjs";
import { HfCalendarModel } from "../model/hf-calendar.model";
import { HfDayModel } from "../model/hf-day.model";

/**
 * This service is responsible for:
 * 1. Initializing the displayed calendar.
 * 2. Moving the calendar to the next, previous or current months
 * 3. Managing the focused and selected day models.
 */
@Injectable()
export class HfDateNavigationService {
  private _displayedCalendar: HfCalendarModel;

  get displayedCalendar(): HfCalendarModel {
    return this._displayedCalendar;
  }

  // not a setter because i want this to remain private
  private setDisplayedCalendar(value: HfCalendarModel) {
    if (!this._displayedCalendar.isEqual(value)) {
      this._displayedCalendar = value;
      this._displayedCalendarChange.next();
    }
  }

  /**
   * Variable to store today's date.
   */
  private _todaysFullDate: Date = new Date();
  private _today: HfDayModel;

  private initializeTodaysDate(): void {
    this._todaysFullDate = new Date();
    this._today = new HfDayModel(
      this._todaysFullDate.getFullYear(),
      this._todaysFullDate.getMonth(),
      this._todaysFullDate.getDate()
    );
  }

  get today(): HfDayModel {
    return this._today;
  }

  public selectedDay: HfDayModel;

  private _selectedDayChange: Subject<HfDayModel> = new Subject<HfDayModel>();

  get selectedDayChange(): Observable<HfDayModel> {
    return this._selectedDayChange.asObservable();
  }

  /**
   * Notifies that the selected day has changed so that the date can be emitted to the user.
   * Note: Only to be called from day.ts
   */
  notifySelectedDayChanged(HfdayModel: HfDayModel) {
    this.selectedDay = HfdayModel;
    this._selectedDayChange.next(HfdayModel);
  }

  public focusedDay: HfDayModel;

  /**
   * Initializes the calendar based on the selected day.
   */
  initializeCalendar(): void {
    this.focusedDay = null; // Can be removed later on the store focus
    this.initializeTodaysDate();
    if (this.selectedDay) {
      this._displayedCalendar = new HfCalendarModel(this.selectedDay.year, this.selectedDay.month);
    } else {
      this._displayedCalendar = new HfCalendarModel(this.today.year, this.today.month);
    }
  }

  changeMonth(month: number): void {
    this.setDisplayedCalendar(new HfCalendarModel(this._displayedCalendar.year, month));
  }

  changeYear(year: number): void {
    this.setDisplayedCalendar(new HfCalendarModel(year, this._displayedCalendar.month));
  }

  /**
   * Moves the displayed calendar to the next month.
   */
  moveToNextMonth(): void {
    this.setDisplayedCalendar(this._displayedCalendar.nextMonth());
  }

  /**
   * Moves the displayed calendar to the previous month.
   */
  moveToPreviousMonth(): void {
    this.setDisplayedCalendar(this._displayedCalendar.previousMonth());
  }

  /**
   * Moves the displayed calendar to the current month and year.
   */
  moveToCurrentMonth(): void {
    if (!this.displayedCalendar.isDayInCalendar(this.today)) {
      this.setDisplayedCalendar(new HfCalendarModel(this.today.year, this.today.month));
    }
    this._focusOnCalendarChange.next();
  }

  incrementFocusDay(value: number): void {
    this.focusedDay = this.focusedDay.incrementBy(value);
    if (this._displayedCalendar.isDayInCalendar(this.focusedDay)) {
      this._focusedDayChange.next(this.focusedDay);
    } else {
      this.setDisplayedCalendar(new HfCalendarModel(this.focusedDay.year, this.focusedDay.month));
    }
    this._focusOnCalendarChange.next();
  }

  private _displayedCalendarChange: Subject<void> = new Subject<void>();

  /**
   * This observable lets the subscriber know that the displayed calendar has changed.
   */
  get displayedCalendarChange(): Observable<void> {
    return this._displayedCalendarChange.asObservable();
  }

  private _focusOnCalendarChange: Subject<void> = new Subject<void>();

  /**
   * This observable lets the subscriber know that the focus should be applied on the calendar.
   */
  get focusOnCalendarChange(): Observable<void> {
    return this._focusOnCalendarChange.asObservable();
  }

  private _focusedDayChange: Subject<HfDayModel> = new Subject<HfDayModel>();

  /**
   * This observable lets the subscriber know that the focused day in the displayed calendar has changed.
   */
  get focusedDayChange(): Observable<HfDayModel> {
    return this._focusedDayChange.asObservable();
  }
}
