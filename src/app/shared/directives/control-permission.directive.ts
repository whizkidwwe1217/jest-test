import { Directive, ElementRef, OnInit, Input } from "@angular/core";
import { TenantAuthService, JwtClaims, JwtProvider } from "hordeflow-common";

@Directive({
  selector: "[hfPermission]"
})
export class ControlPermissionDirective implements OnInit {
  @Input("hfPermission") hfPermission: string;

  constructor(private el: ElementRef, private accountService: TenantAuthService) {}

  ngOnInit() {
    const authToken = this.accountService.getAuthorizationToken();
    const jwt = new JwtProvider();
    const token = jwt.decodeToken(authToken.accessToken);
    const role = token.payload[JwtClaims.Role];

    if (this.hfPermission) {
      const hasPermission = this.hasPermission(token.payload) || role === "SuperUser";
      console.log(this.hfPermission, hasPermission);
      if (!hasPermission) {
        this.el.nativeElement.style.display = "none";
      }
    }
  }

  private hasPermission(claims: any): boolean {
    const permissions = claims[JwtClaims.Permission] as string[];
    if (permissions) return permissions.indexOf(this.hfPermission) !== -1;
    return false;
  }
}
