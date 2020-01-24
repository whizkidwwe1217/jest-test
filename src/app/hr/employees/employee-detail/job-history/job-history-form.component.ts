import { Component, OnInit, Input, forwardRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as dateFns from "date-fns";
import { HttpService, TypedFields, UriResource, DataWebApiDataSource } from "hordeflow-common";
import { SmartAuthService } from "src/app/authentication/services/smart-auth.service";
import { Observable, of, throwError } from "rxjs";
import { switchMap } from "rxjs/operators";
import * as _ from "lodash";
import {
  DatagridEditor,
  DatagridEditorAccountService,
  DatagridViewPageEditorService
} from "hordeflowkit";

@Component({
  selector: "hrf-job-history-form",
  templateUrl: "./job-history-form.component.html",
  providers: [
    {
      provide: DatagridEditorAccountService,
      useExisting: forwardRef(() => SmartAuthService)
    },
    {
      provide: DatagridEditor,
      useExisting: forwardRef(() => JobHistoryFormComponent)
    }
  ]
})
export class JobHistoryFormComponent extends DatagridEditor {
  @Input() employeeId: number;

  constructor(
    private http: HttpService,
    fb: FormBuilder,
    dataGridService: DatagridViewPageEditorService,
    authService: SmartAuthService
  ) {
    super(fb, dataGridService, authService);
  }

  buildFormControls() {
    return {
      employer: ["", Validators.required],
      jobTitle: ["", Validators.required],
      jobDescription: ["", Validators.required],
      dateHired: [null, Validators.required],
      dateSeparated: null
    };
  }

  getDateHired() {
    if (this.form.get("dateHired").value) {
      const date = dateFns.format(Date.parse(this.form.get("dateHired").value), "yyyy-MM-dd");
      return date;
    }
    return "";
  }

  getTypedFields(): TypedFields[] {
    return [
      { name: "dateHired", type: "date" },
      { name: "dateSeparated", type: "date" }
    ];
  }

  public accept(): Observable<any> {
    const dataSource = new DataWebApiDataSource<any>(this.http).setResource(
      new UriResource().setUrl(`api/v1/organization/employee/${this.employeeId}/jobhistory`)
    );

    return of(this.form.value).pipe(
      switchMap(() => {
        this.validate();
        if (this.form.valid) {
          let record = this.form.value;
          const payload = this.dataGridService.editorState.payload;

          if (this.dataGridService.editorState.status === "adding") {
            record = _.merge(record, payload);
            delete record.id;
            return dataSource.create(record);
          } else if (this.dataGridService.editorState.status === "editing") {
            return dataSource.update(
              _.merge(this.record, record),
              _.get(_.first(payload.records), "id")
            );
          } else if (this.dataGridService.editorState.status === "deleting") {
            return dataSource.destroy(_.get(_.first(payload.records), "id"));
          }
        }
        return throwError({
          title: "The form is invalid.",
          message: "The form has invalid values.",
          code: "596742",
          details: [this.getErrors()]
        });
      })
    );
  }
}
