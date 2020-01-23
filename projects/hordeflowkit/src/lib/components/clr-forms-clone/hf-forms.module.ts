/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { HfCommonFormsModule } from "./common/hf-common.module";
import { HfRangeModule } from "./range/hf-range.module";
import { HfTextareaModule } from "./textarea/hf-textarea.module";
import { HfSelectModule } from "./select/hf-select.module";
import { HfRadioModule } from "./radio/hf-radio.module";
import { HfPasswordModule } from "./password/hf-password.module";
import { HfInputModule } from "./input/hf-input.module";
import { HfCheckboxModule } from "./checkbox/hf-checkbox.module";
import { HfDatepickerModule } from "./datepicker/hf-datepicker.module";
import { HfSearchModule } from "./search/hf-search.module";

@NgModule({
  imports: [CommonModule],
  exports: [
    HfCommonFormsModule,
    HfCheckboxModule,
    HfDatepickerModule,
    HfInputModule,
    HfPasswordModule,
    HfRadioModule,
    HfSelectModule,
    HfTextareaModule,
    HfRangeModule,
    HfSearchModule
  ]
})
export class HfFormsModule {}
