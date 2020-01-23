import {
  Component,
  ContentChild,
  TemplateRef,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from "@angular/core";
import { DatagridBase } from "./datagrid-base";

@Component({
  selector: "hf-datagrid-multi-select",
  styleUrls: ["./datagrid.scss"],
  templateUrl: "./datagrid-multi-select.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatagridMultiSelect<T> extends DatagridBase<T> {
  toggleEditor: boolean = false;
  constructor(cdref: ChangeDetectorRef) {
    super();
    this.cdref = cdref;
  }
}
