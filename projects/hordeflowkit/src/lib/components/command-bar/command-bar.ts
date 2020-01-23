import {
	Component,
	OnInit,
	Input,
	NgZone,
	ViewChildren,
	ViewChild,
	ElementRef,
	QueryList,
	AfterViewInit,
	HostListener,
	Output,
	EventEmitter
} from "@angular/core";
import { HfCommandBarItem } from "./command-bar-item";
import * as _ from "lodash";
import { ResizedEvent } from "./resized-event";

@Component({
	selector: "hf-command-bar",
	templateUrl: "./command-bar.html"
})
export class HfCommandBar implements OnInit, AfterViewInit {
	@Input() compact: boolean = false;
	@Input() iconOnly: boolean = false;
	@ViewChild("commandBar", { static: true }) commandBar: ElementRef<any>;
	@ViewChildren(HfCommandBarItem) commandBarItems!: QueryList<HfCommandBarItem>;
	@Input() showSearchBar = true;
	@Input() focusOnSearchBox = true;
	_items: any[] = [];

	@Input() set items(value: any[]) {
		this.measureItems(true);
		this._items = value;
	}

	get items(): any[] {
		return this._items;
	}

	@Output() sizechanged: EventEmitter<any> = new EventEmitter<any>();
	@Output() searchkeywordchanged: EventEmitter<any> = new EventEmitter<any>();

	overflowItems: any[] = [];
	primaryItems: any[] = [];
	itemCache: { key: string; width: number; height: number }[] = [];
	needsRecompute = false;
	visibleWidth: number;
	parentWidth: number;
	resizeDirection: "growing" | "shrinking";

	constructor(private zone: NgZone) {
		this.items = this.items || [];
	}

	onSearchKeyChanged(e) {
		this.searchkeywordchanged.emit(e);
	}

	recompute(resizeWidth) {
		const width = resizeWidth - (this.showSearchBar ? 200 : 0);
		const OVERFLOW_WIDTH: number = 32;

		const totalItemsWidth =
			_.reduce(this.itemCache, (value, next) => value + next.width, 0) + OVERFLOW_WIDTH;

		if (this.parentWidth < width) {
			this.resizeDirection = "growing";
		} else {
			this.resizeDirection = "shrinking";
		}

		this.parentWidth = width;
		const limit = width;
		const adjustment = totalItemsWidth - limit;
		let itemsToDisplay: any[] = [];
		let newWidth = 0;
		let breakpoint = this.itemCache.length;
		for (let i = 0; i < this.itemCache.length; i++) {
			newWidth += this.itemCache[i].width;
			breakpoint--;
			if (newWidth > adjustment) break;
		}
		this.overflowItems = _.takeRight(this.items, this.items.length - 1 - breakpoint);
		this.needsRecompute = this.overflowItems.length > 0;
		itemsToDisplay = _.slice(this.items, 0, breakpoint + 1);
		let newCache = _.filter<{
			key: string;
			width: number;
			height: number;
		}>(this.itemCache, c => _.find(itemsToDisplay, d => d.name === c.key));
		this.visibleWidth =
			_.reduce(newCache, (value, next) => value + next.width, 0) + OVERFLOW_WIDTH;

		if (this.visibleWidth > this.parentWidth) {
			itemsToDisplay = _.slice(itemsToDisplay, 0, itemsToDisplay.length - 1);
			newCache = _.filter<{
				key: string;
				width: number;
				height: number;
			}>(this.itemCache, c => _.find(itemsToDisplay, d => d.name === c.key));
			this.visibleWidth = _.reduce(newCache, (value, next) => value + next.width, 0);
			this.needsRecompute = true;
			this.overflowItems = _.takeRight(this.items, this.items.length - breakpoint);
		}
		this.primaryItems = itemsToDisplay;
	}

	onResized(event: ResizedEvent) {
		setTimeout(() => {
			this.recompute(event.newWidth);
			this.sizechanged.emit(event);
		});
	}

	ngOnInit() {
		this.primaryItems = this.items;
	}

	ngAfterViewInit() {
		this.measureItems();
	}

	measureItems(clear?: boolean) {
		const items = this.commandBarItems;
		if (!items) return;
		if (clear) this.itemCache = [];
		_.each(this.commandBarItems.toArray(), item => {
			const name = item.getName();
			const el = item.getElement();
			if (!_.find(this.itemCache, { key: name })) {
				const rect = el.getBoundingClientRect();
				this.itemCache.push({
					key: name,
					width: rect.width,
					height: rect.height
				});
			}
		});
	}
}
