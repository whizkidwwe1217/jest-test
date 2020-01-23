/**
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  Directive,
  Optional,
  ViewContainerRef,
  Renderer2,
  ElementRef,
  Injector,
  Self,
  OnInit,
  Input
} from "@angular/core";
import { NgControl } from "@angular/forms";
import { HfSearchContainer } from "./hf-search-container";
import { HfWrappedFormControl } from "../common/hf-wrapped-control";
import { HfSearchFormControlService } from "./hf-search-form-control.service";
import { isBooleanAttributeSet } from "../../clr-utils/component/hf-is-boolean-attribute-set";

@Directive({ selector: "[hfSearch]", host: { "[class.hf-search]": "true" } })
export class HfSearchDirective extends HfWrappedFormControl<HfSearchContainer> implements OnInit {
  protected index = 1;

  constructor(
    vcr: ViewContainerRef,
    injector: Injector,
    @Self()
    @Optional()
    control: NgControl,
    renderer: Renderer2,
    el: ElementRef,
    @Optional() private searchFormControlService: HfSearchFormControlService,
    @Optional() private searchContainer: HfSearchContainer
  ) {
    super(vcr, HfSearchContainer, injector, control, renderer, el);
  }

  _disabled: boolean | string;

  get disabled(): boolean | string {
    return this._disabled;
  }

  @Input("disabled")
  set disabled(value: boolean | string) {
    if (this.searchFormControlService)
      this.searchFormControlService.setDisabled(isBooleanAttributeSet(value));
    this._disabled = value;
  }

  populateServicesFromContainerComponent() {
    if (!this.searchContainer) {
      this.searchFormControlService = this.getProviderFromContainer(HfSearchFormControlService);
    }
  }

  ngOnInit() {
    super.ngOnInit();
    this.populateServicesFromContainerComponent();
  }
}
