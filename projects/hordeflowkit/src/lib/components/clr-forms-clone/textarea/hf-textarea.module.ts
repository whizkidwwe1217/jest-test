/**
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ClrIconModule } from "@clr/angular";
import { HfCommonFormsModule } from "../common/hf-common.module";
import { HfTextareaContainer } from "./hf-textarea-container";
import { HfTextarea } from "./hf-textarea";

@NgModule({
  imports: [CommonModule, FormsModule, ClrIconModule, HfCommonFormsModule],
  declarations: [HfTextarea, HfTextareaContainer],
  exports: [HfCommonFormsModule, HfTextarea, HfTextareaContainer],
  entryComponents: [HfTextareaContainer]
})
export class HfTextareaModule {}
