import { Component, forwardRef } from "@angular/core";
import { Validators, FormControl, FormBuilder, FormGroup } from "@angular/forms";
import * as _ from "lodash";
import { of } from "rxjs";
import { HttpService } from "projects/hordeflow-common/src/public_api";
import { SmartAuthService } from "src/app/authentication/services/smart-auth.service";
import { HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";
import {
  DatagridEditorAccountService,
  DatagridEditor,
  DatagridViewPageEditorService
} from "hordeflowkit";

export class FormValidators {
  static emailValidator(fc: FormControl) {
    // RFC 2822 compliant regex
    if (
      fc.value.match(
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
      )
    ) {
      return null;
    } else {
      return { invalidEmailAddress: true };
    }
  }

  static creditCardValidator(fc: FormControl) {
    // Visa, MasterCard, American Express, Diners Club, Discover, JCB
    if (
      fc.value.match(
        /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/
      )
    ) {
      return null;
    } else {
      return { invalidCreditCard: true };
    }
  }

  static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    const config = {
      required: "Required",
      invalidCreditCard: "Invalid credit card number.",
      invalidEmailAddress: "Invalid email address.",
      invalidPassword:
        "Invalid password. Password must be at least 6 characters long, and contain a number.",
      minlength: `Minimum length ${validatorValue.requiredLength}`
    };

    return config[validatorName];
  }

  static passwordValidator(fc: FormControl) {
    // {6,100}           - Assert password is between 6 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    if (fc.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
      return null;
    } else {
      return { invalidPassword: true };
    }
  }
}

@Component({
  selector: "app-user-form",
  templateUrl: "./user.form.component.html",
  styleUrls: ["./user.form.component.scss"],
  providers: [
    {
      provide: DatagridEditorAccountService,
      useExisting: forwardRef(() => SmartAuthService)
    },
    {
      provide: DatagridEditor,
      useExisting: forwardRef(() => UserFormComponent)
    }
  ]
})
export class UserFormComponent extends DatagridEditor {
  claims: any[];
  addingClaim: boolean;
  claimsForm: FormGroup;

  claimTypes = [
    {
      name: "Company",
      type: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/company"
    },
    {
      name: "Permission",
      type: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/permission"
    },
    {
      name: "Role",
      type: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role"
    },
    {
      name: "Tenant",
      type: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/tenant"
    }
  ];

  buildFormControls() {
    // Username uses async just to show how to use async validators.
    return {
      userName: [null, Validators.required],
      email: [null, Validators.required, c => of(FormValidators.emailValidator(c))],
      password: [null, Validators.required],
      phoneNumber: null,
      mobileNumber: null,
      lockoutEnd: null,
      recoveryEmail: null,
      lockoutEnabled: false,
      isSystemAdministrator: false,
      twoFactorEnabled: false
    };
  }

  constructor(
    fb: FormBuilder,
    datagridService: DatagridViewPageEditorService,
    authService: SmartAuthService,
    private http: HttpService
  ) {
    super(fb, datagridService, authService);
    this.claimsForm = fb.group({
      type: ["", Validators.required],
      value: ["", Validators.required],
      issuer: "LOCAL AUTHORITY"
    });
  }

  onRecordFetched(record) {
    const params: HttpParams = new HttpParams().set("id", record.id);
    this.http.getValue<any>(`api/v1/auth/account/getclaims`, params).subscribe(x => {
      this.claims = x;
      _.map(this.claims, c => {
        const index = _.get(c, "type").lastIndexOf("/");
        _.set(c, "type", _.get(c, "type").slice(index + 1));
      });
    });

    this.dataGridService.editorState.payload = this.transformFormValues();
  }

  transformFormValues() {
    _.set(this.record, "passwordHash", this.record.passwordHash);
    return this.record;
  }

  addClaim() {
    if (this.claimsForm.valid) {
      const claim = _.merge(this.claimsForm.value, {
        issuer: "LOCAL AUTHORITY"
      });
      this.claims.push(claim);
      this.addingClaim = false;
    }
  }

  newClaim() {
    this.addingClaim = true;
    this.claimsForm.reset();
  }
}
