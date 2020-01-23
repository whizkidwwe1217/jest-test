import * as _ from "lodash";
import { Inflector } from "hordeflow-common";
import * as XLSX from "xlsx";

export abstract class DatagridExporter {
  rawData: any;
  abstract export(sourceData: any, options?: any);
}

export class DatagridCsvExporter extends DatagridExporter {
  export(sourceData: any, options?: any) {
    const records: any[] = _.isArray(sourceData) ? sourceData : [sourceData];
    const delimiter: string = _.defaultTo(_.get(options, "delimiter"), ",");
    const humanizedHeaderNames: boolean = _.defaultTo(_.get(options, "humanizedHeaderNames"), true);
    const firstRecordAsHeader: boolean = _.defaultTo(_.get(options, "firstRecordAsHeader"), true);
    const keys = _.keys(_.first(records));
    const header = humanizedHeaderNames
      ? _.map(keys, key => new Inflector(key).titleize().value)
      : keys;
    const data: string[] = _.map(records, r => {
      return _.map(keys, key => {
        return _.isObjectLike(_.get(r, key)) ? "" : this.sanitize(_.get(r, key));
      }).join(delimiter);
    });

    this.rawData = firstRecordAsHeader ? [header, ...data] : data;
    const content = `data:text/csv;charset=utf-8,${this.rawData.join("\n").toString()}`;
    return encodeURI(content);
  }

  private hasNewLines = (input: string) => input.indexOf("\n") !== -1 || input.indexOf("\r") !== -1;
  private isWrappable = input =>
    input.indexOf(",") !== -1 ||
    this.hasNewLines(input) ||
    _.first(input) === " " ||
    _.last(input) === " ";
  private replaceQuotes = input => _.replace(input, '"', '""');
  private wrapWithQuotes = input => (this.isWrappable(input) ? '"' + input + '"' : input);
  public sanitize = input => this.wrapWithQuotes(this.replaceQuotes(input));
}

export class DatagridJsonExporter extends DatagridExporter {
  export(sourceData: any, options?: any) {
    this.rawData = _.map(sourceData, data =>
      _.mapKeys(data, (value, key) => {
        return new Inflector(_.replace(key, ".", " ")).titleize().value;
      })
    );
    const content = `data:text/csv;charset=utf-8,${JSON.stringify(this.rawData, null, "\t")}`;
    return encodeURI(content);
  }
}

export class DatagridExcelExporter extends DatagridExporter {
  export(sourceData: any, options?: any) {
    this.rawData = sourceData;
    return this.generateWorkbook(this.rawData, options.filename, options.sheetname);
  }

  private generateWorkbook(json: any[], filename: string, sheetname: string) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: [sheetname ? sheetname : "data"]
    };
    XLSX.writeFile(workbook, filename);
    return workbook;
  }
}

export class DatagridExportFactory {
  constructor(private type: string) {}

  createExporter(): DatagridExporter {
    switch (this.type) {
      case "csv":
        return new DatagridCsvExporter();
      case "excel":
        return new DatagridExcelExporter();
      default:
        return new DatagridJsonExporter();
    }
  }
}
