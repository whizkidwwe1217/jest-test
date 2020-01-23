import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CamelizePipe } from "./pipes/camelize.pipe";
import { EllipsisPipe } from "./pipes/ellipsis.pipe";
import { InflectorPipe } from "./pipes/inflector.pipe";
import { PersonPipe } from "./pipes/person.pipe";
import { InitialsPipe } from "./pipes/initials.pipe";
import { NaturalType } from "./pipes/natural-type.pipe";
import { SafeHtmlPipe } from "./pipes/safe-html.pipe";
import { TimeAgoPipe } from "./pipes/time-ago.pipe";

const pipes = [
	CamelizePipe,
	EllipsisPipe,
	InflectorPipe,
	PersonPipe,
	InitialsPipe,
	NaturalType,
	SafeHtmlPipe,
	TimeAgoPipe
];
@NgModule({
	imports: [CommonModule],
	declarations: [...pipes],
	exports: [...pipes]
})
export class HordeflowCommonModule {}
