/**
 * @license
 * Copyright HordeFlow Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a commercial license that can be
 * found in the LICENSE file at https://hordeflow.com/license
 */
import {
    Component,
    Input,
    AfterViewInit,
    ElementRef,
    ViewChild,
    OnInit,
    EventEmitter,
    Output,
    forwardRef,
    ChangeDetectorRef,
    OnDestroy
} from "@angular/core";
import { Subscription, Observable, from, fromEvent, of } from "rxjs";
import {
    filter,
    map,
    distinctUntilChanged,
    debounceTime,
    tap,
    pluck,
    concatMap,
    finalize
} from "rxjs/operators";
import * as _ from "lodash";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { HttpSearchParams, HttpService, HtmlUtils, SystemUtils, TextUtils } from "hordeflow-common";

@Component({
    selector: "hf-searchbox",
    styleUrls: ["./search-box.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SearchBoxComponent),
            multi: true
        }
    ],
    templateUrl: "./search-box.component.html"
})
export class SearchBoxComponent implements AfterViewInit, OnInit, OnDestroy, ControlValueAccessor {
    @Input() items: any[] = [];
    @Input() searchParams: HttpSearchParams = { currentPage: 1, pageSize: 50 };
    @Input() displayField: string;
    @Input() valueField: string;
    @Input() placeholder: string;
    @Input() autofocus: boolean;
    @Input() displayRenderer: Function;
    @Input() isMatched: Function;
    @Input() autoComplete: boolean;
    @Input() useBuiltInService: boolean = false;
    @Input() lookup: boolean = false;
    @Input() clearItemsOnHide: boolean;
    _unsecured: boolean = false;
    private _disabled: boolean = false;
    private _readonly: boolean = false;
    private _serverDriven: boolean = false;
    private _resource: string;
    private _rootResource: boolean;
    private _dataSource: Function | Observable<any>;
    @Output() onSelect: EventEmitter<any> = new EventEmitter();
    @Input() currentPage: number = 1;
    @Input() pageSize: number = 10;
    @Input() filter: string;
    @Input() sort: string;
    @Input() fields: string;
    @Input() preloaded: boolean;
    @Input() icon: string;

    filteredItems: string[] = [];
    dataFilter: string;
    open: boolean = false;
    searching: boolean = false;
    selectedItem: any;
    selectedRawItem: any;
    selectedText: string;
    selectedIndex: number = -1;
    activeIndex: number = -1;
    scrollerClicked: boolean = false;
    hasError: boolean = false;
    errorMsg: string;

    private $navigation: Observable<any>;
    private $filtering: Observable<any>;
    private $fetchData: Observable<any>;
    private _navigation: Subscription;
    private _filtering: Subscription;
    private _fetchData: Subscription;

    @ViewChild("txtSearch", { static: true }) txtSearch: ElementRef;
    @ViewChild("list", { static: false }) list: ElementRef;
    @ViewChild("scrollbox", { static: false }) scrollBox: ElementRef;

    /* Properties */

    get resource(): string {
        return this._resource;
    }

    @Input()
    set resource(resource: string) {
        this._resource = resource;
    }

    get rootResource(): boolean {
        return this._rootResource;
    }

    @Input()
    set rootResource(rootResource: boolean) {
        this._rootResource = rootResource;
    }

    get unsecured(): boolean {
        return this._unsecured;
    }

    @Input()
    set unsecured(unsecured: boolean) {
        this._unsecured = unsecured;
    }

    get serverDriven(): boolean {
        return this._serverDriven;
    }

    @Input()
    set serverDriven(remote: boolean) {
        this._serverDriven = remote;
    }

    @Input()
    set dataSource(fn: Function | Observable<any>) {
        this._dataSource = fn;
    }

    get dataSource(): Function | Observable<any> {
        return this._dataSource;
    }

    /**
     * Checks whether this control is editable.
     */
    get readonly(): boolean {
        return this._readonly;
    }

    /**
     * Sets the control as read-only and non-editable. Although, the input box can still received tab focus.
     */
    @Input()
    set readonly(value: boolean) {
        this._readonly = value;

        if (value) {
            this.createKeyEvents();
            this.attachKeyEvents();
        } else {
            // Make sure to unsubscribe events when state is readonly or disabled so that the list will not be loaded to the DOM
            this.detachKeyEvents();
        }
    }

    /**
     * Checks whether this control is disabled.
     */
    get disabled(): boolean {
        return this._disabled;
    }

    /**
     * Sets the control as disabled and non-editable. Although, the input box can still received tab focus.
     */
    @Input()
    set disabled(value: boolean) {
        this._disabled = value;

        if (value) {
            this.createKeyEvents();
            this.attachKeyEvents();
        } else {
            // Make sure to unsubscribe events when state is disabled so that the list will not be loaded to the DOM
            this.detachKeyEvents();
        }
    }

    constructor(private chRef: ChangeDetectorRef, private service: HttpService) {}

    ngOnInit() {
        this.filteredItems = this.items;
        this.autoComplete = true;
    }

    loadServerSideItems(id: number) {
        if (this.serverDriven && this.resource && this.lookup) {
            this.service.get(this.resource, id).subscribe(item => {
                this.items.push(item);
                this.setSelectedItem(this.items[0]);
            });
        }
    }

    writeValue(value: any) {
        if (value !== undefined) {
            if (value) {
                if (this.lookup) {
                    let item = null;
                    if (this.valueField) {
                        if (_.isObject(value)) {
                            item = this.getItem(value[this.valueField], null);
                        } else {
                            if (this.serverDriven && !this.preloaded)
                                this.loadServerSideItems(value);
                            else item = this.getItem(value, null);
                        }
                    } else {
                        item = this.selectedItem;
                    }
                    this.setSelectedItem(item);
                } else {
                    this.setSelectedItem(value);
                }
            } else {
                this.setSelectedItem(value);
            }
        }
    }

    propagateChange = (p: any) => {};

    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    propagateValue() {
        if (this.lookup) {
            let value = null;
            if (this.valueField) {
                value = this.selectedItem[this.valueField];
            } else {
                value = this.selectedItem;
            }
            this.selectedRawItem = this.selectedItem;
            this.propagateChange(value);
        } else {
            this.propagateChange(this.selectedItem);
        }
    }

    registerOnTouched() {}

    setSelectedItem(item: any) {
        this.selectedItem = item;
        this.onSelect.emit(item);
        this.selectedText = this.getDisplayText(item);
        this.setSelectedIndex();
    }

    getDisplayText(item: any): string {
        if (!item) return null;

        if (this.displayRenderer) return this.displayRenderer(item);
        if (this.displayField) return item[this.displayField];
        return item;
    }

    getItem(key: any, defaultValue: any) {
        let selected = null;
        if (this.valueField) {
            let stringFilter = `{ ${JSON.stringify(this.valueField)} : ${JSON.stringify(
                isNaN(key) ? key : parseInt(key)
            )} }`;
            let filter = JSON.parse(stringFilter);

            if (key) {
                selected = _.find(this.items, filter);
            }
        } else {
            if (this.displayField) {
                selected = _.find(this.items, this.displayField);
            } else {
                selected = defaultValue;
            }
        }

        return selected;
    }

    selectActiveIndex(index: number, hovered: boolean = false) {
        this.activeIndex = index;
        //this.chRef.detectChanges();

        if (!hovered) {
            if (this.autoComplete && index > -1 && index <= this.filteredItems.length) {
                if (this.selectedItem) {
                    this.selectedText = this.getDisplayText(this.filteredItems[index]);
                    this.txtSearch.nativeElement.select();
                }
            }
        }
    }

    hover(index) {
        this.selectActiveIndex(index, true);
    }

    scrollToActive() {
        if (this.readonly || this.disabled) return;
        if (this.list) {
            let el = this.list.nativeElement;
            if (el) {
                let selected = el.children[this.activeIndex];
                if (selected) {
                    let el: HTMLAnchorElement = selected.firstElementChild;
                    if (el) {
                        let sb = this.scrollBox.nativeElement;
                        let rect = HtmlUtils.visibleInScroll(sb, el, true);
                        if (rect && !rect.isContained) {
                            el.scrollIntoView();
                        }
                    }
                }
            }
        }
    }

    ngAfterViewInit(): void {
        if (!(this.readonly || this.disabled)) {
            this.createKeyEvents();
            this.attachKeyEvents();
        }
    }

    createKeyEvents() {
        let el: HTMLInputElement = this.txtSearch.nativeElement;
        this.$navigation = fromEvent(el, "keydown");
        this.$filtering = fromEvent(el, "keyup").pipe(
            filter((x: any) => {
                x.preventDefault();
                x.stopPropagation();
                let valid = false;
                if (
                    x.keyCode !== SystemUtils.KEY_CARRIAGE_RETURN &&
                    x.keyCode !== SystemUtils.KEY_ESC &&
                    x.keyCode !== SystemUtils.KEY_HORIZONTAL_TAB &&
                    x.keyCode !== SystemUtils.KEY_UP &&
                    x.keyCode != SystemUtils.KEY_DOWN &&
                    x.keyCode !== SystemUtils.KEY_RIGHT &&
                    x.keyCode !== SystemUtils.KEY_LEFT
                )
                    valid = true;
                if (x.keyCode < SystemUtils.KEY_SPACE) valid = false;
                if (x.keyCode === SystemUtils.KEY_BACKSPACE) valid = true;

                // Escape key
                if (x.keyCode === SystemUtils.KEY_ESC) {
                    this.toggleDropdown(false);
                    this.cancelChanges();
                    valid = false;
                }
                if (x.ctrlKey && x.keyCode !== SystemUtils.KEY_BACKSPACE) valid = false;
                return valid;
            }),
            pluck("target", "value"),
            debounceTime(300),
            distinctUntilChanged(),
            tap(() => {
                this.searching = true;
                this.filteredItems = [];
            }),
            map((x: string) => x.trim()),
            concatMap((keyword: string) => {
                if (!this.open) {
                    this.toggleDropdown(true, false);
                }
                if (this.serverDriven) {
                    keyword = keyword.trim();
                    let criteria = {
                        groupOp: "or",
                        rules: [
                            {
                                field: TextUtils.camelize(this.displayField),
                                op: "cn",
                                data: keyword
                            }
                        ]
                    };

                    this.dataFilter = keyword ? JSON.stringify(criteria) : null;
                    this.searchParams.filter = this.dataFilter;
                    this.fetchItems();
                    return this.getObservableDataService();
                }

                let $o = from(this.items).pipe(
                    finalize(() => {
                        this.searching = false;
                    }),
                    filter(x => {
                        if (this.isMatched)
                            return this.isMatched(
                                keyword,
                                x,
                                this.displayField,
                                this.valueField,
                                this.items
                            );
                        return (this.displayField ? x[this.displayField] : x)
                            .toLocaleLowerCase()
                            .includes(keyword.toLocaleLowerCase());
                    })
                );
                return $o;
            })
        );
    }

    attachKeyEvents() {
        this._navigation = this.$navigation.subscribe((x: any) => {
            if (
                x.keyCode === SystemUtils.KEY_CARRIAGE_RETURN ||
                x.keyCode === SystemUtils.KEY_ESC
            ) {
                x.preventDefault();
            }

            // Down arrow key
            if (x.keyCode === SystemUtils.KEY_DOWN) {
                x.preventDefault();
                x.stopPropagation();
                if (this.open) {
                    if (this.activeIndex < this.filteredItems.length - 1) {
                        this.selectActiveIndex(this.activeIndex + 1);
                    } else {
                        this.selectActiveIndex(0);
                    }
                } else {
                    if (this.activeIndex > -1 && !this.selectedItem) {
                        this.activeIndex = -1;
                    }
                }

                this.scrollToActive();
                if (!this.open) this.toggleDropdown(true);
            }

            // Up arrow key
            if (x.keyCode === SystemUtils.KEY_UP) {
                x.preventDefault();
                x.stopPropagation();
                if (this.open) {
                    if (this.activeIndex > -1) {
                        this.selectActiveIndex(this.activeIndex - 1);
                    } else {
                        this.selectActiveIndex(0);
                    }
                }
                this.scrollToActive();
                if (!this.open) this.toggleDropdown(true);
            }

            // Enter key
            if (x.keyCode === SystemUtils.KEY_CARRIAGE_RETURN) {
                x.preventDefault();
                if (this.open && this.filteredItems && this.filteredItems.length > 0) {
                    let item = this.filteredItems[this.activeIndex];
                    if (item) {
                        this.setSelectedItem(item);
                        this.txtSearch.nativeElement.focus();
                        //this.txtSearch.nativeElement.scrollIntoView();
                        this.filteredItems = this.items;
                        this.propagateValue();
                        this.toggleDropdown(false);
                    }
                } else {
                    if (this.activeIndex > -1) this.selectActiveIndex(this.activeIndex);
                    else this.activeIndex = 0;
                    if (this.activeIndex > -1) this.scrollToActive();

                    if (!this.open) this.toggleDropdown(true);
                }
            }
        });

        this._filtering = this.$filtering.subscribe(items => {
            if (this.serverDriven) {
                this.items = items.data;
                this.filteredItems = items.data;
            } else {
                this.filteredItems.push(items);
            }
        });
    }

    getObservableDataService(): Observable<any> {
        if (this.serverDriven) {
            if (this.useBuiltInService) {
                return this.service.search(this.resource, this.searchParams, this.rootResource);
            } else {
                if (this.dataSource && this.dataSource instanceof Observable) {
                    let $o = this.dataSource as Observable<any>;
                    return $o;
                } else {
                    return this.service.list(this.resource);
                }
            }
        }
        return null;
    }

    /**
     * Destroys all unused resources and unsubscribes all events.
     */
    ngOnDestroy() {
        this.detachKeyEvents();
    }

    /**
     * Detaches and unsubscribes all key events.
     */
    detachKeyEvents() {
        if (this._navigation) {
            this._navigation.unsubscribe();
        }
        if (this._filtering) {
            this._filtering.unsubscribe();
        }
        if (this._fetchData) {
            this._fetchData.unsubscribe();
        }

        this.clearItems(true);
    }

    clearItems(force: boolean = false) {
        // If server-driven, items will be cleared when the dropdown is closed or if the control gets destroyed.
        if ((this.serverDriven && this.clearItemsOnHide) || force) {
            this.items = [];
            this.selectedText = "";
            this.selectedIndex = -1;
            this.selectedItem = null;
            this.dataFilter = null;
            this.selectedRawItem = null;
            this.txtSearch.nativeElement.value = null;
        }
    }

    toggleDropdown(show: boolean, fetchItems: boolean = true) {
        this.open = this.readonly || this.disabled ? false : show;
        this.scrollerClicked = false;

        if (!show) this.clearItems();
        this.fetchItems();
    }

    fetchItems() {
        if (this.serverDriven && this.open) {
            this.items = [];
            this.filteredItems = [];
            this.searching = true;
            this.hasError = false;
            this.errorMsg = "";
            this.$fetchData = this.getObservableDataService();
            if (this.$fetchData) {
                this._fetchData = this.$fetchData.subscribe(
                    items => {
                        if (items) {
                            items.data.forEach(e => {
                                this.items.push(e);
                            });
                        }
                        this.filteredItems = this.items;
                        this.searching = false;
                    },
                    response => {
                        this.searching = false;
                        this.hasError = true;
                        this.errorMsg =
                            response.error && response.error.Details
                                ? response.error.Details
                                : response.statusText;
                    }
                );
            }
        } else {
            if (this._fetchData) this._fetchData.unsubscribe();
        }
    }

    cancelChanges() {
        if (this.selectedItem) {
            this.activeIndex = this.selectedIndex;
            this.selectedText = this.getDisplayText(this.selectedItem);
            this.scrollToActive();
        } else this.selectedText = "";
        this.filteredItems = this.items;
    }

    onCaretIconClick(e) {
        e.preventDefault();
        e.stopPropagation();

        let tag = e.target.tagName.toLocaleLowerCase();
        if (tag !== "a") {
            this.toggleDropdown(!this.open);
            this.txtSearch.nativeElement.focus();
        }
    }

    onItemClick(event) {
        event.preventDefault();
        event.stopPropagation();
        if (event.target.tagName.toLocaleLowerCase() !== "a") return;

        let id = event.target.id;
        let selected = this.getItem(id, event.target.innerText);

        if (selected) {
            this.setSelectedItem(selected);
        } else {
            this.setSelectedItem(event.target.innerText);
        }

        this.txtSearch.nativeElement.focus();
        this.filteredItems = this.items;
        //this.setSelectedIndex();
        this.propagateValue();
        this.toggleDropdown(false);
    }

    /**
     * Sets the selected index. The selected index is used to determine where the selected item is positioned in the list.
     */
    setSelectedIndex() {
        this.selectedIndex = this.activeIndex;
    }

    /**
     * Sets the scrollerClicked flag to true if the scrollbar is clicked.
     * This is not an ideal way because the flag is always set to true even if the element that was clicked is the actual
     * div and not the scroll bar. Since only the scrollbar is visible and it's also a part of the div, then it's okay to
     * use this method.
     * @param event The scroll box where the mouse down event is attached.
     */
    onScrollBoxMouseDown(event) {
        this.scrollerClicked = true;
    }

    /**
     * Releases the scrollerClicked flag and then focuses to the input control to allow the onBlur
     * method to close down the dropdown list box.
     * @param event The scroll box where the mouse up event is attached.
     */
    onScrollBoxMouseUp(event) {
        this.scrollerClicked = false;
        this.txtSearch.nativeElement.focus();
    }

    /**
     * Hides the dropdown list on blur if the mouse is not on scrollbar.
     */
    onBlur() {
        if (!this.scrollerClicked) {
            this.toggleDropdown(false);
            this.cancelChanges();
        }
    }
}
