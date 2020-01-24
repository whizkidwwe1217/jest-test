import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SmartAuthService } from "../authentication/services/smart-auth.service";
import { UserAccount } from "hordeflow-common";

@Component({
    selector: "app-admin",
    templateUrl: "./admin.component.html",
    styleUrls: ["./admin.component.scss"],
    host: {
        id: "main-container",
        "[class.content-container]": "true"
    }
})
export class AdminComponent implements OnInit {
    returnUrl: string;
    account: UserAccount;
    constructor(private router: Router, private app: SmartAuthService) {}

    ngOnInit() {
        this.returnUrl = this.router.url;
        this.account = this.app.getLoggedAccount();
    }

    login() {
        this.router.navigate(["/login"], {
            queryParams: { returnUrl: this.router.url }
        });
    }
}
