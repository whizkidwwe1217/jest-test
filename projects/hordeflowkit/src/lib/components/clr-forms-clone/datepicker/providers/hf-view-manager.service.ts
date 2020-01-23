/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from "@angular/core";

const enum HfDatepickerViewEnum {
  MONTHVIEW = "MONTHVIEW",
  YEARVIEW = "YEARVIEW",
  DAYVIEW = "DAYVIEW"
}

/**
 * This service manages which view is visible in the datepicker popover.
 */
@Injectable()
export class HfViewManagerService {
  private _currentView: HfDatepickerViewEnum = HfDatepickerViewEnum.DAYVIEW;

  get isDayView(): boolean {
    return this._currentView === HfDatepickerViewEnum.DAYVIEW;
  }

  get isYearView(): boolean {
    return this._currentView === HfDatepickerViewEnum.YEARVIEW;
  }

  get isMonthView(): boolean {
    return this._currentView === HfDatepickerViewEnum.MONTHVIEW;
  }

  changeToMonthView(): void {
    this._currentView = HfDatepickerViewEnum.MONTHVIEW;
  }

  changeToYearView(): void {
    this._currentView = HfDatepickerViewEnum.YEARVIEW;
  }

  changeToDayView(): void {
    this._currentView = HfDatepickerViewEnum.DAYVIEW;
  }
}
