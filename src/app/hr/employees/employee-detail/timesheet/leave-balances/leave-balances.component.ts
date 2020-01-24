import { Component, Input, OnInit, ViewChild, ElementRef } from "@angular/core";
import { HttpService } from "hordeflow-common";
import { HttpParams } from "@angular/common/http";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { tap } from "rxjs/operators";
import { DatagridCommand } from "hordeflowkit";

@Component({
  selector: "hrf-leave-balances",
  templateUrl: "leave-balances.component.html",
  styleUrls: ["leave-balances.component.scss"]
})
export class LeaveBalancesComponent implements OnInit {
  @Input() employee: any;
  balances: any[] = [];
  balanceToUpdate: any;
  updatingBalance: boolean;
  showUpdateConfirmation: boolean;
  commands: DatagridCommand[] = [
    {
      name: "btnAdd",
      text: "Add",
      icon: "airplane"
    }
  ];
  form: FormGroup;
  @ViewChild("input", { static: false }) input: ElementRef<any>;

  constructor(private http: HttpService, fb: FormBuilder) {
    this.form = fb.group({
      balance: [0, Validators.required]
    });
  }

  ngOnInit() {
    this.loadBalances();
  }

  loadBalances() {
    this.http
      .list(`api/v1/timemanagement/employee/${this.employee.id}/leavebalance/alltypes`)
      .subscribe(x => (this.balances = x));
  }

  toggleUpdatingBalance(balance) {
    this.balanceToUpdate = balance;
    this.form.patchValue({ balance: balance.balance });
    this.showUpdateConfirmation = true;
    this.input.nativeElement.focus();
  }

  updateBalance() {
    const params = new HttpParams()
      .set("requestTypeId", this.balanceToUpdate.requestTypeId)
      .set("balance", this.form.get("balance").value);
    this.http
      .process(`api/v1/timemanagement/employee/${this.employee.id}/leavebalance/update`, {}, params)
      .pipe(tap(e => (this.updatingBalance = true)))
      .subscribe(x => {
        this.loadBalances();
        this.updatingBalance = false;
        this.showUpdateConfirmation = false;
      });
  }
}
