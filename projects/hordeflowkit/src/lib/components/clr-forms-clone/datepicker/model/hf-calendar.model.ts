/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { getNumberOfDaysInTheMonth } from "../utils/date-utils";
import { HfDayModel } from "./hf-day.model";

export class HfCalendarModel {
  constructor(public readonly year: number, public readonly month: number) {
    this.initializeDaysInCalendar();
  }

  days: HfDayModel[];

  /**
   * Populates the days array with the HfDayModels in the current Calendar.
   */
  private initializeDaysInCalendar(): void {
    const noOfDaysInCalendar: number = getNumberOfDaysInTheMonth(this.year, this.month);
    this.days = Array(noOfDaysInCalendar)
      .fill(null)
      .map((date, index) => {
        return new HfDayModel(this.year, this.month, index + 1);
      });
  }

  /**
   * Checks if the calendar passed is equal to the current calendar.
   */
  isEqual(calendar: HfCalendarModel) {
    if (calendar) {
      return this.year === calendar.year && this.month === calendar.month;
    }
    return false;
  }

  /**
   * Checks if a HfDayModel is in the Calendar
   */
  isDayInCalendar(day: HfDayModel): boolean {
    if (day) {
      return this.year === day.year && this.month === day.month;
    }
    return false;
  }

  /**
   * Returns HfCalendarModel of the previous month.
   */
  previousMonth(): HfCalendarModel {
    if (this.month === 0) {
      return new HfCalendarModel(this.year - 1, 11);
    } else {
      return new HfCalendarModel(this.year, this.month - 1);
    }
  }

  /**
   * Returns HfCalendarModel of the next month.
   */
  nextMonth(): HfCalendarModel {
    if (this.month === 11) {
      return new HfCalendarModel(this.year + 1, 0);
    } else {
      return new HfCalendarModel(this.year, this.month + 1);
    }
  }
}
