import { Component, OnInit, OnDestroy } from "@angular/core";
import { Location } from "@angular/common";

import { ActivatedRoute, Params, Router } from "@angular/router";
import { switchMap } from "rxjs/operators";
import { HttpParams, HttpHeaders, HttpClient } from "@angular/common/http";

import { HttpService, DataSource, DataWebApiDataSource } from "hordeflow-common";
import { concat } from "lodash";
import { format, isSameDay, isSameMonth, isSameYear } from "date-fns";
import { convertToTimeZone, formatToTimeZone } from "date-fns-timezone";
import { FormBuilder } from "@angular/forms";

import { PageFormService } from "src/app/shared/services/page-form.service";
import { ClrNotificationService, DatagridViewPageEditorService } from "hordeflowkit";

@Component({
  selector: "hf-employee-detail",
  templateUrl: "./employee-detail.component.html",
  styleUrls: ["./employee-detail.component.scss"],
  providers: [
    ClrNotificationService,
    PageFormService,
    DatagridViewPageEditorService,
    {
      provide: DataSource,
      useClass: DataWebApiDataSource,
      deps: [HttpService]
    }
  ]
})
export class EmployeeDetailComponent implements OnInit, OnDestroy {
  employee: any = {};
  shifts: any[] = [];
  loading = false;
  photo: any;

  commands: any[] = [
    {
      name: "btnCreatePayroll",
      text: "Create Payroll",
      icon: "dollar-bill"
    },
    {
      name: "btnCheckIn",
      text: "Check In",
      icon: "clock"
    },
    {
      name: "btnCheckOut",
      text: "Check Out",
      icon: "clock"
    }
  ];
  timelog = {
    checkIn: null,
    checkOut: null
  };
  currentDayShift: null;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private service: HttpService,
    private notification: ClrNotificationService,
    private http: HttpClient
  ) {}

  checkIn(e) {
    this.timelog.checkIn = format(new Date(), "h:m a");
  }

  checkOut(e) {
    this.timelog.checkOut = format(new Date(), "h:m a");
  }

  onWorkShiftFetched(shift) {
    this.currentDayShift = shift.name;
  }

  timeZone: string = "";

  setTimeZone() {
    const tz = "Europe/Berlin";
    //"Europe/Berlin"
    const currentDate = new Date();
    const utcDate = convertToTimeZone(currentDate, { timeZone: tz });
    let dateFormat = "hh:mm a [GMT]Z (z)";
    if (!isSameDay(utcDate, currentDate)) {
      dateFormat = `ddd ${dateFormat}`;
    }

    this.timeZone = `${formatToTimeZone(currentDate, dateFormat, {
      timeZone: tz
    })} ${tz}`;
  }

  ngOnDestroy() {}

  ngOnInit() {
    this.loading = true;
    this.route.params
      .pipe(
        switchMap((params: Params) => {
          let p = new HttpParams().set("id", params["id"]);
          return this.service.getValue<any>("api/v1/organization/employee/profile", p);
        })
      )
      .subscribe(
        employee => {
          this.employee = employee;
          this.setTimeZone();
          this.loading = false;
        },
        () => (this.loading = false)
      );
  }

  onFileChanged(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    // it's onload event and you forgot (parameters)
    reader.onload = (e: any) => {
      // the result image data
      setTimeout(() => {
        this.photo = e.target.result;
      }, 10);
      this.uploadPhoto(file);
    };
    // you have to declare the file loading
    reader.readAsDataURL(file);
  }

  uploadPhoto(file) {
    const uploadData = new FormData();
    uploadData.append("file", file, file.name);
    const headers = new HttpHeaders().set("Accept", "application/json");
    //this.service
    //.process<any>("api/v1/organization/employee/uploadphoto", uploadData, null, headers)
    this.http
      .post("api/v1/organization/employee/uploadphoto", uploadData, { headers: headers })
      .subscribe(
        () => this.notifySuccess("Photo uploaded successfully."),
        () => this.notifyFailed("Error uploading photo.")
      );
  }

  notifySuccess(message): void {
    this.notification.openNotification(message, {
      progressbar: false,
      dismissable: true,
      notificationType: "success"
    });
  }

  notifyFailed(message): void {
    this.notification.openNotification(message, {
      progressbar: false,
      dismissable: true,
      notificationType: "danger",
      timeout: 5000
    });
  }

  onNavigateBack() {
    this.location.back();
  }
}
