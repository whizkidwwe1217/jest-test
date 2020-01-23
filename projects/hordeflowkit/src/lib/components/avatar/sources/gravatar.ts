import { Source } from "./source";
// import isRetina from "is-retina";
// import { Md5 } from "ts-md5/dist/md5";

/**
 *  Gravatar source impelementation.
 *  Fetch avatar source based on gravatar email
 */
export class Gravatar implements Source {
    readonly sourceType: string = "GRAVATAR";
    public sourceId:string;

    constructor(public value: string) {
    //    this.sourceId= value.match('^[a-f0-9]{32}$') ? value : Md5.hashStr(value).toString();
        throw "Not implemented exception";
    }

    getAvatar(size:number): string {
        // const avatarSize = isRetina() ? size * 2 : size;
        // return `https://secure.gravatar.com/avatar/${this.sourceId}?s=${avatarSize}&d=404`;
        throw "Not implemented exception";
    }
}