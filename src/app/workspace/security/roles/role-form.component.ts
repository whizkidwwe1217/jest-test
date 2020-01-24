import { Component, forwardRef } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { DatagridEditorAccountService, DatagridEditor } from "hordeflowkit";
import { SmartAuthService } from "src/app/authentication/services/smart-auth.service";

@Component({
  selector: "app-role-form",
  styleUrls: ["./role-form.component.scss"],
  templateUrl: "./role-form.component.html",
  providers: [
    {
      provide: DatagridEditorAccountService,
      useExisting: forwardRef(() => SmartAuthService)
    },
    {
      provide: DatagridEditor,
      useExisting: forwardRef(() => RoleFormComponent)
    }
  ]
})
export class RoleFormComponent extends DatagridEditor {
  buildFormControls() {
    return {
      name: ["", Validators.required],
      description: null,
      isSystemAdministrator: false
    };
  }

  onMemberAdded(item) {
    this.form.markAsDirty();
  }
}
