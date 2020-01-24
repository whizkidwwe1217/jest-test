import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ContentChild
} from "@angular/core";
import { DynamicListItem } from "./dynamic-list-item";
import { from, Observable, defer, fromEvent, Subscription, of } from "rxjs";
import * as _ from "lodash";
import {
  groupBy,
  mergeMap,
  toArray,
  switchMap,
  flatMap,
  reduce,
  map,
  count,
  scan,
  tap,
  share,
  pluck,
  delay
} from "rxjs/operators";
import { DynamicListGroup } from "./dynamic-list-group";
import Popper from "popper.js";
import { HfSearch } from "hordeflowkit";

@Component({
  selector: "dynamic-list",
  styleUrls: ["dynamic-list.scss"],
  templateUrl: "dynamic-list.html"
})
export class DynamicList implements AfterViewInit {
  @Input() displayField: string;
  @Input() showIcons = true;
  @Input() showAddItem = true;
  @Input() enableGrouping = true;
  @Input() showAddItemBox = true;
  @Input() showMenu = false;
  @Input() autoFocusAddButton = true;
  @Input() canAddItem = true;
  @Input() editorOnTop: boolean;
  @Input() enableLookup: boolean;
  @Input() alwaysShowEditor: boolean;
  @Input() canEdit = true;
  @Input() canDelete = true;
  @Input() lookupResource: any;
  @Input() lookupDisplayField: string = "name";
  @Input() defaultIcon: string = "application";
  @Input() lookupValueField: string = "id";
  @Input() lookupAllowCreateItem: boolean = true;
  @Input() onCreateItem: Observable<any>;
  @Output() itemdeleted: EventEmitter<DynamicListItem> = new EventEmitter<DynamicListItem>();
  @Output() itemchanged: EventEmitter<DynamicListItem> = new EventEmitter<DynamicListItem>();
  @Output() itemadded: EventEmitter<DynamicListItem> = new EventEmitter<DynamicListItem>();
  @ViewChild("inputBox", { static: false }) inputBox: ElementRef;
  @ViewChild(HfSearch, { static: false }) lookup: HfSearch;
  adding: boolean;
  inputString: string;
  selectedItem: any;
  itemsForDisplay: [{ group: DynamicListGroup; items: DynamicListItem[] }][] = [];
  defaultGroup: DynamicListGroup = { name: "Others" };
  groupForNewItem: DynamicListGroup;
  addToGroup: boolean;
  subscription: Subscription;
  _items: DynamicListItem[] = [];

  @Input()
  set items(newItems: DynamicListItem[]) {
    this._items = newItems;
    console.log(this._items);
    this.loadData();
  }

  get items(): DynamicListItem[] {
    return this._items;
  }

  ngAfterViewInit() {
    if (this.alwaysShowEditor) {
      this.registerSubscription();
    }
  }

  registerSubscription() {
    if (!this.inputBox) return;
    this.subscription = fromEvent(this.inputBox.nativeElement, "keydown")
      .pipe(pluck("target", "value"))
      .subscribe((value: string) => {
        const grpItem = this.getGroup(value);
        if (grpItem) {
          if (!this.addToGroup) {
            this.groupForNewItem = grpItem.group;
          }
        }
      });
  }

  unregisterSubscription() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  onSelectItem(e) {
    if (_.get(e, this.lookupDisplayField) !== this.inputString) {
      this.inputString = _.get(e, this.lookupDisplayField);
      this.addItem(e);
      if (this.autoFocusAddButton) {
        this.focusInput(e);
      }
    }
  }

  public focusInput(e) {
    if (this.inputBox) {
      const el = this.inputBox.nativeElement;
      el.focus();
    } else if (this.lookup) {
      if (this.lookup.inputBox) this.lookup.inputBox.nativeElement.focus();
    }
  }

  public setItem(items: DynamicListItem[]) {
    this.items = items;
    this.loadData();
  }

  private getGroup(inputString: string): { itemText: string; group: DynamicListGroup } {
    if (_.isEmpty(inputString)) return { itemText: this.inputString, group: this.defaultGroup };
    const input = inputString.trim();

    const grpPos: number = input.indexOf(":");
    if (grpPos !== -1) {
      const item = input.slice(grpPos + 1).trim();
      const newGroupName = input.slice(0, grpPos).trim();
      const groups: DynamicListGroup[] = _.map(
        _.filter(this.items, i => i.group),
        (i: DynamicListItem) => i.group
      );
      const newGroup = _.find(
        _.uniqBy(groups, e => e.name),
        {
          name: newGroupName
        }
      );
      return {
        itemText: item,
        group: newGroup ? newGroup : { name: newGroupName }
      };
    }

    return { itemText: this.inputString, group: this.defaultGroup };
  }

  public cancelAdding(e) {
    this.adding = false;
    this.unregisterSubscription();
  }

  public onAddNewItemClick(e) {
    this.adding = true;
    setTimeout(() => {
      this.registerSubscription();
      this.focusInput(e);
    }, 0);
  }

  public add(event) {
    if (this.alwaysShowEditor) this.focusInput(event);
    this.addItem();
  }

  private addItem(payload?: any) {
    if (!_.isEmpty(this.inputString)) {
      const newGroup = this.getGroup(this.inputString);
      this.groupForNewItem = this.addToGroup ? this.groupForNewItem : newGroup.group;
      const item: DynamicListItem = {
        group: this.groupForNewItem,
        payload: payload,
        name:
          newGroup && this.enableGrouping
            ? this.addToGroup
              ? this.inputString.trim()
              : newGroup.itemText.trim()
            : this.inputString.trim()
      };
      this.items.push(item);
      this.itemadded.emit(item);
      this.loadData();
      this.inputString = null;
      this.groupForNewItem = null;
      this.addToGroup = false;
    }
    this.adding = false;
    this.unregisterSubscription();
  }

  public getItemsForDisplay(): Observable<any> {
    const incrementIndex = () => {
      return source =>
        defer(() => {
          let index = 0;
          return source.pipe(
            map((next: DynamicListItem) => {
              next.index = index++;
              return next;
            })
          );
        }).pipe(share());
    };
    if (!this.items) this.items = [];
    const obs$ = from(this.items).pipe(incrementIndex());

    if (this.enableGrouping)
      return obs$.pipe(
        groupBy(
          (item: DynamicListItem) => (item.group ? item.group.name : this.defaultGroup.name),
          item => item
        ),

        flatMap(group => group.pipe(reduce((acc: DynamicListItem[], cur) => [...acc, cur], []))),
        map((arr: DynamicListItem[]) => ({
          group: arr[0].group ? arr[0].group : this.defaultGroup,
          items: arr
        }))
      );
    else return obs$.pipe(map(items => ({ group: this.defaultGroup, items: [items] })));
  }

  public loadData() {
    this.itemsForDisplay = [];
    this.getItemsForDisplay().subscribe(
      (x: [{ group: DynamicListGroup; items: DynamicListItem[] }]) => this.itemsForDisplay.push(x)
    );
  }

  public newItemToGroup(group: DynamicListGroup) {
    this.groupForNewItem = group;
    this.adding = true;
    this.addToGroup = true;
    setTimeout(() => {
      this.registerSubscription();
      this.focusInput(null);
    }, 0);
  }

  public edit(item: DynamicListItem) {
    console.log(item);
    this.itemchanged.emit(item);
  }

  public delete(item: DynamicListItem) {
    this.items.splice(item.index, 1);
    this.loadData();
    this.itemdeleted.emit(item);
  }
}
