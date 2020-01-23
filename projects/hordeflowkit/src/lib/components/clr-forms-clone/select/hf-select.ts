/**
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  Directive,
  ViewContainerRef,
  Renderer2,
  ElementRef,
  Injector,
  Optional,
  Self
} from "@angular/core";

import { NgControl } from "@angular/forms";
import { HfWrappedFormControl } from "../common/hf-wrapped-control";
import { HfSelectContainer } from "./hf-select-container";

@Directive({ selector: "[hfSelect]", host: { "[class.clr-select]": "true" } })
export class HfSelect extends HfWrappedFormControl<HfSelectContainer> {
  protected index = 1;

  constructor(
    vcr: ViewContainerRef,
    injector: Injector,
    @Self()
    @Optional()
    control: NgControl,
    renderer: Renderer2,
    el: ElementRef
  ) {
    super(vcr, HfSelectContainer, injector, control, renderer, el);
  }
}
