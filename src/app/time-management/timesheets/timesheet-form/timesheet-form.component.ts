import { Component, forwardRef } from "@angular/core";
import { Validators } from "@angular/forms";
import * as dateFns from "date-fns";
import * as dateFnsLocales from "date-fns/locale";
import { TypedFields } from "hordeflow-common";
import { DatagridEditorAccountService, DatagridEditor } from "hordeflowkit";
import { SmartAuthService } from "src/app/authentication/services/smart-auth.service";
@Component({
  selector: "hrf-timesheet-form",
  templateUrl: "timesheet-form.component.html",
  styleUrls: ["timesheet-form.component.scss"],
  providers: [
    {
      provide: DatagridEditorAccountService,
      useExisting: forwardRef(() => SmartAuthService)
    },
    {
      provide: DatagridEditor,
      useExisting: forwardRef(() => TimesheetFormComponent)
    }
  ]
})
export class TimesheetFormComponent extends DatagridEditor {
  buildFormControls() {
    const startDate = dateFns.format(dateFns.startOfMonth(new Date()), "MM/dd/yyyy", {
      locale: dateFnsLocales.enUS
    });
    const endDate = dateFns.format(dateFns.addDays(Date.parse(startDate), 14), "MM/dd/yyyy", {
      locale: dateFnsLocales.enUS
    });
    return {
      startDate: [startDate, Validators.required],
      endDate: [endDate, Validators.required],
      description: null,
      isLocked: false
    };
  }

  getTypedFields(): TypedFields[] {
    return [
      { name: "startDate", type: "date" },
      { name: "endDate", type: "date" }
    ];
  }
}
