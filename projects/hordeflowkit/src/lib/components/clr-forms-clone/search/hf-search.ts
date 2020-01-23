/**
 * @author Wendell Wayne Estrada (c) 2018
 * @version 1.0.0
 */
import {
	Component,
	ContentChild,
	TemplateRef,
	Input,
	ElementRef,
	AfterViewInit,
	ViewChild,
	forwardRef,
	OnDestroy,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	HostBinding,
	Output,
	EventEmitter
} from "@angular/core";
import * as _ from "lodash";
import { fromEvent, Observable, Subscription, from, of } from "rxjs";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
import {
	debounceTime,
	pluck,
	filter,
	groupBy,
	flatMap,
	reduce,
	map,
	switchMap,
	tap,
	distinctUntilChanged,
	throttleTime
} from "rxjs/operators";
import { HfSearchService } from "./hf-search.service";
import {
	HtmlUtils,
	HttpService,
	NumberUtils,
	FilterGroup,
	Inflector,
	FilterRule,
	TextUtils,
	IDataSource,
	DataField,
	UriResource,
	DataWebApiDataSource,
	FilterManager
} from "hordeflow-common";
import { NgbPopover } from "../../popover/popover";

@Component({
	selector: "hf-search",
	templateUrl: "./hf-search.html",
	//   styleUrls: ["hf-search.scss"],
	changeDetection: ChangeDetectionStrategy.Default,
	providers: [
		HfSearchService,
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => HfSearch),
			multi: true
		}
	]
}) // extends HfWrappedFormControl<HfSearchContainer>
export class HfSearch implements AfterViewInit, ControlValueAccessor, OnDestroy {
	constructor(
		private cdr: ChangeDetectorRef,
		private http: HttpService,
		protected elementRef: ElementRef
	) {}

	@Input() getDisplayText: Function;
	@Input() valueField: string;
	@Input() selectionField: string;
	@Input() displayField: string;
	@Input() popoverTitle: string;
	@Input() placeholder = "Search...";
	@Input() multiselect = false;
	@Input() flexTags = false;
	@Input() hideItemOnSelect = false;
	@Input() enableGrouping = false;
	@Input() loopFocus = false;
	@Input() showArrowTip = true;
	@Input() groupField: string;
	@Input() enableClearButton = true;
	@Input() enableToolbar = false;
	@Input() removeItemPadding = false;
	@Input() disableBodyTrigger = false;
	@Input() enableLookup = false;
	@Input() enableCreatableItem = false;
	@Input() pickerPlacement: string[] = ["bottom-left", "auto"];
	@Input() dataSource: string | any[] | Observable<any> | IDataSource<any>;
	@Input() disabled: boolean = false;
	@Input() readonly: boolean = false;
	@Input() filters: DataField<any>[] = [];
	@Output() onselect: EventEmitter<any> = new EventEmitter<any>();
	@ViewChild("popover", { static: true }) popover: NgbPopover;
	@ViewChild("inputBox", { static: true }) inputBox: ElementRef<any>;
	@ContentChild(TemplateRef, { static: false }) template: TemplateRef<any>;
	@HostBinding("style.padding") padding = 0;

	_items: any[] | Observable<any>;

	selectedItems: any[] = [];
	visibleItems: any[] = [];
	selectedItem: any;
	hoveredTag: any;
	loading: boolean;
	filterValue: string = "";

	toggleEventSubscription: Subscription;
	filterEventSubscription: Subscription;
	navigationEventSubscription: Subscription;
	actionEventSubscription: Subscription;
	clearEventSubscription: Subscription;

	keydownEvent = fromEvent<KeyboardEvent>(this.elementRef.nativeElement, "keydown");
	keyupEvent = fromEvent<KeyboardEvent>(this.elementRef.nativeElement, "keyup");
	keypressEvent = fromEvent<KeyboardEvent>(this.elementRef.nativeElement, "keypress");

	commands = [
		{ name: "btnFilter", text: "Filter", icon: "filter" },
		{ name: "btnConfiguration", text: "Configure", icon: "cog" },
		{ name: "btnPrevious", text: "Configure", icon: "arrow left" },
		{ name: "btnNext", text: "Configure", icon: "arrow right" },
		{ name: "btnPaste", text: "Paste", icon: "paste" },
		{ name: "btnCopy", text: "Copy", icon: "copy" },
		{ name: "btnCut", text: "Cut", icon: "cut" },
		{ name: "btnNote", text: "Note", icon: "note" }
	];

	flattenedGroupedItems: any;
	focusedIndex = 0;
	selectedIndex = 0;
	groupedItemsLength = 0;
	suspendNavigation = false;
	defaultGroup = "No Group";
	allowNull: boolean;

	get items(): any[] | Observable<any> {
		return this._items;
	}

	set items(value: any[] | Observable<any>) {
		this._items = value;
		this.updateVisibleItems(true);
	}

	container: string = "body";
	get appendToBody(): boolean {
		return this.container === "body";
	}

	@Input() set appendToBody(append: boolean) {
		append ? (this.container = "body") : (this.container = null);
	}

	ngAfterViewInit() {
		this.registerEvents();
	}

	ngOnDestroy(): void {
		this.unregisterEvents();
	}

	registerEvents() {
		this.registerFilterEvents();
		this.registerToggleEvents();
		this.registerNavigationEvents();
		this.registerActionEvents();
	}

	unregisterEvents() {
		this.toggleEventSubscription.unsubscribe();
		this.filterEventSubscription.unsubscribe();
		this.navigationEventSubscription.unsubscribe();
		this.actionEventSubscription.unsubscribe();
		this.clearEventSubscription.unsubscribe();
	}

	registerActionEvents() {
		this.actionEventSubscription = this.keyupEvent
			.pipe(filter((e: KeyboardEvent) => e.code === "Backspace"))
			.subscribe((e: KeyboardEvent) => {
				const keyword = this.filterValue;

				if (this.isBlank(keyword)) {
					this.clearSelection();
					this.applyFilter(_.defaultTo(keyword, ""));
				} else {
					if (e.code === "Backspace") {
						this.removeTag(e);
						this.applyFilter(keyword);
					}
				}
			});
		this.clearEventSubscription = this.keyupEvent
			.pipe(filter((e: KeyboardEvent) => this.isValidFilterKey(e)))
			.subscribe(e => {
				// Detect empty filter and reload items to display
				if (this.isBlank(_.toString(_.get(e.target, "value")))) {
					this.visibleItems = _.isArray(this.items) ? this.items : [];
				}
				this.detectChanges();
			});
	}

	registerNavigationEvents() {
		this.navigationEventSubscription = this.keydownEvent
			.pipe(
				filter((e: KeyboardEvent) => {
					let valid = true;

					switch (e.code) {
						case "ArrowUp":
						case "ArrowDown":
						case "Escape":
							valid = true;
							break;
						default:
							valid = false;
							break;
					}
					return valid;
				})
			)
			.subscribe(e => {
				if (e.code === "Escape") {
					e.preventDefault();
					e.stopPropagation();
				} else {
					if (!this.suspendNavigation) {
						if (e.code === "ArrowUp") {
							this.navigateUp();
						} else {
							this.navigateDown();
						}

						this.updateHoveredItem();
						e.preventDefault();
						e.stopPropagation();
					}
					this.suspendNavigation = false;
				}
			});
	}

	registerToggleEvents() {
		this.toggleEventSubscription = this.keydownEvent
			.pipe(
				filter((e: KeyboardEvent) => {
					let valid = true;
					switch (e.code) {
						case "Enter":
						case "NumpadEnter":
						case "Tab":
						case "ArrowUp":
						case "ArrowDown":
						case "Escape":
							valid = true;
							break;
						default:
							valid = false;
							break;
					}
					return valid || this.isValidFilterKey(e);
				})
			)
			.subscribe(e => {
				if (e.code === "Tab" || e.code === "Escape") {
					this.popover.close();
				} else {
					if ((e.code === "Enter" || e.code === "NumpadEnter") && this.popover.isOpen()) {
						const item = this.getDisplayItemByIndex();
						this.selectItem(item, this.focusedIndex, item ? item.group : null);
						e.preventDefault();
						e.stopPropagation();
					} else {
						if (!this.popover.isOpen()) {
							this.toggle();
							this.updateHoveredItem();
							this.suspendNavigation = true;
						}
					}
				}
			});
	}

	registerFilterEvents() {
		const delayTime = this.isRemote() ? 200 : 0;
		this.filterEventSubscription = this.keypressEvent
			.pipe(
				filter((e: KeyboardEvent) => {
					return this.isValidFilterKey(e);
				}),
				debounceTime(delayTime),
				pluck("target", "value"),
				distinctUntilChanged()
			)
			.subscribe({
				next: (result: string) => {
					const keyword = _.toLower(result).trim();
					this.filterOnKeys(keyword);

					if (this.showCreatableItem() && this.hasNoVisibleItems()) {
						this.navigateDown();
					}
				}
			});
	}

	removeTag(e: KeyboardEvent) {
		if (this.multiselect && !_.isEmpty(this.selectedItems)) {
			const item = _.last(this.selectedItems);
			const index = this.selectedItems.length - 1;
			this.deleteTag(e, item, index);
		}
	}

	isMatched(keyword: string, item: any) {
		const text = this.getText(item);
		if (!this.isBlank(text))
			return _.toString(text)
				.trim()
				.toLowerCase()
				.includes(
					_.toString(keyword)
						.toLowerCase()
						.trim()
				);
		return false;
	}

	isValidFilterKey(e: KeyboardEvent) {
		let valid = true;

		switch (e.code) {
			case "Enter":
			case "NumpadEnter":
			case "ControlLeft":
			case "ControlRight":
			case "Escape":
			case "Tab":
			case "ArrowUp":
			case "ArrowDown":
			case "ArrowLeft":
			case "ArrowRight":
			case "Control":
			case "AltLeft":
			case "AltRight":
			case "CapsLock":
			case "ShiftLeft":
			case "ShiftRight":
			case "Meta":
				valid = false;
				break;
			case "KeyA":
				if (e.ctrlKey) valid = false;
				break;
			default:
				valid = true;
				break;
		}

		return valid;
	}

	onBlur(e) {
		if (!this.showCreatableItem()) {
			if (!this.selectedItem) {
				this.filterValue = "";
			}
			this.propagateValue();
		}
	}

	navigateUp() {
		if (this.focusedIndex > 0) this.focusedIndex--;
		else {
			if (this.loopFocus) {
				this.focusedIndex = this.getDisplayItemsLength() - 1;
			}
		}
	}

	navigateDown() {
		if (this.focusedIndex < this.getDisplayItemsLength() - 1) this.focusedIndex++;
		else {
			if (this.loopFocus) {
				this.focusedIndex = 0;
			}
		}
	}

	isCreatableItemFocused() {
		return this.focusedIndex === this.getDisplayItemsLength() - 1;
	}

	isFocused(index, item, dataGroup) {
		return index === this.focusedIndex;
	}

	updateVisibleItems(refresh: boolean = false) {
		if (_.isArray(this.items)) {
			if (this.visibleItems.length > 0 && refresh) {
				this.visibleItems = [];
			}

			if (this.visibleItems.length === 0) {
				if (this.enableGrouping) {
					this.groupVisibleItems(this.items);
				} else {
					from(this.items).subscribe(item => this.visibleItems.push(item));
				}
			}
		}
	}

	getDisplayItemByIndex() {
		if (this.enableGrouping) {
			let counter = 0;
			for (let i = 0; i < this.visibleItems.length; i++) {
				const group = this.visibleItems[i];

				for (let j = 0; j < group.items.length; j++) {
					if (counter === this.focusedIndex) {
						const item = _.assign(group.items[j], {
							group: group ? group.group : this.defaultGroup
						});
						return item;
					}
					counter++;
				}
			}

			return null;
		}
		return this.visibleItems[this.focusedIndex];
	}

	createtableItemIncrement() {
		return this.showCreatableItem() ? 1 : 0;
	}

	getDisplayItemsLength() {
		return (
			(this.enableGrouping ? this.groupedItemsLength : this.visibleItems.length) +
			this.createtableItemIncrement()
		);
	}

	isBlankOrEmpty(value) {
		return _.isUndefined(value) || _.isNull(value) || _.isEmpty(value) || value === "";
	}

	isBlank(value) {
		return _.isUndefined(value) || _.isNull(value) || value === "";
	}

	getGroupedItems(source) {
		return from(source).pipe(
			groupBy(
				item =>
					this.isBlank(_.toString(_.get(item, this.groupField)))
						? this.defaultGroup
						: _.get(item, this.groupField),
				item => item
			),
			flatMap(group => group.pipe(reduce((acc, cur) => [...acc, cur], []))),
			map(arr => ({
				group: this.isBlank(_.toString(_.get(_.first(arr), this.groupField)))
					? this.defaultGroup
					: _.get(_.first(arr), this.groupField),
				items: arr
			}))
		);
	}

	groupVisibleItems(source) {
		this.getGroupedItems(source).subscribe(group => {
			this.visibleItems.push(group);
			this.calculateGroupedItemsLength();
		});
	}

	calculateGroupedItemsLength() {
		let counter = 0;
		_.each(this.visibleItems, g => _.each(g.items, () => counter++));
		this.groupedItemsLength = counter;
	}

	getFlattenedGroupItems(reinitialized: boolean = false) {
		if (this.enableGrouping) {
			if (reinitialized) this.flattenedGroupedItems = [];
			if (_.isEmpty(this.flattenedGroupedItems)) {
				this.flattenedGroupedItems = _.reduce(
					this.visibleItems,
					(prev, curr, index, []) => {
						const prevItems = _.map(prev.items, i =>
							_.assign(i, { group: prev.group })
						);
						const currItems = _.map(curr.items, i =>
							_.assign(i, { group: curr.group })
						);
						return [...prevItems, ...currItems];
					}
				);
			}
			return this.flattenedGroupedItems;
		}
		return [];
	}

	updateHoveredItem() {
		if (this.popover.isOpen()) {
			const popoverContent = this.popover.getWindowContentBody();
			if (popoverContent) {
				let ul;
				try {
					ul = popoverContent.querySelector("ul") as HTMLElement;
				} catch {
					ul = popoverContent.nextElementSibling.querySelector("ul") as HTMLElement;
				}

				if (!ul) {
					ul = popoverContent.nextElementSibling.querySelector("ul") as HTMLElement;
				}
				if (ul) {
					const focusedListItem = ul.children[this.focusedIndex];
					this.scrollToActive(focusedListItem, ul);
					this.detectChanges();
				}
			}
		}
	}

	scrollToActive(el, parent) {
		if (el) {
			const rect = HtmlUtils.visibleInScroll(parent, el, true);
			if (rect && !rect.isContained) {
				parent.scrollTop = el.offsetTop;
			}
		}
	}

	selectItem(item, index: number, group, toggle = true, focus = true) {
		if (this.showCreatableItem() && this.isCreatableItemFocused()) {
			this.createNewItem(item);
			return;
		}

		if (this.multiselect) {
			const idx = _.findIndex(this.selectedItems, i => {
				return this.getValueFromItem(i) === this.getValueFromItem(item);
			});
			if (idx === -1) {
				this.addItemToSelection(item);
				this.hideSelectedItem(item, group);
			} else {
				this.removeSelectedItemFromDisplay(item, idx, group);
			}
			this.calculateGroupedItemsLength();
		} else {
			this.selectedItem = item;
			this.onselect.emit(item);
			this.focusedIndex = index;
			this.filterValue = this.getSelectedItemText();
			if (item) this.items = [item];
			this.propagateValue();
			if (toggle) this.toggle();
		}
		// if (this.isRemote()) this.selectedIndex = 0;
		// else this.selectedIndex = index;
		if (focus) this.inputBox.nativeElement.focus();
		this.detectChanges();
	}

	detectChanges() {
		if (!this.cdr["destroyed"]) {
			this.cdr.detectChanges();
		}
	}

	addItemToSelection(item) {
		if (item) {
			if (this.enableGrouping) {
				this.selectedItems.push(item);
			} else {
				this.selectedItems.push(item);
			}
		}
	}

	hideSelectedItem(item, group) {
		if (this.hideItemOnSelect) {
			if (this.enableGrouping) {
				this.hideSelectedGroupedItem(item, group);
			} else {
				this.hideNonGroupedItem(this.visibleItems, item);
			}
		}
	}

	hideSelectedGroupedItem(item, group) {
		const groupIndex = _.findIndex(this.visibleItems, { group: group });
		if (groupIndex !== -1) {
			const groupItem = this.visibleItems[groupIndex];
			this.hideNonGroupedItem(groupItem.items, item);
			if (this.focusedIndex > 0) this.focusedIndex--;
		}
	}

	hideNonGroupedItem(source, item) {
		const indexToHide = _.findIndex(source, i => {
			return this.getValueFromItem(i) === this.getValueFromItem(item);
		});
		if (indexToHide !== -1) {
			source.splice(indexToHide, 1);
		}
	}

	toggle() {
		if (this.disabled) return;
		this.populateItems();
	}

	togglePopup(e: Event, trigger: "body" | "icon") {
		if (trigger === "icon" || !(trigger === "body" && this.disableBodyTrigger)) {
			this.toggle();
		}

		e.preventDefault();
		e.stopPropagation();
	}

	deleteTag(e: KeyboardEvent, item: any, index: number) {
		this.removeSelectedItemFromDisplay(item, index, null);
		this.clearFocusedIndexes();
		this.calculateGroupedItemsLength();
		e.stopPropagation();
		e.preventDefault();
	}

	getTagTitle(item) {
		const group = _.get(item, this.groupField);
		if (group) {
			return `${this.getText(item)} belongs to ${group}.`;
		}
		return this.getText(item);
	}

	getGroupText(group, items) {
		const count = items ? items.length : 0;
		return `${group} (${count})`;
	}

	onMouseOverBtnClose(e, item, index) {
		this.hoveredTag = index;
	}

	onMouseOutBtnClose(e, item, index) {
		this.hoveredTag = -1;
	}

	trackBy = (index, item) => {
		const value = this.getValueFromItem(item);
		return value ? value : index;
	};

	removeSelectedGroupedItemFromDisplay(item, index, group) {
		if (this.isBlank(group)) {
			group = _.get(item, this.groupField);

			if (this.isBlank(group)) {
				group = this.defaultGroup;
			}
		}

		const groupIndex = _.findIndex(this.visibleItems, { group: group });
		if (groupIndex !== -1) {
			// If hideItemOnSelect, put removed items back to the grouped display list.
			if (this.hideItemOnSelect) {
				const groupItem = this.visibleItems[groupIndex];
				groupItem.items.push(item);
			}

			this.selectedItems.splice(index, 1);
		}
	}

	removeSelectedNonGroupedItemFromDisplay(source, item, idx) {
		const index = idx
			? idx
			: _.findIndex(source, i => {
					return this.getValueFromItem(i) === this.getValueFromItem(item);
			  });
		if (index !== -1) {
			// If hideItemOnSelect, put removed items back to the display list.
			if (this.hideItemOnSelect) {
				this.visibleItems.push(source[index]);
			}
			source.splice(index, 1);
		}
	}

	removeSelectedItemFromDisplay(item, idx, group) {
		if (this.enableGrouping) {
			this.removeSelectedGroupedItemFromDisplay(item, idx, group);
		} else {
			this.removeSelectedNonGroupedItemFromDisplay(this.selectedItems, item, idx);
		}
		this.hoveredTag = -1;
	}

	isSelected(item, index) {
		return (
			_.findIndex(this.selectedItems, i => {
				return this.getValueFromItem(i) === this.getValueFromItem(item);
			}) !== -1
		);
	}

	hasNoVisibleItems(): boolean {
		if (this.loading) return false;
		if (this.enableGrouping) {
			return (
				_.filter(this.visibleItems, g => (g.items ? g.items.length : 0 > 0)).length === 0
			);
		}
		return this.visibleItems.length === 0;
	}

	isRemote(): boolean {
		return !_.isArray(this.dataSource);
	}

	hasSelection() {
		return !(this.multiselect
			? this.isBlankOrEmpty(this.selectedItems)
			: this.isBlank(this.selectedItem));
	}

	clearFocusedIndexes() {
		this.focusedIndex = 0;
		this.detectChanges();
	}

	getDefaultValue() {
		return this.allowNull ? null : undefined;
	}

	clearSelection() {
		this.selectedItems = [];
		this.selectedItem = this.getDefaultValue();
		this.focusedIndex = 0;
		this.updateVisibleItems(true);
		this.inputBox.nativeElement.focus();
		// this.inputBox.nativeElement.value = "";
		this.filterValue = "";
		this.propagateValue();
	}

	/*
	 * Clears selected item(s) when the X button is clicked.
	 */
	onClearSelection(e) {
		// Need to close popover to trigger toggleAndPopulate properly
		if (this.hasSelection()) {
			if (this.popover.isOpen()) this.popup();
		}
		this.clearSelection();
		this.toggle();
		e.stopPropagation();
		e.preventDefault();
	}

	// #region Control Value Accessor

	// Function to call when the input is touched (when a list item is clicked).
	onTouched = () => {};

	// tslint:disable-next-line: no-shadowed-variable
	onChange = (_: any) => {};

	getSelectedValue() {
		if (this.enableLookup) return this.getValueFromItem(this.selectedItem);
		return this.selectedItem;
	}

	propagateValue() {
		this.onChange(this.getSelectedValue());
		this.onTouched(); // Need to call onTouched, otherwise, form validation indicators will not work
	}

	// Allows Angular to register a function to call when the model (selectedItem) changes.
	// Save the function as a property to call later here.
	registerOnChange(fn: (selectedItem: number) => void): void {
		this.onChange = fn;
	}

	// Allows Angular to register a function to call when the input has been touched.
	// Save the function as a property to call later here.
	registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	//   // ALlows angular to disable the input
	//   setDisabledState?(isDisabled: boolean): void {
	//     this.disabled = isDisabled;
	//   }

	// Allows Angular to update the model (selectedItem).
	// Update the model and changes needed for the view here.
	writeValue(value: any): void {
		if (this.multiselect === false) {
			this.bindValue(value);
		}
	}

	bindValue(value) {
		if (!this.isBlank(value)) {
			this.loading = true;
			this.detectChanges();

			const ds = this.getFilter(value, this.enableLookup);
			ds.subscribe(
				x => {
					this.items = x;
					const item = this.getItemFromValue(value);
					this.selectItem(item.value, item.index, null, false, false);
					this.onChange(this.getSelectedValue());
				},
				() => {},
				() => {
					this.loading = false;
					this.detectChanges();
				}
			);
		} else if (_.isNull(value)) {
			this.selectItem(null, -1, null, false, false);
			this.onChange(this.getSelectedValue());
		}
	}

	popup() {
		if (this.popover.isOpen()) {
			this.popover.close();
		} else {
			this.popover.open();
		}
	}

	populateItems() {
		const ds: Observable<any> = this.getFilter(
			this.hasSelection() ? this.getSelectedValue() : this.getSelectedItemText(),
			true
		);

		const $pop = of(this.popover.isOpen());

		$pop.pipe(
			tap(e => {
				this.loading = !e;
				this.popup();
			}),
			switchMap(open => {
				if (open) return [];
				return ds;
			})
		).subscribe(
			x => (this.items = x),
			() => {},
			() => {
				this.loading = false;
				this.detectChanges();
				// popup();
				this.inputBox.nativeElement.focus();
				if (!this.hasSelection()) this.clearFocusedIndexes();
				else {
					this.focusedIndex = NumberUtils.max(this.selectedIndex, 0);
					setTimeout(() => {
						this.updateHoveredItem();
					}, 1);
				}
			}
		);
	}

	filterOnKeys(filterValue: string) {
		this.getFilter(filterValue).subscribe({
			next: data => {
				this.items = data;
				this.updateVisibleItems();
				this.focusedIndex = 0;
				setTimeout(() => {
					this.updateHoveredItem();
				}, 1);
			}
		});
	}

	applyFilter(filterValue: string, lookup: boolean = false) {
		this.getFilter(filterValue, lookup).subscribe({
			next: data => {
				this.items = data;
				this.updateVisibleItems();
			}
		});
	}

	getFilter(filterValue: string, lookup: boolean = false): Observable<any> {
		if (this.isBlank(filterValue)) return this.getDataSource();
		return of(this.enableGrouping).pipe(
			switchMap(grouped => {
				if (grouped) return this.getGroupFilter(filterValue, lookup);
				if (this.isRemote()) return this.getRemoteFilter(filterValue, lookup);
				return this.getArrayFilter(filterValue, lookup);
			})
		);
	}

	getGroupFilter(filterValue: string, lookup: boolean = false): Observable<any> {
		return this.getDataSource().pipe(
			switchMap(data => {
				const groupedItems = this.getGroupedItems(data);
				const filtered = [];
				groupedItems.subscribe(grp => {
					_.each(grp.items, item => {
						const f = _.filter(item, i => this.matched(filterValue, i, lookup));
						if (f.length > 0) filtered.push(f);
					});
				});
				return this.getGroupedItems(filtered);
			})
		);
	}

	getArrayFilter(filterValue: string, lookup: boolean = false): Observable<any> {
		return this.getDataSource().pipe(
			switchMap(data => from(data)),
			filter(item => this.matched(filterValue, item, lookup)),
			reduce((acc, value) => [...acc, value], [])
		);
	}

	parseResource(url: string): UriResource {
		const pos = url.indexOf("|");
		if (pos !== -1) {
			const urlPart = url.substring(0, pos);
			const paramsPart = url.substring(pos + 1);
			const params = paramsPart.split("&");
			const root = !_.isUndefined(_.find(params, e => "root=true"));
			return new UriResource().setUrl(urlPart, root);
		}
		return new UriResource().setUrl(url);
	}

	getRemoteFilter(filterValue: string, lookup: boolean = false): Observable<any> {
		if (typeof this.dataSource === "string") {
			const resource = this.parseResource(this.dataSource);
			const filterExpression = lookup
				? this.buildLookupFilterExpression(filterValue)
				: this.buildFilterExpression(filterValue);

			const ds = new DataWebApiDataSource(this.http)
				.setResource(resource)
				.filter(filterExpression)
				.fetch()
				.pipe(switchMap(res => of(res.data)));

			return ds;
		}
		return this.getDataSource();
	}

	matched(keyword: string, item: any, lookup: boolean) {
		if (lookup) {
			return this.getSelectedValue() === this.getValueFromItem(item);
		} else {
			return this.isMatched(keyword, item);
		}
	}

	/**
	 * 1. Checks if it's an array.
	 * 2. Then it checks if it's an observable.
	 * 3. Otherwise it checks if it's an IDatagridDatasource
	 */
	getDataSource(): Observable<any> {
		if (_.isArray(this.dataSource)) {
			return of(this.dataSource);
		} else if (this.dataSource instanceof Observable) {
			return this.dataSource;
		} else if (typeof this.dataSource === "string") {
			const resource = this.parseResource(this.dataSource);
			const ds = new DataWebApiDataSource(this.http)
				.setResource(resource)
				.filter(this.buildFilterExpression(this.filterValue))
				.fetch()
				.pipe(switchMap(res => of(res.data)));
			return ds;
		} else {
			return this.dataSource.fetch();
		}
	}

	buildFilterExpression(filterValue: string): FilterGroup {
		const fields: DataField<any>[] = _.union(_.defaultTo(this.filters, []), [
			{
				name: this.displayField,
				text: new Inflector(this.displayField).humanize().value,
				enableSearch: true
			}
		]);
		const fm = new FilterManager<any>(fields);
		fm.searchString = _.trim(filterValue);
		return fm.buildFilter();
	}

	buildLookupFilterExpression(filterValue: string): FilterGroup {
		const rule: FilterRule = {
			field: this.valueField,
			op: "eq",
			data: filterValue
		};

		const criteria: FilterGroup = {
			groupOp: "And",
			groups: [],
			rules: [rule]
		};

		return criteria;
	}
	// #endregion

	getSelectedItemText(): string {
		let text = "";
		if (this.selectionField) text = _.get(this.selectedItem, this.selectionField);
		text = this.getText(this.selectedItem);
		return _.toString(text);
	}

	getValueFromItem(item: any): string {
		if (_.isObject(item)) {
			return _.get(item, this.getKey(item));
		}
		return item;
	}

	getItemFromValue(value: any): { value: any; index: number } {
		let val = this.getDefaultValue();
		let index = -1;

		if (!this.items) {
			return { value: val, index: index };
		}

		if (this.enableLookup) {
			index = _.findIndex(_.toArray(this.items), i => this.getValueFromItem(i) === value);
			val = this.items[index];
		} else {
			index = _.findIndex(
				_.toArray(this.items),
				i => this.getValueFromItem(i) === this.getValueFromItem(value)
			);
			val = this.items[index];
		}

		return { value: val, index: index };
	}

	printText(item) {
		return `${item["displayIndex"]}`;
	}

	getText(item: any): string {
		// Prioritize custom display text
		if (this.getDisplayText) {
			return this.getDisplayText(item);
		}

		if (_.isObject(item)) {
			if (this.displayField) return _.get(item, this.displayField);
			return _.get(item, _.has(item, "text") ? "text" : this.getKey(item));
		}
		return _.toString(item);
	}

	getKey(item: any): any {
		if (_.isObject(item)) {
			if (this.valueField) return this.valueField;
			return this.displayField ? this.displayField : "id";
		}
		return item;
	}

	/**
	 * Creatable items
	 */

	getCreatableItemText(): string {
		return `Create "${this.filterValue}"`;
	}

	hasMatch(keyword: string): boolean {
		return this.visibleItems.some(
			e =>
				this.getText(e)
					.trim()
					.toLowerCase() === keyword.trim().toLowerCase()
		);
	}

	showCreatableItem(): boolean {
		return (
			this.enableCreatableItem &&
			this.filterValue.length !== 0 &&
			!this.hasMatch(this.filterValue)
		);
	}

	createNewItem(e: Event) {
		if (_.isArray(this.dataSource)) {
			this.dataSource.push(this.getValueFromItem(this.filterValue));
		}
		this.popup();
	}
}
