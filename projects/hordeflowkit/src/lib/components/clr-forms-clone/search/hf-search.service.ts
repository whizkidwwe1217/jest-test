import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class HfSearchService {
  public subject: BehaviorSubject<{
    hoveredIndex: number;
    selectedIndex: number;
    focusedIndex: number;
  }> = new BehaviorSubject<{
    hoveredIndex: number;
    focusedIndex: number;
    selectedIndex: number;
  }>({
    hoveredIndex: -1,
    selectedIndex: -1,
    focusedIndex: -1
  });

  public setIndices(hoveredIndex: number, focusedIndex: number, selectedIndex: number) {
    this.subject.next({
      hoveredIndex: hoveredIndex,
      focusedIndex: focusedIndex,
      selectedIndex: selectedIndex
    });
  }
  public getIndices(): Observable<{
    hoveredIndex: number;
    focusedIndex: number;
    selectedIndex: number;
  }> {
    return this.subject.asObservable();
  }
}
