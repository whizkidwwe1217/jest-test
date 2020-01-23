/**
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { HfCommonFormsModule } from "../common/hf-common.module";
import { HfHostWrappingModule } from "../../clr-utils/host-wrapping/hf-host-wrapping.module";
import { HfRange } from "./hf-range";
import { HfRangeContainer } from "./hf-range-container";
import { ClrIconModule } from "@clr/angular";

@NgModule({
  imports: [CommonModule, HfCommonFormsModule, HfHostWrappingModule, ClrIconModule],
  declarations: [HfRange, HfRangeContainer],
  exports: [HfCommonFormsModule, HfRange, HfRangeContainer],
  entryComponents: [HfRangeContainer]
})
export class HfRangeModule {}
