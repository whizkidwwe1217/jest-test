import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  OnInit,
  AfterViewInit,
  ContentChild,
  TemplateRef,
  ContentChildren,
  QueryList,
  ElementRef,
  Input,
  Renderer2
} from "@angular/core";
import { HttpService, UriResource, DataWebApiDataSource } from "hordeflow-common";
import { Observable, of } from "rxjs";
import { ClrForm } from "@clr/angular";
import { JobHistoryFormComponent } from "./job-history-form.component";
import { HfSidePanel, DatagridViewPageEditorService } from "hordeflowkit";
import { switchMap, tap } from "rxjs/operators";

@Component({
  selector: "hrf-job-history",
  templateUrl: "job-history.component.html",
  styleUrls: ["job-history.component.scss"]
})
export class JobHistoryComponent implements OnInit {
  jobHistories: Observable<any>;
  onAccept: Observable<any>;
  openHistoryForm: boolean;
  showJobHistoryRemovalConfirmation: boolean;
  jobHistoryMarkedForRemoval: any;

  @ViewChild(JobHistoryFormComponent, { static: false }) form: JobHistoryFormComponent;
  @ViewChild("historyList", { static: true }) list!: ElementRef<any>;

  @Input() employeeId: number;

  constructor(
    private http: HttpService,
    public datagridService: DatagridViewPageEditorService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.loadJobHistory();
  }

  private getDataSource(): DataWebApiDataSource<any> {
    const resource = new UriResource().setUrl(
      `api/v1/organization/employee/${this.employeeId}/jobhistory`
    );
    return new DataWebApiDataSource(this.http).setResource(resource);
  }

  private loadJobHistory() {
    this.jobHistories = this.http.list(this.getDataSource().getResource().url);
  }

  addJobHistory(e) {
    this.openHistoryForm = true;
    this.datagridService.editorState.status = "adding";
    this.datagridService.editorState.payload = { employeeId: this.employeeId };
  }

  editJobHistory(history) {
    this.openHistoryForm = true;
    this.datagridService.editorState.status = "editing";
    this.datagridService.editorState.payload = [history];
    this.datagridService.editorState.dataSource = this.getDataSource();
  }

  markJobHistoryForRemoval(history) {
    this.jobHistoryMarkedForRemoval = history;
    this.showJobHistoryRemovalConfirmation = true;
  }

  removeJobHistory() {
    this.getDataSource()
      .destroy(this.jobHistoryMarkedForRemoval.id)
      .subscribe(
        x => {
          const el = this.list.nativeElement.querySelector(
            `li[id='${this.jobHistoryMarkedForRemoval.id}'`
          );
          this.list.nativeElement.removeChild(el);
          this.jobHistoryMarkedForRemoval = null;
          this.showJobHistoryRemovalConfirmation = false;
        },
        err => (this.showJobHistoryRemovalConfirmation = false)
      );
  }

  accept(): Observable<any> {
    return of(true).pipe(switchMap(e => this.form.accept()));
  }

  onAccepted(e) {
    this.loadJobHistory();
  }
}
