import { DataField, DataSource } from "hordeflow-common";

export interface DatagridEditorState {
  open: boolean;
  accepted: boolean;
  status: "viewing" | "closed" | "editing" | "adding" | "deleting";
  payload?: any;
  fields?: DataField<any>[];
  dataSource?: DataSource<any>;
}
