import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ClarityModule } from "@clr/angular";
import { DatagridRendererPipe } from "./grid/datagrid-renderer.pipe";
import { DatagridLayoutDirective } from "./datagrid-layout.directive";
import { HfContentPanelModule } from "../content-panel/content-panel.module";
import { HfEmptyPageModule } from "../empty-page/empty-page.module";
import { DatagridViewPage } from "./datagrid-view-page";
import { DataTable } from "./data-table/data-table";
import { HfSidePanelModule } from "../side-panel/side-panel.module";
import { HfCommandBarModule } from "../command-bar/command-bar.module";
import { Datagrid } from "./grid/datagrid";
import { ErrorMessageComponent } from "./error/error-messsage.component";
import { HordeflowCommonModule } from "hordeflow-common";
import { DatagridMultiSelect } from "./grid/datagrid-multi-select";
import { DatagridSingleSelect } from "./grid/datagrid-single-select";
import { ClrNotificationModule } from "../notification/notification.module";

const components = [
	Datagrid,
	DatagridMultiSelect,
	DatagridSingleSelect,
	DatagridRendererPipe,
	DatagridLayoutDirective,
	DatagridViewPage,
	DataTable,
	ErrorMessageComponent
];
@NgModule({
	imports: [
		CommonModule,
		ClarityModule,
		FormsModule,
		HordeflowCommonModule,
		ClrNotificationModule,
		HfContentPanelModule,
		HfEmptyPageModule,
		HfSidePanelModule,
		HfCommandBarModule
	],
	declarations: components,
	exports: components
})
export class HfDatagridModule {}
