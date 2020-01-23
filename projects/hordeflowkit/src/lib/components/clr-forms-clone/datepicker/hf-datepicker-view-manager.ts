/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef, Injector, SkipSelf, Input, HostBinding } from "@angular/core";
import { HfViewManagerService } from "./providers/hf-view-manager.service";
import { HfDatepickerFocusService } from "./providers/hf-datepicker-focus.service";

@Component({
  selector: "hf-datepicker-view-manager",
  templateUrl: "./hf-datepicker-view-manager.html",
  providers: [HfViewManagerService, HfDatepickerFocusService],
  host: {
    "[class.datepicker]": "true",
    "[attr.aria-modal]": "true"
  }
})
export class HfDatepickerViewManager {
  constructor(
    @SkipSelf() parent: ElementRef,
    _injector: Injector,
    private _viewManagerService: HfViewManagerService
  ) {}

  @HostBinding("style.border") border: string = "none";
  @HostBinding("style.box-shadow") boxshadow: string = "none";

  /**
   * Returns if the current view is the monthpicker.
   */
  get isMonthView(): boolean {
    return this._viewManagerService.isMonthView;
  }

  /**
   * Returns if the current view is the yearpicker.
   */
  get isYearView(): boolean {
    return this._viewManagerService.isYearView;
  }

  /**
   * Returns if the current view is the daypicker.
   */
  get isDayView(): boolean {
    return this._viewManagerService.isDayView;
  }
}
