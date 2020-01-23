import { NgModule } from "@angular/core";
import { HFSPINNER_COMPONENTS } from "./spinner-types";
import { CommonModule } from "@angular/common";
import { HfSpinner } from "./spinner";
import { HfSpinBox } from "./spin-box/spin-box";

@NgModule({
    declarations: [
        HfSpinner,
        HFSPINNER_COMPONENTS,
        HfSpinBox
    ],
    imports: [CommonModule],
    exports: [HfSpinner, HFSPINNER_COMPONENTS],
})
export class HfSpinnerModule {}
