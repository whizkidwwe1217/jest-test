/**
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { HfCommonFormsModule } from "../common/hf-common.module";
import { HfCheckboxWrapper } from "./hf-checkbox-wrapper";
import { HfCheckboxContainer } from "./hf-checkbox-container";
import { HfCheckbox } from "./hf-checkbox";
import { ClrIconModule } from "@clr/angular";
import { HfHostWrappingModule } from "../../clr-utils/host-wrapping/hf-host-wrapping.module";

@NgModule({
  imports: [CommonModule, ClrIconModule, HfCommonFormsModule, HfHostWrappingModule],
  declarations: [HfCheckbox, HfCheckboxContainer, HfCheckboxWrapper],
  exports: [HfCommonFormsModule, HfCheckbox, HfCheckboxContainer, HfCheckboxWrapper],
  entryComponents: [HfCheckboxWrapper]
})
export class HfCheckboxModule {}
