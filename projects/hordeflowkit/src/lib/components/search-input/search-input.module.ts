import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClarityModule } from "@clr/angular";
import { FormsModule } from "@angular/forms";
import { HfSearchInput } from "./search-input";

@NgModule({
    imports: [CommonModule, FormsModule, ClarityModule],
    declarations: [HfSearchInput],
    exports: [HfSearchInput]
})
export class HfSearchInputModule {}
