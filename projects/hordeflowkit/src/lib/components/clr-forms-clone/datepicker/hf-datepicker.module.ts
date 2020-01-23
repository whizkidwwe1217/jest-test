/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import { HfHostWrappingModule } from "../../clr-utils/host-wrapping/hf-host-wrapping.module";
import { ClrIconModule } from "@clr/angular";
import { HfCommonFormsModule } from "../common/hf-common.module";
import { HfDateContainer } from "./hf-date-container";
import { HfDateInput } from "./hf-date-input";
import { HfMonthpicker } from "./hf-monthpicker";
import { HfYearpicker } from "./hf-yearpicker";
import { HfDaypicker } from "./hf-daypicker";
import { HfCalendar } from "./hf-calendar";
import { HfDay } from "./hf-day";
import { HfFocusTrapModule } from "../../clr-utils/focus-trap/hf-focus-trap.module";
import { HfDatepickerViewManager } from "./hf-datepicker-view-manager";
import { NgbPopoverModule } from "../../popover/popover.module";

export const CLR_DATEPICKER_DIRECTIVES: Type<any>[] = [
  HfDay,
  HfDateContainer,
  HfDateInput,
  HfDatepickerViewManager,
  HfMonthpicker,
  HfYearpicker,
  HfDaypicker,
  HfCalendar
];

@NgModule({
  imports: [
    CommonModule,
    HfHostWrappingModule,
    ClrIconModule,
    HfFocusTrapModule,
    HfCommonFormsModule,
    NgbPopoverModule
  ],
  declarations: [CLR_DATEPICKER_DIRECTIVES],
  exports: [CLR_DATEPICKER_DIRECTIVES],
  entryComponents: [HfDateContainer]
})
export class HfDatepickerModule {}
