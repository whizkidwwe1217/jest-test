import { NgModule } from "@angular/core";
import { HordeflowCommonModule } from "hordeflow-common";
import { HfSpinnerModule } from "./components/spinner/spinner.module";
import { HfAvatarModule } from "./components/avatar/avatar.module";
import { HfBreadcrumbModule } from "./components/breadcrumb/breadcrumb.module";
import { HfSearchInputModule } from "./components/search-input/search-input.module";
import { HfPageTitleModule } from "./components/page-title/page-title.module";
import { HfPagerModule } from "./components/pager/pager.module";
import { HfContentPanelModule } from "./components/content-panel/content-panel.module";
import { HfSidePanelModule } from "./components/side-panel/side-panel.module";
import { HfDynamicListModule } from "./components/dynamic-list/dynamic-list.module";
import { HfEmptyPageModule } from "./components/empty-page/empty-page.module";
import { HfAccordionModule } from "./components/accordion/accordion.module";
import { HfCommandBarModule } from "./components/command-bar/command-bar.module";
import { HfFormsModule } from "./components/clr-forms-clone/hf-forms.module";
import { NgbPopoverModule } from "./components/popover/popover.module";
import { HfDatagridModule } from "./components/datagrid/datagrid.module";
import { CommonModule } from "@angular/common";
import { ClrNotificationModule, ClrNotification } from "./components/notification";

@NgModule({
	declarations: [],
	imports: [CommonModule, HordeflowCommonModule],
	exports: [
		HfSpinnerModule,
		HfAvatarModule,
		HfBreadcrumbModule,
		HfSearchInputModule,
		HfPageTitleModule,
		HfPagerModule,
		HfContentPanelModule,
		HfSidePanelModule,
		HfDynamicListModule,
		HfEmptyPageModule,
		HfAccordionModule,
		HfCommandBarModule,
		NgbPopoverModule,
		HfFormsModule,
		HfDatagridModule
	]
})
export class HordeflowkitModule {}
