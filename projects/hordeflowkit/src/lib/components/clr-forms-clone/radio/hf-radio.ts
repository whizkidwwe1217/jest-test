/**
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  Directive,
  ElementRef,
  Injector,
  Optional,
  Renderer2,
  Self,
  ViewContainerRef
} from "@angular/core";
import { NgControl } from "@angular/forms";
import { HfWrappedFormControl } from "../common/hf-wrapped-control";
import { HfRadioWrapper } from "./hf-radio-wrapper";

@Directive({ selector: "[hfRadio]" })
export class HfRadio extends HfWrappedFormControl<HfRadioWrapper> {
  constructor(
    vcr: ViewContainerRef,
    injector: Injector,
    @Self()
    @Optional()
    control: NgControl,
    renderer: Renderer2,
    el: ElementRef
  ) {
    super(vcr, HfRadioWrapper, injector, control, renderer, el);
  }
}
