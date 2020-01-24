import { Component, forwardRef } from "@angular/core";
import { Validators } from "@angular/forms";
import { DatagridEditorAccountService, DatagridEditor } from "hordeflowkit";
import { SmartAuthService } from "src/app/authentication/services/smart-auth.service";

@Component({
  selector: "app-company-form",
  templateUrl: "./company-form.component.html",
  providers: [
    {
      provide: DatagridEditorAccountService,
      useExisting: forwardRef(() => SmartAuthService)
    },
    {
      provide: DatagridEditor,
      useExisting: forwardRef(() => CompanyFormComponent)
    }
  ]
})
export class CompanyFormComponent extends DatagridEditor {
  buildFormControls() {
    return {
      name: ["", Validators.required],
      code: ["", Validators.required]
    };
  }
}
