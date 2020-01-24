import { Component, Input } from "@angular/core";
import { HttpParams } from "@angular/common/http";
import { HttpService, DataWebApiDataSource, UriResource } from "hordeflow-common";
import * as _ from "lodash";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { SmartAuthService } from "src/app/authentication/services/smart-auth.service";
import { finalize, switchMap } from "rxjs/operators";
import { throwError, of } from "rxjs";
import { PageFormService } from "src/app/shared/services/page-form.service";

@Component({
  selector: "hrf-emp-personal-info",
  templateUrl: "employee-personal-info.component.html",
  styleUrls: ["employee-personal-info.component.scss"]
})
export class EmployeePersonalInfoComponent {
  _employee: any;
  contacts: any[] = [];
  educations: any[] = [];
  accContactsExpanded: boolean = false;
  accPersonalDetailsExpanded: boolean = true;
  accEducationExpanded: boolean = false;
  emergencyContactForm: FormGroup;
  educationForm: FormGroup;
  contactDialogOpen: boolean;
  educationDialogOpen: boolean;
  isFormEditing: boolean;

  @Input() set employee(employee) {
    this._employee = employee;
    if (!_.isEmpty(this._employee)) {
      this.fetchEducations();
      this.fetchEmergencyContacts();
    }
  }

  get employee() {
    return this._employee;
  }

  constructor(
    private service: HttpService,
    private fb: FormBuilder,
    private auth: SmartAuthService,
    private formService: PageFormService<any>
  ) {
    this.educationForm = fb.group(this.getEducationFormControls());
    this.emergencyContactForm = fb.group(this.getEmergencyContactFormControls());
  }

  getEducationFormControls() {
    return {
      institution: [null, Validators.required],
      degree: [null, Validators.required],
      yearGraduated: [null, Validators.required],
      levelAttained: null,
      gradePointAverage: 0,
      companyId: this.auth.getLoggedAccount().companyId,
      tenantId: this.auth.appInfo.tenant.id,
      address: null
    };
  }

  getEmergencyContactFormControls() {
    return {
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      birthDate: new Date(),
      phoneNumber: [null, Validators.required],
      gender: "Unspecified",
      companyId: this.auth.getLoggedAccount().companyId,
      tenantId: this.auth.appInfo.tenant.id,
      emailAddress: null,
      relationship: [null, Validators.required]
    };
  }

  fetchEmergencyContacts() {
    const params = new HttpParams().set("employeeId", _.toString(this.employee.id));
    this.service
      .search(
        "/api/v1/organization/employee/searchemergencycontacts",
        {
          currentPage: 1,
          fields:
            "firstName,lastName,emailAddress,phoneNumber,relationship,id,concurrencyStamp,concurrencyTimeStamp,companyId,tenantId,employeeId",
          filter: "",
          pageSize: 50,
          sort: ""
        },
        true,
        params
      )
      .subscribe(r => (this.contacts = r.data));
  }

  acceptEmergencyContact = () => {
    const contact = this.emergencyContactForm.value;
    const params = new HttpParams().set("employeeId", this.employee.id);

    if (this.emergencyContactForm.valid) {
      if (contact.id) {
        contact.employeeId = this.employee.id;
        return this.service
          .update("api/v1/organization/employee/updateemergencycontact", contact.id, contact)
          .pipe(
            finalize(() => {
              this.fetchEmergencyContacts();
              this.isFormEditing = false;
            })
          );
      } else {
        delete contact.id;
        contact.companyId = this.auth.getLoggedAccount().companyId;
        contact.tenantId = this.auth.appInfo.tenant.id;
        return this.service
          .create("api/v1/organization/employee/addemergencycontact", contact, params)
          .pipe(
            finalize(() => {
              this.fetchEmergencyContacts();
              this.isFormEditing = false;
            })
          );
      }
    }

    return throwError("Invalid");
  };

  editEmergencyContact(contact) {
    this.contactDialogOpen = true;
    this.isFormEditing = true;
    const ds = new DataWebApiDataSource<any>(this.service).setResource(
      new UriResource().setUrl("api/v1/organization/employee/getemergencycontact", true)
    );
    this.formService.build(this.getEmergencyContactFormControls(), ds, contact).subscribe(
      page => (this.emergencyContactForm = page.form),
      response => console.log(response)
    );
  }

  deleteEmergencyContact(contact) {
    this.service
      .delete("api/v1/organization/employee/deleteemergencycontact", contact.id)
      .subscribe(x => this.fetchEmergencyContacts());
  }

  onEmergencyContactOpenChange(isOpen) {
    this.formService.build(this.getEmergencyContactFormControls()).subscribe(
      page => (this.emergencyContactForm = page.form),
      response => console.log(response)
    );
  }

  fetchEducations() {
    const params = new HttpParams().set("employeeId", _.toString(this.employee.id));
    this.service
      .search(
        "/api/v1/organization/employee/searcheducations",
        {
          currentPage: 1,
          fields:
            "institution,degree,yearGraduated,gradePointAverage,address,levelAttained,id,concurrencyStamp,concurrencyTimeStamp,companyId,tenantId,employeeId",
          filter: "",
          pageSize: 50,
          sort: ""
        },
        true,
        params
      )
      .subscribe(r => (this.educations = r.data));
  }

  onEducationOpenChange(isOpen) {
    this.formService.build(this.getEducationFormControls()).subscribe(
      page => (this.educationForm = page.form),
      response => console.log(response)
    );
  }

  acceptEducation = () => {
    return of({}).pipe(
      switchMap(() => {
        const education = this.educationForm.value;
        const params = new HttpParams().set("employeeId", this.employee.id);

        if (this.educationForm.valid) {
          if (education.id) {
            education.employeeId = this.employee.id;
            return this.service
              .update("api/v1/organization/employee/updateeducation", education.id, education)
              .pipe(
                finalize(() => {
                  this.fetchEducations();
                  this.isFormEditing = false;
                })
              );
          } else {
            delete education.id;
            education.companyId = this.auth.getLoggedAccount().companyId;
            education.tenantId = this.auth.appInfo.tenant.id;
            return this.service
              .create("api/v1/organization/employee/addeducation", education, params)
              .pipe(
                finalize(() => {
                  this.fetchEducations();
                  this.isFormEditing = false;
                })
              );
          }
        }
        return throwError({
          title: "The form is invalid.",
          message: "The form has invalid values."
        });
      })
    );
  };

  editEducation(education) {
    this.educationDialogOpen = true;
    this.isFormEditing = true;
    const ds = new DataWebApiDataSource<any>(this.service).setResource(
      new UriResource().setUrl("api/v1/organization/employee/geteducation", true)
    );
    this.formService.build(this.getEducationFormControls(), ds, education).subscribe(
      page => (this.educationForm = page.form),
      response => console.log(response)
    );
  }

  deleteEducation(education) {
    this.service
      .delete("api/v1/organization/employee/deleteeducation", education.id)
      .subscribe(x => this.fetchEducations());
  }
}
