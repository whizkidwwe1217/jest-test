/**
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { HfControlError } from "./hf-error";
import { HfControlHelper } from "./hf-helper";
import { HfIfError } from "./if-error/hf-if-error";
import { HfForm } from "./hf-form";
import { HfLayout } from "./hf-layout";
import { HfLabel } from "./hf-label";

@NgModule({
  imports: [CommonModule],
  declarations: [HfLabel, HfControlError, HfControlHelper, HfIfError, HfForm, HfLayout],
  exports: [HfLabel, HfControlError, HfControlHelper, HfIfError, HfForm, HfLayout]
})
export class HfCommonFormsModule {}
