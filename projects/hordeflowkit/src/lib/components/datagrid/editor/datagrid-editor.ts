import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { Component, OnInit, Output, EventEmitter, ViewChild, Injectable } from "@angular/core";
import * as dateFns from "date-fns";
import * as _ from "lodash";
import { ClrForm } from "@clr/angular";
import { TypedFields } from "hordeflow-common";
import { DatagridEditorAccountService } from "./datagrid-editor-account.service";
import { DatagridViewPageEditorService } from "./datagrid-view-page-editor.service";
import { triggerAllFormControlValidation } from "../../clr-utils/validation";

@Injectable()
export abstract class DatagridEditor implements OnInit {
  form: FormGroup;
  @ViewChild(ClrForm, /* TODO: add static flag */ { static: false })
  clarityForm: ClrForm;
  record: any;
  canActivate = true;
  canSoftDelete = true;
  canAudit = true;
  handlesConcurrency = true;
  @Output() recordfetched: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    protected fb: FormBuilder,
    protected dataGridService: DatagridViewPageEditorService,
    protected authService: DatagridEditorAccountService
  ) {}

  get mode() {
    return this.dataGridService.editorState.status;
  }

  ngOnInit(): void {
    this.form = this.fb.group(_.merge(this.buildSystemFormControls(), this.buildFormControls()));
    this.initializeFormValues();
  }

  initializeFormValues() {
    if (this.dataGridService.editorState.status === "editing") {
      const record = _.first(this.dataGridService.editorState.payload);
      const formValue = _.pick(_.merge(this.form.value, record), _.keys(this.form.controls));
      this.form.setValue(formValue);
      this.dataGridService.editorState.dataSource
        .read(_.get(record, "id"))
        .subscribe(serverRecord => {
          const freshValues = _.pick(
            _.merge(this.form.value, serverRecord),
            _.keys(this.form.controls)
          );
          this.setRecord(serverRecord);
          this.beforeFormBind(serverRecord, freshValues);
          this.transformFields(serverRecord, freshValues);
          this.form.setValue(freshValues);
          this.afterFormBind(serverRecord, freshValues);
        });
    }
  }

  private setRecord(record) {
    this.record = record;
    this.recordfetched.emit(record);
    this.onRecordFetched(record);
  }

  protected getTypedFields(): TypedFields[] {
    return [];
  }

  private transformFields(record, currentFormValues) {
    // Transform to valid time values
    const fields = _.filter(this.getTypedFields(), f =>
      ["date", "time", "datetime"].includes(f.type)
    );
    if (!_.isEmpty(fields)) {
      _.each(fields, f => {
        const date = _.get(record, f.name);
        if (_.isNull(date) || _.isUndefined(date)) return;

        switch (f.type) {
          case "time":
            _.set(
              currentFormValues,
              f.name,
              dateFns.format(dateFns.parseISO(date), "hh:mm:ss.SSS")
            );
            return;
          case "date":
            _.set(currentFormValues, f.name, dateFns.format(dateFns.parseISO(date), "MM/dd/yyyy"));
            return;
          case "datetime":
            _.set(
              currentFormValues,
              f.name,
              dateFns.format(dateFns.parseISO(date), "MM/dd/yyyy hh:mm:ss.SSS")
            );
            return;
          default:
            return;
        }
      });
    }
  }

  public onRecordFetched(record) {}
  public afterFormBind(record, currentFormValues) {}
  public beforeFormBind(record, currentFormValues) {}

  abstract buildFormControls();

  validate() {
    triggerAllFormControlValidation(this.form);
    // if (this.clarityForm) this.clarityForm.markAsTouched();
    // //.markAsDirty();
    // // If Clarity form is used, use its markAsDirty function
    // else this.validateAllFormFields(this.form); // This only works in version 2 of Clarity
  }

  getErrors(errors: any = {}) {
    Object.keys(this.form.controls).forEach(field => {
      const control = this.form.get(field);
      if (control instanceof FormControl) {
        errors[field] = control.errors;
      } else if (control instanceof FormGroup) {
        errors[field] = this.getErrors(control);
      }
    });
    return errors;
  }

  resetForm() {
    this.form.reset(this.getFormControlsForReset());
  }

  private buildSystemFormControls() {
    return _.merge(
      {
        id: null,
        companyId: this.authService.getLoggedAccount().companyId
      },
      this.getConcurrencyFormControls(),
      this.getCanActivateFormControls(),
      this.getCanSoftDeleteFormControls(),
      this.getCanAuditFormControls()
    );
  }

  private getFormControlsForReset() {
    return this.buildSystemFormControls();
  }

  private getConcurrencyFormControls() {
    return this.handlesConcurrency
      ? {
          concurrencyTimeStamp: null,
          concurrencyStamp: null
        }
      : {};
  }
  private getCanAuditFormControls() {
    return this.canAudit
      ? {
          dateCreated: null,
          dateModified: null,
          dateDeleted: null
        }
      : {};
  }

  private getCanSoftDeleteFormControls() {
    return this.canSoftDelete
      ? {
          deleted: false
        }
      : {};
  }

  private getCanActivateFormControls() {
    if (!this.canActivate) return {};
    return {
      active: true
    };
  }

  private validateAllFormFields(form: FormGroup) {
    Object.keys(form.controls).forEach(field => {
      const control = this.form.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true }); // This only works in version 2 of Clarity
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
}
