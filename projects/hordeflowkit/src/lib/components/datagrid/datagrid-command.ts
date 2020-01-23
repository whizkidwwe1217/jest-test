export class DatagridCommand {
  name: string;
  text: string;
  icon?: string;
  overflow?: boolean;
  disabled?: boolean;
  items?: DatagridCommand[];
  click?(event): void;
}
