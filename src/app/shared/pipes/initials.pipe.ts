import { Pipe, PipeTransform } from "@angular/core";
import * as _ from "lodash";

@Pipe({
    name: "initials"
})
export class InitialsPipe implements PipeTransform {
    transform(value: string, appendDot: boolean = true): string {
        let initials = _.first(value);
        if (!_.isUndefined(initials) && !_.isNull(initials) && initials !== "")
            return initials.toLocaleUpperCase() + (appendDot ? "." : "");
        return "";
    }
}
