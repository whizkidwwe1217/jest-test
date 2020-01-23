/**
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ClrIconModule } from "@clr/angular";
import { HfCommonFormsModule } from "../common/hf-common.module";
import { HfHostWrappingModule } from "../../clr-utils/host-wrapping/hf-host-wrapping.module";
import { HfRadioWrapper } from "./hf-radio-wrapper";
import { HfRadioContainer } from "./hf-radio-container";
import { HfRadio } from "./hf-radio";

@NgModule({
  imports: [CommonModule, HfCommonFormsModule, HfHostWrappingModule, ClrIconModule],
  declarations: [HfRadio, HfRadioContainer, HfRadioWrapper],
  exports: [HfCommonFormsModule, HfRadio, HfRadioContainer, HfRadioWrapper],
  entryComponents: [HfRadioWrapper]
})
export class HfRadioModule {}
