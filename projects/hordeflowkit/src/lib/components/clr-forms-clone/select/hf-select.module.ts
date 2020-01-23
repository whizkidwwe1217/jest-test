/**
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ClrIconModule } from "@clr/angular";
import { HfSelectContainer } from "./hf-select-container";
import { HfCommonFormsModule } from "../common/hf-common.module";
import { HfSelect } from "./hf-select";

@NgModule({
  imports: [CommonModule, FormsModule, ClrIconModule, HfCommonFormsModule],
  declarations: [HfSelect, HfSelectContainer],
  exports: [HfCommonFormsModule, HfSelect, HfSelectContainer],
  entryComponents: [HfSelectContainer]
})
export class HfSelectModule {}
