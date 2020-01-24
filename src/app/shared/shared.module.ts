import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HordeflowkitModule } from "hordeflowkit";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { InflectorPipe } from "./pipes/inflector.pipe";
import { EllipsisPipe } from "./pipes/ellipsis.pipe";
import { InitialsPipe } from "./pipes/initials.pipe";
import { AssemblyInpsectorComponent } from "./components/assembly-inspector/assembly-inspector.component";
import { CamelizePipe } from "./pipes/camelize.pipe";
import { TimeAgoPipe } from "./pipes/time-ago.pipe";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ClarityModule } from "@clr/angular";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { SearchBoxComponent } from "./components/search-box/search-box.component";
import { CircleProgressComponent } from "./components/circle-progress/circle-progress.component";
import { HfFocusInput } from "./directives/focus-input.directive";
import { PersonPipe } from "./pipes/person.pipe";
import { LocalDateTimePipe } from "./pipes/local-date-time.pipe";
import { LocalNumberPipe } from "./pipes/local-number.pipe";
import { SafeHtmlPipe } from "./pipes/safe-html.pipe";
import { RichEditorModule } from "./components/rich-editor/rich-editor.module";
import { DynamicList } from "./components/dynamic-list/dynamic-list";
import { CalendarComponent } from "./components/calendar/calendar.component";
import { CalendarWeekViewComponent } from "./components/calendar/week-view/calendar.week-view.component";
import { NaturalType } from "./pipes/natural-type.pipe";
import { ControlPermissionDirective } from "./directives/control-permission.directive";
import { ClickOutsideDirective } from "./directives/click-outside.directive";
import { DisableAutoFillDirective } from "./directives/disable-autofill.directive";

const pipes = [
  EllipsisPipe,
  TimeAgoPipe,
  InflectorPipe,
  InitialsPipe,
  PersonPipe,
  LocalDateTimePipe,
  LocalNumberPipe,
  SafeHtmlPipe,
  NaturalType,
  CamelizePipe
];

const directives = [
  HfFocusInput,
  DisableAutoFillDirective,
  ControlPermissionDirective,
  ClickOutsideDirective
];

const components = [
  PageNotFoundComponent,
  // ---------------------
  AssemblyInpsectorComponent,
  SearchBoxComponent,
  CircleProgressComponent,
  DynamicList,
  // --- DIRECTIVES
  CalendarComponent,
  CalendarWeekViewComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxChartsModule,
    RouterModule,
    ClarityModule,
    HordeflowkitModule,
    RichEditorModule
  ],
  declarations: [...pipes, ...directives, components],
  exports: [...pipes, ...directives, components]
})
export class SharedModule {
  // static forRoot(): ModuleWithProviders {
  // 	return {
  // 		ngModule: SharedModule,
  // 		providers: [SmartAuthService]
  // 	};
  // }
}
