import {
    Component,
    Input,
    Output,
    EventEmitter,
    Renderer2,
    ElementRef,
    OnChanges,
    SimpleChange,
    Inject
} from "@angular/core";
import { Source } from "./sources/source";
import { AsyncSource } from "./sources/async-source";
import { SourceFactory } from "./sources/source.factory";
import { HfAvatarService } from "./avatar.service";

/**
 * Universal avatar component that
 * generates avatar from different sources
 *
 *  <hf-avatar facebookId="1508319875"></hf-avatar>
    <hf-avatar googleId="1508319875"></hf-avatar>
    <hf-avatar twitterId="1508319875"></hf-avatar>
    <hf-avatar skypeId="1508319875"></hf-avatar>
    <hf-avatar gravatarId="adde9b2b981a8083cf084c63ad86f753"></hf-avatar>
    <hf-avatar gravatarId="user@gmail.com"></hf-avatar>
    <hf-avatar src="assets/avatar.jpg"></hf-avatar>
    <hf-avatar name="John Doe"></hf-avatar>
    <hf-avatar value="75%"></hf-avatar>

    <hf-avatar facebookId="userFacebookID" skypeId="userSkypeID"
    googleId="google" name="Haithem Mosbahi" src="assets/avatar.jpg"
    value="28%"  twitterId="twitter"
    gravatarId="adde9b2b981a8083cf084c63ad86f753" 
    size="100" [round]="true">
    </hf-avatar>
 */

@Component({
    selector: "hf-avatar",
    templateUrl: "./avatar.html"
})
export class HfAvatar implements OnChanges {
    @Input() round: boolean = true;
    @Input() size: number = 50;
    @Input() textSizeRatio: number = 3;
    @Input() bgColor: string;
    @Input() fgColor: string = "#FFF";
    @Input() borderColor: string;
    @Input() style: any = {};
    @Input() cornerRadius: number = 0;
    @Input("facebookId") facebook: string;
    @Input("twitterId") twitter: string;
    @Input("googleId") google: string;
    @Input("vkontakteId") vkontakte: string;
    @Input("skypeId") skype: string;
    @Input("gravatarId") gravatar: string;
    @Input("githubId") github: string;
    @Input("src") custom: string;
    @Input("name") initials: string;
    @Input("value") value: string;
    @Input("placeholder") placeholder: string;
    @Input("initialsSize") initialsSize: number;
    @Output() clickOnAvatar: EventEmitter<any> = new EventEmitter<any>();

    _currentSource: number = 0;
    _sources: Source[] = Array();
    // avatar img src
    src: string;
    // avatar text value
    data: string;

    avatarStyle: any = {};
    hostStyle: any = {};

    constructor(
        public renderer: Renderer2,
        public elementRef: ElementRef,
        public sourceFactory: SourceFactory,
        private avatarService: HfAvatarService
    ) {
        // listen to click events on the root element
        this.renderer.listen(this.elementRef.nativeElement, "click", event => {
            this.clickOnAvatar.emit(this._sources[this._currentSource - 1]);
        });
    }

    /**
     * Detect inputs change
     *
     * @param changes
     */
    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        for (let propName in changes) {
            if (this.avatarService.isSource(propName)) {
                let currentValue = changes[propName].currentValue;
                this._addSource(propName, currentValue);
            }
        }
        // reintialize the avatar component when a source property value has changed
        // the fallback system must be re-invoked with the new values.
        this._initializeAvatar();
    }

    /**
     * Initialize the avatar component and its fallback system
     */
    _initializeAvatar() {
        this._currentSource = 0;
        if (this._sources.length > 0 && this._sources[this._currentSource]) {
            // Order sources array by source priority
            // this._sources.sort((leftSide, rightSide) => {
            //     return (
            //         this.avatarService.getSourcePriority(leftSide.sourceId) -
            //         this.avatarService.getSourcePriority(rightSide.sourceId)
            //     );
            // });
            this._sources.sort((leftSide: Source, rightSide: Source) => {
                return (
                    this.avatarService.getSourcePriority(leftSide.sourceType) -
                    this.avatarService.getSourcePriority(rightSide.sourceType)
                );
            });
            // Host style
            this.hostStyle = {
                width: this.size + "px",
                height: this.size + "px"
            };
            // Fetch avatar source
            this.fetch();
        }
    }

    /**
     * Fetch avatar source
     * @param event
     */
    fetch(event?: any) {
        let avatarSource = this._sources[this._currentSource];
        if (!avatarSource) {
            return false;
        }
        if (this.avatarService.isTextAvatar(avatarSource.sourceType)) {
            this.data = avatarSource.getAvatar(this.initialsSize);
            this.src = undefined;
            this.avatarStyle = this._initialsStyle(avatarSource.sourceId);
        } else {
            this.avatarStyle = this._imageStyle();
            if (avatarSource instanceof AsyncSource) {
                this._fetchAsyncAvatar(avatarSource);
            } else {
                this.src = avatarSource.getAvatar(this.size);
            }
        }
        this._currentSource++;
    }

    _initialsStyle(avatarValue: string) {
        return {
            textAlign: "center",
            borderRadius: this.round ? "100%" : this.cornerRadius + "px",
            border: this.borderColor ? "1px solid " + this.borderColor : "",
            textTransform: "uppercase",
            color: this.fgColor,
            backgroundColor: this.bgColor
                ? this.bgColor
                : this.avatarService.getRandomColor(avatarValue),
            font:
                Math.floor(this.size / this.textSizeRatio) +
                "px Helvetica, Arial, sans-serif",
            lineHeight: this.size + "px",
            ...this.style
        };
    }

    _imageStyle() {
        return {
            maxWidth: "100%",
            borderRadius: this.round ? "50%" : this.cornerRadius + "px",
            border: this.borderColor ? "1px solid " + this.borderColor : "",
            width: this.size,
            height: this.size,
            ...this.style
        };
    }
    /**
     * Fetch avatar image asynchrounsly.
     * @param source represents avatar source
     */
    _fetchAsyncAvatar(source: AsyncSource) {
        this.avatarService.fetchAvatar(source.getAvatar()).subscribe(
            data => {
                // extract avatar image from the response data
                this.src = source.processResponse(data, this.size);
            },
            err => {
                console.error(
                    `hf-avatar: error while fetching ${
                        source.sourceType
                    } avatar `
                );
            }
        );
    }

    /**
     * Add avatar source
     *
     * @param sourceType avatar source type e.g facebook,twitter, etc.
     * @param sourceValue  source value e.g facebookId value, etc.
     */
    _addSource(sourceType: string, sourceValue: string) {
        if (sourceValue) {
            if (!this._updateExistingSource(sourceType, sourceValue)) {
                this._sources.push(
                    this.sourceFactory.newInstance(sourceType, sourceValue)
                );
            }
        }
    }
    /**
     * This method check wether an avatar source has been added. If so
     * the source value will be updated with the new value passed as
     * paramater.
     * It returns true if the source exists and update has been performed,
     * returns false if the source was not found
     *
     * @param sourceType the type of the source
     * @param sourceValue the new value of the source
     */
    _updateExistingSource(sourceType: string, sourceValue: string) {
        let sourceIndex = this._sources.findIndex(
            source => source.sourceType === sourceType.toUpperCase()
        );
        if (sourceIndex > -1) {
            this._sources[sourceIndex].sourceId = sourceValue;
            return true;
        }
        return false;
    }
}
