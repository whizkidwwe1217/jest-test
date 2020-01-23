/**
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import {
  HostBinding,
  InjectionToken,
  HostListener,
  Injector,
  Input,
  OnInit,
  Type,
  ViewContainerRef,
  Renderer2,
  ElementRef,
  OnDestroy
} from "@angular/core";
import { Subscription } from "rxjs";
import { filter, distinctUntilChanged, startWith } from "rxjs/operators";
import { NgControl } from "@angular/forms";
import { HfNgControlService } from "./providers/hf-ng-control.service";
import { HfIfErrorService } from "./if-error/hf-if-error.service";
import { HfControlClassService } from "./providers/hf-control-class.service";
import { HfMarkControlService } from "./providers/hf-mark-control.service";
import { HfControlIdService } from "./providers/hf-control-id.service";
import { HfDynamicWrapper } from "../../clr-utils/host-wrapping/hf-dynamic-wrapper";
import { HfHostWrapper } from "../../clr-utils/host-wrapping/hf-host-wrapper";

export class HfWrappedFormControl<W extends HfDynamicWrapper> implements OnInit, OnDestroy {
  protected ngControlService: HfNgControlService;
  private ifErrorService: HfIfErrorService;
  private controlClassService: HfControlClassService;
  private markControlService: HfMarkControlService;
  protected renderer: Renderer2;
  protected el: ElementRef<any>;

  protected subscriptions: Subscription[] = [];
  protected index = 0;
  protected controlIdService: HfControlIdService;

  _id: string;

  // I lost way too much time trying to make this work without injecting the ViewContainerRef and the Injector,
  // I'm giving up. So we have to inject these two manually for now.
  constructor(
    protected vcr: ViewContainerRef,
    protected wrapperType: Type<W>,
    injector: Injector,
    private ngControl: NgControl,
    renderer: Renderer2,
    el: ElementRef
  ) {
    this.renderer = renderer;
    this.el = el;
    try {
      this.ngControlService = injector.get(HfNgControlService);
      this.ifErrorService = injector.get(HfIfErrorService);
      this.controlClassService = injector.get(HfControlClassService);
      this.markControlService = injector.get(HfMarkControlService);
    } catch (e) {}

    if (this.controlClassService) {
      this.controlClassService.initControlClass(renderer, el.nativeElement);
    }
    if (this.markControlService) {
      this.subscriptions.push(
        this.markControlService.touchedChange.subscribe(() => {
          this.ngControl.control.markAsTouched();
          this.ngControl.control.updateValueAndValidity();
        })
      );
    }
  }

  @HostBinding()
  @Input()
  get id() {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
    if (this.controlIdService) {
      this.controlIdService.id = value;
    }
  }

  @HostListener("blur")
  triggerValidation() {
    if (this.ifErrorService) {
      this.ifErrorService.triggerStatusChange();
    }
  }

  private _containerInjector: Injector;

  // @TODO This method has a try/catch due to an unknown issue that came when building the clrToggle feature
  // We need to figure out why this fails for the ClrToggle scenario but works for Date picker...
  // To see the error, remove the try/catch here and run the ClrToggle suite to see issues getting the container
  // injector in time, and this ONLY HAPPENS in tests and not in dev/prod mode.
  protected getProviderFromContainer<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: T): T {
    try {
      return this._containerInjector.get(token, notFoundValue);
    } catch (e) {
      return notFoundValue;
    }
  }

  ngOnInit() {
    this._containerInjector = new HfHostWrapper(this.wrapperType, this.vcr, this.index);
    this.controlIdService = this._containerInjector.get(HfControlIdService);

    if (this._id) {
      this.controlIdService.id = this._id;
    } else {
      this._id = this.controlIdService.id;
    }

    if (this.ngControlService) {
      this.ngControlService.setControl(this.ngControl);
    }

    this.listenForErrorStateChanges();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private listenForErrorStateChanges() {
    if (this.ifErrorService) {
      this.subscriptions.push(
        this.ifErrorService.statusChanges
          .pipe(
            startWith(false),
            filter(() => this.renderer && !!this.el),
            distinctUntilChanged()
          )
          .subscribe(error => this.setAriaDescribedBy(error))
      );
    }
  }

  private setAriaDescribedBy(error: boolean) {
    this.renderer.setAttribute(
      this.el.nativeElement,
      "aria-describedby",
      this.getAriaDescribedById(error)
    );
  }

  private getAriaDescribedById(error: boolean): string {
    return this.controlIdService.id.concat(error ? "-error" : "-helper");
  }
}
