export interface DatagridRowAction<T> {
  text: string;
  name: string;
  icon?: string;
  perform(record: T, index: number, event: any): void;
}
