import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "ellipsis"
})
export class EllipsisPipe implements PipeTransform {
    transform(value: string, length: number): string {
        if (!value || value.length <= length) return value;
        return `${value.substring(0, length - 3)}...`;
    }
}
