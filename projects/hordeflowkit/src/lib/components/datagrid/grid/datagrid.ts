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
  selector: "hf-datagrid",
  styleUrls: ["./datagrid.scss"],
  templateUrl: "./datagrid.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Datagrid<T> extends DatagridBase<T> {
  constructor(cdref: ChangeDetectorRef) {
    super();
    this.cdref = cdref;
  }
}
