import { Component, Input, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { HfSearchService } from "./hf-search.service";
import { HfSearchItemBase } from "./hf-search-item-base";

@Component({
  selector: "hf-search-item",
  template: `
    <li
      id="{{ index }}"
      value="{{ getValue() }}"
      [class.focused]="index === focusedIndex"
      [class.hovered]="index === hoveredIndex"
    >
      {{ getText() }}
    </li>
  `
})
export class HfSearchItem extends HfSearchItemBase implements OnDestroy {
  subscription: Subscription;
  public hoveredIndex: number;
  public selectedIndex: number;
  public focusedIndex: number;

  constructor(private service: HfSearchService) {
    super();
    this.subscription = this.service.getIndices().subscribe(indices => {
      this.hoveredIndex = indices.hoveredIndex;
      this.focusedIndex = indices.focusedIndex;
      this.selectedIndex = indices.hoveredIndex;
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
