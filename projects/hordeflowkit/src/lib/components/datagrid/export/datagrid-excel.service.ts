import { Injectable } from "@angular/core";
import * as XLSX from "xlsx";

@Injectable({ providedIn: "root" })
export class DatagridExcelService {
  constructor() {}

  static toExportFileName(excelFileName: string): string {
    return `${excelFileName}_export_${new Date().getTime()}.xlsx`;
  }

  public generateWorkbook(json: any[], sheetname: string) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ["data"]
    };
    return workbook;
  }

  public exportAsExcelFile(json: any[], excelFileName: string, sheetname: string) {
    const workbook = this.generateWorkbook(json, sheetname);
    XLSX.writeFile(workbook, excelFileName);
    return workbook;
  }
}
