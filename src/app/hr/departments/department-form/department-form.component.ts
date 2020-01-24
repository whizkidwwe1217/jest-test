import { Component, forwardRef } from "@angular/core";
import { Validators, FormBuilder } from "@angular/forms";
import { DatagridEditor, DatagridEditorAccountService } from "hordeflowkit";
import { SmartAuthService } from "src/app/authentication/services/smart-auth.service";

@Component({
  selector: "app-department-form",
  templateUrl: "./department-form.component.html",
  styleUrls: ["./department-form.component.scss"],
  providers: [
    {
      provide: DatagridEditorAccountService,
      useExisting: forwardRef(() => SmartAuthService)
    },
    {
      provide: DatagridEditor,
      useExisting: forwardRef(() => DepartmentFormComponent)
    }
  ]
})
export class DepartmentFormComponent extends DatagridEditor {
  buildFormControls() {
    return {
      code: ["", Validators.required],
      name: ["", Validators.required],
      description: ""
    };
  }
}
