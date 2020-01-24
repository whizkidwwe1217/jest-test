import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { HttpService, DataSource, DataWebApiDataSource, UriResource } from "hordeflow-common";
import * as _ from "lodash";
import { PageFormService } from "src/app/shared/services/page-form.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "hrf-skills",
  templateUrl: "skills.component.html",
  styles: [
    `
      label {
        border-radius: 2px;
      }
    `
  ],
  providers: [
    {
      provide: DataSource,
      useClass: DataWebApiDataSource,
      deps: [HttpService]
    }
  ]
})
export class SkillsComponent implements OnInit {
  skills: any[];
  inputValue: string;
  @Input() employeeId: number;

  constructor(
    private http: HttpService,
    public dataSource: DataSource<any>,
    private formService: PageFormService<any>
  ) {}

  ngOnInit() {
    const resource: UriResource = new UriResource().setUrl(
      `api/v1/organization/employee/${this.employeeId}/skill`
    );
    (this.dataSource as DataWebApiDataSource<any>).setResource(resource, null);
    this.loadSkills();
  }

  onSkillEntered(e: KeyboardEvent) {
    if (e.code === "Enter" && _.trim(this.inputValue)) {
      const newSkill = { skill: this.inputValue };
      this.skills.push(newSkill);
      this.inputValue = null;
      this.formService
        .build(
          {
            skill: [null, Validators.required],
            employeeId: this.employeeId
          },
          this.dataSource,
          newSkill
        )
        .subscribe(x => {
          const rec = x.form.value;
          delete rec.id;
          this.dataSource.create(rec).subscribe();
        });
    }
  }

  removeSkill(skill) {
    this.dataSource.destroy(skill.id).subscribe(x => {
      _.remove(this.skills, e => e.id === skill.id);
    });
  }

  private loadSkills() {
    this.http.list(this.dataSource.getResource().url).subscribe(x => (this.skills = x));
  }
}
