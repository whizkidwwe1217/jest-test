import { NgModule } from "@angular/core";
import { RichEditorComponent } from "./rich-editor.component";
import { RichEditorToolbarComponent } from "./rich-editor-toolbar.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { HordeflowkitModule } from "hordeflowkit";
import { ClarityModule } from "@clr/angular";

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		ClarityModule,
		HordeflowkitModule
	],
	declarations: [RichEditorComponent, RichEditorToolbarComponent],
	exports: [RichEditorComponent, RichEditorToolbarComponent]
})
export class RichEditorModule {}
