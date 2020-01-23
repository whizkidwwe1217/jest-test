/**
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ClrIconModule } from "@clr/angular";
import { HfInputContainer } from "./hf-input-container";
import { HfCommonFormsModule } from "../common/hf-common.module";
import { HfInput } from "./hf-input";

@NgModule({
  imports: [CommonModule, FormsModule, ClrIconModule, HfCommonFormsModule],
  declarations: [HfInput, HfInputContainer],
  exports: [HfCommonFormsModule, HfInput, HfInputContainer],
  entryComponents: [HfInputContainer]
})
export class HfInputModule {}
