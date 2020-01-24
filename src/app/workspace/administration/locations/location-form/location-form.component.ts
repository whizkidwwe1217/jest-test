import { Component, OnInit, Input, forwardRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DatagridEditorAccountService, DatagridEditor } from "hordeflowkit";
import { SmartAuthService } from "src/app/authentication/services/smart-auth.service";

@Component({
  selector: "app-location-form",
  templateUrl: "./location-form.component.html",
  styleUrls: ["./location-form.component.scss"],
  providers: [
    {
      provide: DatagridEditorAccountService,
      useExisting: forwardRef(() => SmartAuthService)
    },
    {
      provide: DatagridEditor,
      useExisting: forwardRef(() => LocationFormComponent)
    }
  ]
})
export class LocationFormComponent extends DatagridEditor {
  buildFormControls() {
    return {
      name: ["", Validators.required],
      code: ["", Validators.required],
      type: ["Office", Validators.required],
      website: null,
      email: null,
      phoneNumber: null,
      faxNumber: null,
      notes: null
    };
  }
}
