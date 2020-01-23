import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import * as _ from "lodash";
import { DataField } from "hordeflow-common";

@Pipe({
  name: "renderField"
})
export class DatagridRendererPipe implements PipeTransform {
  constructor(protected sanitizer: DomSanitizer) {}
  transform(field: DataField<any>, record, value, index: number, useRenderer: boolean) {
    return useRenderer
      ? this.sanitizer.bypassSecurityTrustHtml(
          field.render(field, record, this.getRenderValue(record, field, index), index)
        )
      : this.getRecordValue(record, field, index);
  }

  getRenderValue(record: any, field: DataField<any>, index: number) {
    const value = this.getRecordValue(record, field, index);
    return value || "";
  }

  getRecordValue(record: any, field: DataField<any>, index: number) {
    return _.get(record, field.name);
  }
}
