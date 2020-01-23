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
import { HfDynamicListItem } from "./dynamic-list-item";
import { from, Observable, defer, fromEvent, Subscription } from "rxjs";
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
	pluck
} from "rxjs/operators";
import { HfDynamicListGroup } from "./dynamic-list-group";

@Component({
	selector: "hf-dynamic-list",
	template: `
		<div class="hf-dynamic-list">
			<ng-container
				*ngIf="editorOnTop || (adding && alwaysShowEditor)"
				[ngTemplateOutlet]="editor"
			>
			</ng-container>
			<ul>
				<ng-container *ngFor="let obj of itemsForDisplay">
					<li
						*ngIf="obj.group !== null && enableGrouping"
						class="group"
					>
						<span *ngIf="obj.group"
							>{{ obj.group?.name }} ({{
								obj.items.length
							}})</span
						>
						<button
							class="btn btn-sm btn-link"
							(click)="newItemToGroup(obj.group)"
						>
							Add
						</button>
					</li>
					<p *ngIf="obj.group && enableGrouping">
						{{ obj.group.description }}
					</p>
					<li *ngFor="let item of obj.items; let i = index">
						<clr-icon
							*ngIf="showIcons"
							[attr.shape]="item.icon ? item.icon : 'application'"
						></clr-icon>
						<span>{{ item.name }}</span>
						<clr-icon
							*ngIf="canEdit && !item.readonly"
							class="float"
							shape="pencil"
							(click)="edit(item)"
						></clr-icon>
						<clr-icon
							*ngIf="canDelete && !item.readonly"
							class="float"
							shape="trash"
							(click)="delete(item)"
						></clr-icon>
						<clr-icon
							*ngIf="showMenu"
							class="float"
							shape="ellipsis-vertical"
						></clr-icon>
					</li>
				</ng-container>
			</ul>
			<ng-container
				*ngIf="!editorOnTop && (adding || alwaysShowEditor)"
				[ngTemplateOutlet]="editor"
			>
			</ng-container>
			<ng-template #editor>
				<form
					[ngClass]="{
						valid: groupForNewItem,
						'top-editor': editorOnTop
					}"
					class="input-box"
					(submit)="add($event)"
					(reset)="focusInput($event)"
				>
					<div class="input-container">
						<label
							class="label"
							*ngIf="groupForNewItem && this.enableGrouping"
							>{{ groupForNewItem.name }}</label
						>
						<input
							#inputBox
							type="text"
							hfDisableAutofill
							[ngModelOptions]="{ standalone: true }"
							[(ngModel)]="inputString"
							required
							placeholder="Add new item {{
								groupForNewItem?.name
							}}"
						/>
					</div>
					<div class="clear">
						<button
							style="padding: 0 0.125rem; margin: 0"
							class="btn btn-sm btn-icon btn-link"
							type="reset"
						>
							<clr-icon shape="times-circle"></clr-icon>
						</button>
						<button
							class="btn btn-sm btn-link"
							style="padding: 0 0.125rem; margin: 0; min-width: 0.25rem;"
							type="submit"
						>
							Add
						</button>
					</div>
				</form>
			</ng-template>
			<button
				*ngIf="
					!editorOnTop &&
					!adding &&
					showAddItem &&
					canAddItem &&
					!alwaysShowEditor
				"
				class="btn btn-sm btn-link"
				(click)="onAddNewItemClick($event)"
			>
				<clr-icon shape="plus"></clr-icon> Add New Item
			</button>
			<button
				*ngIf="adding && showAddItem && canAddItem && !alwaysShowEditor"
				class="btn btn-sm btn-link"
				(click)="cancelAdding($event)"
			>
				Discard
			</button>
		</div>
	`
})
export class HfDynamicList implements AfterViewInit {
	@Input()
	items: HfDynamicListItem[] = [];
	@Input() displayField: string;
	@Input() showIcons = true;
	@Input() showAddItem = true;
	@Input() enableGrouping = true;
	@Input() showAddItemBox = true;
	@Input() showMenu = false;
	@Input() canAddItem = true;
	@Input() editorOnTop: boolean;
	@Input() alwaysShowEditor: boolean;
	@Input() canEdit = true;
	@Input() canDelete = true;
	@Output() itemdeleted: EventEmitter<HfDynamicListItem> = new EventEmitter<
		HfDynamicListItem
	>();
	@Output() itemchanged: EventEmitter<HfDynamicListItem> = new EventEmitter<
		HfDynamicListItem
	>();
	@Output() itemadded: EventEmitter<HfDynamicListItem> = new EventEmitter<
		HfDynamicListItem
	>();
	@ViewChild("inputBox", { static: false }) inputBox: ElementRef;
	adding: boolean;
	inputString: string;
	itemsForDisplay: [
		{ group: HfDynamicListGroup; items: HfDynamicListItem[] }
	][] = [];
	defaultGroup: HfDynamicListGroup = { name: "Others" };
	groupForNewItem: HfDynamicListGroup;
	addToGroup: boolean;
	subscription: Subscription;

	ngAfterViewInit() {}

	registerSubscription() {
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

	public focusInput(e) {
		const el = this.inputBox.nativeElement;
		el.focus();
	}

	public setItem(items: HfDynamicListItem[]) {
		this.items = items;
		this.loadData();
	}

	private getGroup(
		inputString: string
	): { itemText: string; group: HfDynamicListGroup } {
		if (_.isEmpty(inputString))
			return { itemText: this.inputString, group: this.defaultGroup };
		const input = inputString.trim();

		const grpPos: number = input.indexOf(":");
		if (grpPos !== -1) {
			const item = input.slice(grpPos + 1).trim();
			const newGroupName = input.slice(0, grpPos).trim();
			const groups: HfDynamicListGroup[] = _.map(
				_.filter(this.items, i => i.group),
				(i: HfDynamicListItem) => i.group
			);
			const newGroup = _.find(_.uniqBy(groups, e => e.name), {
				name: newGroupName
			});
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

	private addItem() {
		if (!_.isEmpty(this.inputString)) {
			const newGroup = this.getGroup(this.inputString);
			this.groupForNewItem = this.addToGroup
				? this.groupForNewItem
				: newGroup.group;
			const item: HfDynamicListItem = {
				group: this.groupForNewItem,
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
						map((next: HfDynamicListItem) => {
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
					(item: HfDynamicListItem) =>
						item.group ? item.group.name : this.defaultGroup.name,
					item => item
				),

				flatMap(group =>
					group.pipe(
						reduce(
							(acc: HfDynamicListItem[], cur) => [...acc, cur],
							[]
						)
					)
				),
				map((arr: HfDynamicListItem[]) => ({
					group: arr[0].group ? arr[0].group : this.defaultGroup,
					items: arr
				}))
			);
		else
			return obs$.pipe(
				map(items => ({ group: this.defaultGroup, items: [items] }))
			);
	}

	public loadData() {
		this.itemsForDisplay = [];
		this.getItemsForDisplay().subscribe(
			(x: [{ group: HfDynamicListGroup; items: HfDynamicListItem[] }]) =>
				this.itemsForDisplay.push(x)
		);
	}

	public newItemToGroup(group: HfDynamicListGroup) {
		this.groupForNewItem = group;
		this.adding = true;
		this.addToGroup = true;
		setTimeout(() => {
			this.registerSubscription();
			this.focusInput(null);
		}, 0);
	}

	public edit(item: HfDynamicListItem) {
		console.log(item.index);
		this.itemchanged.emit(item);
	}

	public delete(item: HfDynamicListItem) {
		this.items.splice(item.index, 1);
		this.loadData();
		this.itemdeleted.emit(item);
	}
}
