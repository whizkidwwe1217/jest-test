import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClarityModule } from "@clr/angular";
import { RouterModule } from "@angular/router";
import { HfDynamicList } from "./dynamic-list";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    imports: [CommonModule, ClarityModule, RouterModule, FormsModule, ReactiveFormsModule],
    declarations: [HfDynamicList],
    exports: [HfDynamicList]
})
export class HfDynamicListModule {}
