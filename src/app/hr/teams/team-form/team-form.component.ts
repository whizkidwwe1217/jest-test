import { Component, OnInit, Input, forwardRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DatagridEditorAccountService, DatagridEditor } from "hordeflowkit";
import { SmartAuthService } from "src/app/authentication/services/smart-auth.service";

@Component({
  selector: "app-team-form",
  templateUrl: "./team-form.component.html",
  providers: [
    {
      provide: DatagridEditorAccountService,
      useExisting: forwardRef(() => SmartAuthService)
    },
    {
      provide: DatagridEditor,
      useExisting: forwardRef(() => TeamFormComponent)
    }
  ]
})
export class TeamFormComponent extends DatagridEditor {
  buildFormControls() {
    return {
      code: ["", Validators.required],
      name: ["", Validators.required],
      description: ""
    };
  }
}
