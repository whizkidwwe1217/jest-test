import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';


@Injectable()
export class ApplicationEffects {

  constructor(private actions$: Actions) {}
}
