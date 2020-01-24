import { Component, forwardRef } from "@angular/core";
import { Validators } from "@angular/forms";
import { DatagridEditorAccountService, DatagridEditor } from "hordeflowkit";
import { SmartAuthService } from "src/app/authentication/services/smart-auth.service";

@Component({
  selector: "app-pay-item-form",
  templateUrl: "./pay-item-form.component.html",
  providers: [
    {
      provide: DatagridEditorAccountService,
      useExisting: forwardRef(() => SmartAuthService)
    },
    {
      provide: DatagridEditor,
      useExisting: forwardRef(() => PayItemFormComponent)
    }
  ]
})
export class PayItemFormComponent extends DatagridEditor {
  buildFormControls() {
    return {
      name: ["", Validators.required],
      description: "",
      payItemType: "Earning",
      isTaxable: false,
      isStandard: false
    };
  }
}
