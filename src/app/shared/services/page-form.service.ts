import { Injectable } from "@angular/core";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import * as _ from "lodash";
import { SmartAuthService } from "src/app/authentication/services/smart-auth.service";
import { Observable, throwError, of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { DataSource } from "hordeflow-common";

export class PageFormOptions {
  public canActivate = true;
  public canSoftDelete = true;
  public canAudit = true;
  public handlesConcurrency = true;
}

@Injectable()
export class PageFormService<T> {
  constructor(protected fb: FormBuilder, protected authService: SmartAuthService) {}

  public build(
    formControls: any,
    dataSource?: DataSource<T>,
    record?: T,
    options?: PageFormOptions
  ): Observable<{ form: FormGroup; record: T }> {
    options = options || new PageFormOptions();
    const form: FormGroup = this.fb.group(
      _.merge(this.buildSystemFormControls(options), formControls)
    );

    const formValue = _.pick(_.merge(form.value, record), _.keys(form.controls));

    form.setValue(formValue);
    const id = +_.get(record, "id");

    if (dataSource && id) {
      return dataSource.read(id).pipe(
        switchMap(serverRecord => {
          const freshValues = _.pick(_.merge(form.value, serverRecord), _.keys(form.controls));
          form.setValue(freshValues);
          return of({ form: form, record: serverRecord });
        })
      );
    }

    return of({ form: form, record: record });
  }

  private buildSystemFormControls(options: PageFormOptions) {
    return _.merge(
      {
        id: null,
        companyId: this.authService.getLoggedAccount().companyId
      },
      this.buildConcurrencyFormControls(options.handlesConcurrency),
      this.buildCanActivateFormControls(options.canActivate),
      this.buildCanSoftDeleteFormControls(options.canSoftDelete),
      this.buildCanAuditFormControls(options.canAudit)
    );
  }

  private getFormControlsForReset(options: PageFormOptions) {
    return this.buildSystemFormControls(options);
  }

  private buildConcurrencyFormControls(handlesConcurrency: boolean) {
    return handlesConcurrency
      ? {
          concurrencyTimeStamp: null,
          concurrencyStamp: null
        }
      : {};
  }
  private buildCanAuditFormControls(canAudit: boolean) {
    return canAudit
      ? {
          dateCreated: null,
          dateModified: null,
          dateDeleted: null
        }
      : {};
  }

  private buildCanSoftDeleteFormControls(canSoftDelete: boolean) {
    return canSoftDelete
      ? {
          deleted: false
        }
      : {};
  }

  private buildCanActivateFormControls(canActivate: boolean) {
    if (!canActivate) return {};
    return {
      active: true
    };
  }
}
