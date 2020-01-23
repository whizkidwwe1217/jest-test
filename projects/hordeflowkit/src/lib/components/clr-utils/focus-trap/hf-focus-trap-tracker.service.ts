/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from "@angular/core";
import { HfFocusTrapDirective } from "./hf-focus-trap.directive";

@Injectable({ providedIn: "root" })
export class HfFocusTrapTracker {
  private _previousFocusTraps: HfFocusTrapDirective[] = [];
  private _current: HfFocusTrapDirective;

  get current(): HfFocusTrapDirective {
    return this._current;
  }

  set current(value: HfFocusTrapDirective) {
    this._previousFocusTraps.push(this._current);
    this._current = value;
  }

  get nbFocusTrappers(): number {
    return this._previousFocusTraps.length;
  }

  activatePreviousTrapper() {
    this._current = this._previousFocusTraps.pop();
  }
}
