import { Component, forwardRef } from "@angular/core";
import { Validators } from "@angular/forms";
import { NumberSequenceGenerator } from "../../../../shared/number-sequences/number-sequence-generator";
import { DatagridEditorAccountService, DatagridEditor } from "hordeflowkit";
import { SmartAuthService } from "src/app/authentication/services/smart-auth.service";

@Component({
  selector: "app-number-sequence-form",
  templateUrl: "./number-sequence-form.component.html",
  styleUrls: ["./number-sequence-form.component.scss"],
  providers: [
    {
      provide: DatagridEditorAccountService,
      useExisting: forwardRef(() => SmartAuthService)
    },
    {
      provide: DatagridEditor,
      useExisting: forwardRef(() => NumberSequenceFormComponent)
    }
  ]
})
export class NumberSequenceFormComponent extends DatagridEditor {
  buildFormControls() {
    return {
      name: ["", Validators.required],
      startingValue: [1, Validators.required],
      prefix: null,
      suffix: null,
      leftPadding: 0,
      rightPadding: 0,
      leftPaddingChar: "0",
      rightPaddingChar: "0",
      cycleSequence: false,
      endCyclePosition: 0,
      resetValue: 0,
      remarks: null
    };
  }

  getNumberSequencePreview(): string {
    const generator: NumberSequenceGenerator = new NumberSequenceGenerator()
      .setStartingValue(this.form.value.startingValue)
      .setLeftPadding(this.form.value.leftPadding, this.form.value.leftPaddingChar)
      .setRightPadding(this.form.value.rightPadding, this.form.value.rightPaddingChar)
      .setPrefix(this.form.value.prefix)
      .setSuffix(this.form.value.suffix);

    return generator.nextNumberSequence();
  }
}
