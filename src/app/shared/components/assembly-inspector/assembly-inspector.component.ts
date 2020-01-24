import { Component, Input } from "@angular/core";

@Component({
    selector: "hf-assembly-inspector",
    template: `
        <section>
            <h4><clr-icon shape="plugin" size="18"></clr-icon> Loaded {{ title }}</h4>
            <br />
            <p *ngIf="assemblies.length === 0">No {{ tile }}</p>
            <clr-stack-view>
                <clr-stack-block [clrSbExpanded]="expanded" *ngFor="let a of assemblies">
                    <clr-stack-label>{{ a.name }}</clr-stack-label>
                    <clr-stack-content>{{ a.version }}</clr-stack-content>
                    <clr-stack-block *ngFor="let p of properties">
                        <clr-stack-label>{{ p | inflector: "titleize" }}</clr-stack-label>
                        <clr-stack-content>{{ a.fileVersionInfo[p] }}</clr-stack-content>
                    </clr-stack-block>
                </clr-stack-block>
            </clr-stack-view>
        </section>
    `
})
export class AssemblyInpsectorComponent {
    @Input()
    assemblies = [];
    @Input()
    expanded: boolean = false;
    @Input()
    title: string;
}
