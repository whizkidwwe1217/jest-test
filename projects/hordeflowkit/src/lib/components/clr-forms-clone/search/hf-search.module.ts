import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClarityModule, ClrCommonFormsModule } from "@clr/angular";
import { FormsModule } from "@angular/forms";
import { NgbPopoverModule } from "../../popover/popover.module";
import { HfCommonFormsModule } from "../common/hf-common.module";
import { HfSearchItem } from "./hf-search-item";
import { HfSearch } from "./hf-search";
import { HfSearchContainer } from "./hf-search-container";
import { HfSearchDirective } from "./hf-search.directive";
import { HfSearchItemCounterPipe } from "./hf-search-item-counter.pipe";
import { HfAvatarModule } from "../../avatar/avatar.module";
import { HfSpinnerModule } from "../../spinner/spinner.module";
import { HfCommandBarModule } from "../../command-bar/command-bar.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ClarityModule,
    HfAvatarModule,
    HfSpinnerModule,
    NgbPopoverModule,
    HfCommonFormsModule,
    HfCommandBarModule
  ],
  declarations: [
    HfSearch,
    HfSearchItem,
    HfSearchContainer,
    HfSearchDirective,
    HfSearchItemCounterPipe
  ],
  exports: [HfSearch, HfSearchItem, HfSearchContainer, HfSearchDirective, HfSearchItemCounterPipe],
  entryComponents: [HfSearchContainer]
})
export class HfSearchModule {}
