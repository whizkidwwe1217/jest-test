import { Component, forwardRef } from "@angular/core";
import { Validators } from "@angular/forms";
import * as dateFns from "date-fns";
import * as dateFnsLocales from "date-fns/locale";
import { PersonPipe } from "src/app/shared/pipes/person.pipe";
import { TypedFields } from "hordeflow-common";
import { DatagridEditorAccountService, DatagridEditor } from "hordeflowkit";
import { SmartAuthService } from "src/app/authentication/services/smart-auth.service";
@Component({
  selector: "hrf-time-log-form",
  templateUrl: "time-log-form.component.html",
  styleUrls: ["time-log-form.component.scss"],
  providers: [
    {
      provide: DatagridEditorAccountService,
      useExisting: forwardRef(() => SmartAuthService)
    },
    {
      provide: DatagridEditor,
      useExisting: forwardRef(() => TimeLogFormComponent)
    }
  ]
})
export class TimeLogFormComponent extends DatagridEditor {
  buildFormControls() {
    const date = dateFns.format(new Date(), "MM/dd/yyyy", {
      locale: dateFnsLocales.enUS
    });
    return {
      employeeId: [null, Validators.required],
      date: [date, Validators.required],
      checkTime: [null, Validators.required],
      logType: [null, Validators.required],
      isNextDay: false,
      remarks: null
    };
  }

  getTypedFields(): TypedFields[] {
    return [
      { name: "date", type: "date" },
      { name: "checkTime", type: "time" }
    ];
  }

  getEmployeeLookupText = value => {
    return new PersonPipe().transform(value);
  };

  getNextDay() {
    if (this.form.get("date")) {
      return ` (${dateFns.format(
        dateFns.addDays(Date.parse(this.form.get("date").value), 1),
        "MM/dd/yyyy"
      )})`;
    }
    return "";
  }

  beforeSave(record, currentFormValue) {
    if (this.form.get("logType").value === "CheckIn") {
      currentFormValue.isNextDay = false;
      this.form.patchValue({ isNextDay: false });
    }
  }
}
