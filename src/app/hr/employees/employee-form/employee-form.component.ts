import { Component, forwardRef, OnInit } from "@angular/core";
import { Validators, FormBuilder } from "@angular/forms";
import * as _ from "lodash";
import { switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { SmartAuthService } from "src/app/authentication/services/smart-auth.service";
import { HttpService, TypedFields } from "hordeflow-common";
import {
  DatagridEditorAccountService,
  DatagridEditor,
  DatagridViewPageEditorService
} from "hordeflowkit";

@Component({
  selector: "app-employee-form",
  templateUrl: "./employee-form.component.html",
  styleUrls: ["./employee-form.component.scss"],
  /**
   * Here, we need to tell the DI container to use EmployeeFormComponent when injecting DataGridPageFormComponent because
   * the content child selector in the DataGridPageComponent does not pick up form components that are inherited from DataGridPageFormComponent:
   * @ContentChild(DataGridPageFormComponent) gridForm: DataGridPageFormComponent;
   */
  providers: [
    {
      provide: DatagridEditorAccountService,
      useExisting: forwardRef(() => SmartAuthService)
    },
    {
      provide: DatagridEditor,
      useExisting: forwardRef(() => EmployeeFormComponent)
    }
  ]
})
export class EmployeeFormComponent extends DatagridEditor implements OnInit {
  frequencies = [
    { id: 1, name: "Yearly", code: "Yearly" },
    { id: 2, name: "Quarterly", code: "Quarterly" },
    { id: 3, name: "Monthly", code: "Monthly" },
    { id: 4, name: "Semi-Monthly", code: "SemiMonthly" },
    { id: 5, name: "Bi-Weekly", code: "BiWeekly" },
    { id: 6, name: "Weekly", code: "Weekly" },
    { id: 7, name: "Daily", code: "Daily" },
    { id: 8, name: "Hourly", code: "Hourly" }
  ];

  getSupervisorName: Function;

  constructor(
    protected fb: FormBuilder,
    protected dataGridService: DatagridViewPageEditorService,
    protected authService: SmartAuthService,
    private http: HttpService
  ) {
    super(fb, dataGridService, authService);
  }

  buildFormControls() {
    return {
      code: [null, Validators.required],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      middleName: null,
      birthDate: [null, Validators.required],
      birthPlace: null,
      gender: [null, Validators.required],
      maritalStatus: [null, Validators.required],
      departmentId: null,
      companyId: null,
      positionId: null,
      teamId: null,
      citizenship: null,
      emailAddress: null,
      race: null,
      nickname: null,
      dateEmployed: null,
      dateRegularized: null,
      dateSeparated: null,
      dateResigned: null,
      salaryFrequency: null,
      dateTerminated: null,
      gsis: null,
      sss: null,
      company: null,
      tenant: null,
      position: null,
      department: null,
      team: null,
      tin: null,
      phic: null,
      religion: null,
      supervisorId: null,
      baseRate: null
    };
  }

  getTypedFields(): TypedFields[] {
    return [
      { name: "birthDate", type: "date" },
      { name: "dateEmployed", type: "date" },
      { name: "dateRegularized", type: "date" },
      { name: "dateSeparated", type: "date" },
      { name: "dateResigned", type: "date" },
      { name: "dateTerminated", type: "date" }
    ];
  }

  ngOnInit() {
    super.ngOnInit();
    this.getSupervisorName = item => {
      return `${item.firstName} ${item.lastName}`;
    };
  }

  onCreateDepartment = text => {
    return this.onCreateItem(text, "department");
  };

  onCreateTeam = text => {
    return this.onCreateItem(text, "team");
  };

  onCreatePosition = text => {
    return this.onCreateItem(text, "position");
  };

  onCreateItem = (text: string, endpoint: string) => {
    const item = {
      name: text,
      code: text,
      description: text,
      companyId: this.authService.getLoggedAccount().companyId,
      tenantId: this.authService.appInfo.tenant.id
    };
    return this.http.create(`/api/v1/${endpoint}`, item).pipe(switchMap(i => of(i)));
  };
}
