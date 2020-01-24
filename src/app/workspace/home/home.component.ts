import { Component, OnInit, AfterViewInit } from "@angular/core";
import { PageService } from "./services/page.service";
import { ActivatedRoute } from "@angular/router";
import { Page } from "../../data/page";
import * as _ from "lodash";
import { fadeAnimation } from "src/app/shared/animations/fade-animation";
import { SystemUtils, TenantAuthService, JwtProvider, JwtClaims } from "hordeflow-common";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  animations: [fadeAnimation],
  host: {
    id: "main-container",
    "[class.content-container]": "true"
  }
})
export class HomeComponent implements OnInit, AfterViewInit {
  collapsible: boolean = true;
  collapsed: boolean = false;
  pages: Array<Page> = [];
  expanded = new Array(3).fill(false);

  constructor(
    private pageService: PageService,
    private activatedRoute: ActivatedRoute,
    private accountService: TenantAuthService
  ) {}

  ngOnInit() {
    // this.pageService.getPages().then(p => {
    // 	this.pages = p;
    // 	this.expanded = new Array(this.pages.length);
    // });
    const authToken = this.accountService.getAuthorizationToken();
    const jwt = new JwtProvider();
    const token = jwt.decodeToken(authToken.accessToken);
    const name = `${token.payload[JwtClaims.GivenName]} ${token.payload[JwtClaims.Surname]}`;
    console.log(token, name);
    const modules = [
      "Getting Started",
      "Organization",
      "Time Management",
      "Payroll",
      "Administration",
      "Settings"
    ];
    this.pageService
      .getPages()
      .pipe(filter(page => modules.includes(page.name) && this.hasPermission(page, token.payload)))
      .subscribe(page => this.pages.push(page));
  }

  hasPermission(page: Page, claims: any): boolean {
    if (_.isEmpty(page.permission)) return true;

    const permissions = claims[JwtClaims.Permission] as string[];
    if (permissions) return permissions.indexOf(page.permission) !== -1;
    return false;
  }

  ngAfterViewInit(): void {}

  public getState(outlet) {
    //return outlet.activatedRouteData["depth"];
    return outlet.activatedRoute.component.name; // SystemUtils.guid();
  }

  toggle(open: boolean, group: number) {
    if (open) {
      // Collapse everything then open the one we want
      this.expanded = new Array(this.pages.length).fill(false);
      this.expanded[group] = true;
    } else {
      this.expanded[group] = false;
    }
  }
}
