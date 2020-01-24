import { Component, forwardRef } from "@angular/core";
import { Validators } from "@angular/forms";
import * as dateFns from "date-fns";
import * as dateFnsLocales from "date-fns/locale";
import { TypedFields } from "hordeflow-common";
import { DatagridEditor, DatagridEditorAccountService } from "hordeflowkit";
import { SmartAuthService } from "src/app/authentication/services/smart-auth.service";

@Component({
  selector: "app-paysheet-form",
  templateUrl: "./paysheet-form.component.html",
  providers: [
    {
      provide: DatagridEditorAccountService,
      useExisting: forwardRef(() => SmartAuthService)
    },
    {
      provide: DatagridEditor,
      useExisting: forwardRef(() => PaysheetFormComponent)
    }
  ]
})
export class PaysheetFormComponent extends DatagridEditor {
  frequencies = [
    { id: 1, name: "Yearly", code: "Yearly" },
    { id: 2, name: "Quarterly", code: "Quarterly" },
    { id: 3, name: "Monthly", code: "Monthly" },
    { id: 4, name: "Semi-Monthly", code: "SemiMonthly" },
    { id: 5, name: "Bi-Weekly", code: "BiWeekly" },
    { id: 6, name: "Weekly", code: "Weekly" },
    { id: 7, name: "Daily", code: "Daily" },
    { id: 8, name: "Hourly", code: "Hourly" }
  ];

  buildFormControls() {
    const startDate = dateFns.format(dateFns.startOfMonth(new Date()), "MM/dd/yyyy", {
      locale: dateFnsLocales.enUS
    });
    const endDate = dateFns.format(dateFns.addDays(Date.parse(startDate), 14), "MM/dd/yyyy", {
      locale: dateFnsLocales.enUS
    });
    return {
      name: [null, Validators.required],
      description: null,
      payrollFrequency: null,
      factorRate: 261,
      startDate: startDate,
      endDate: endDate
    };
  }

  getTypedFields(): TypedFields[] {
    return [
      { name: "startDate", type: "date" },
      { name: "endDate", type: "date" }
    ];
  }
}
