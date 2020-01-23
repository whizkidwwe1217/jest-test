import { Observable } from "rxjs";
import { take } from "rxjs/operators";

// previous version:
// https://github.com/angular-ui/bootstrap/blob/07c31d0731f7cb068a1932b8e01d2312b796b4ec/src/position/position.js
export class Positioning {
  private getAllStyles(element: HTMLElement) {
    return window.getComputedStyle(element);
  }

  private getStyle(element: HTMLElement, prop: string): string {
    return this.getAllStyles(element)[prop];
  }

  private isStaticPositioned(element: HTMLElement): boolean {
    return (this.getStyle(element, "position") || "static") === "static";
  }

  private offsetParent(element: HTMLElement): HTMLElement {
    let offsetParentEl = <HTMLElement>element.offsetParent || document.documentElement;

    while (
      offsetParentEl &&
      offsetParentEl !== document.documentElement &&
      this.isStaticPositioned(offsetParentEl)
    ) {
      offsetParentEl = <HTMLElement>offsetParentEl.offsetParent;
    }

    return offsetParentEl || document.documentElement;
  }

  position(element: HTMLElement, round = true): ClientRect {
    let elPosition: ClientRect;
    let parentOffset: ClientRect = {
      width: 0,
      height: 0,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    };

    let scrollTop = 0,
      scrollLeft = 0;
    if (this.getStyle(element, "position") === "fixed") {
      elPosition = element.getBoundingClientRect();
      elPosition = {
        top: elPosition.top,
        bottom: elPosition.bottom,
        left: elPosition.left,
        right: elPosition.right,
        height: elPosition.height,
        width: elPosition.width
      };
    } else {
      const offsetParentEl = this.offsetParent(element);

      elPosition = this.offset(element, false);

      if (offsetParentEl !== document.documentElement) {
        parentOffset = this.offset(offsetParentEl, false);
      }

      parentOffset.top += offsetParentEl.clientTop;
      parentOffset.left += offsetParentEl.clientLeft;

      const tagname = offsetParentEl.tagName.toLowerCase();
      if (tagname !== "html" && tagname !== "body") {
        scrollTop = offsetParentEl.scrollTop;
        scrollLeft = offsetParentEl.scrollLeft;
      }
    }

    elPosition.top -= parentOffset.top - scrollTop;
    elPosition.bottom -= parentOffset.top - scrollTop;
    elPosition.left -= parentOffset.left - scrollLeft;
    elPosition.right -= parentOffset.left - scrollLeft;

    if (round) {
      elPosition.top = Math.round(elPosition.top);
      elPosition.bottom = Math.round(elPosition.bottom);
      elPosition.left = Math.round(elPosition.left);
      elPosition.right = Math.round(elPosition.right);
    }

    return elPosition;
  }

  offset(element: HTMLElement, round = true): ClientRect {
    const elBcr = element.getBoundingClientRect();
    const viewportOffset = {
      top: window.pageYOffset - document.documentElement.clientTop,
      left: window.pageXOffset - document.documentElement.clientLeft
    };

    let elOffset = {
      height: elBcr.height || element.offsetHeight,
      width: elBcr.width || element.offsetWidth,
      top: elBcr.top + viewportOffset.top,
      bottom: elBcr.bottom + viewportOffset.top,
      left: elBcr.left + viewportOffset.left,
      right: elBcr.right + viewportOffset.left
    };

    if (round) {
      elOffset.height = Math.round(elOffset.height);
      elOffset.width = Math.round(elOffset.width);
      elOffset.top = Math.round(elOffset.top);
      elOffset.bottom = Math.round(elOffset.bottom);
      elOffset.left = Math.round(elOffset.left);
      elOffset.right = Math.round(elOffset.right);
    }

    return elOffset;
  }

  /*
    Return false if the element to position is outside the viewport
  */
  positionElements(
    hostElPosition: any,
    targetElement: HTMLElement,
    placement: string,
    clientRectsCache?,
    useGpu = true
  ): boolean {
    const [placementPrimary = "top", placementSecondary = "center"] = placement.split("-");

    const targetElStyles = this.getAllStyles(targetElement);

    const marginTop = parseFloat(targetElStyles.marginTop);
    const marginBottom = parseFloat(targetElStyles.marginBottom);
    const marginLeft = parseFloat(targetElStyles.marginLeft);
    const marginRight = parseFloat(targetElStyles.marginRight);

    if (!useGpu) {
      const style = targetElement.style;

      // Unfreeze
      style.width = "";
      style.height = "";
      style.top = "0";
      style.left = "0";

      // Freeze dimensions as it has impact on the placement,
      // It should be done for each iteration because of the arrow position, which change the popup dimension
      style.width = targetElement.offsetWidth + "px";
      style.height = targetElement.offsetHeight + "px";
    }

    let topPosition = 0;
    let leftPosition = 0;

    switch (placementPrimary) {
      case "top":
        topPosition = hostElPosition.top - (targetElement.offsetHeight + marginTop + marginBottom);
        break;
      case "bottom":
        topPosition = hostElPosition.top + hostElPosition.height;
        break;
      case "left":
        leftPosition = hostElPosition.left - (targetElement.offsetWidth + marginLeft + marginRight);
        break;
      case "right":
        leftPosition = hostElPosition.left + hostElPosition.width;
        break;
    }

    switch (placementSecondary) {
      case "top":
        topPosition = hostElPosition.top;
        break;
      case "bottom":
        topPosition = hostElPosition.top + hostElPosition.height - targetElement.offsetHeight;
        break;
      case "left":
        leftPosition = hostElPosition.left;
        break;
      case "right":
        leftPosition = hostElPosition.left + hostElPosition.width - targetElement.offsetWidth;
        break;
      case "center":
        if (placementPrimary === "top" || placementPrimary === "bottom") {
          leftPosition =
            hostElPosition.left + hostElPosition.width / 2 - targetElement.offsetWidth / 2;
        } else {
          topPosition =
            hostElPosition.top + hostElPosition.height / 2 - targetElement.offsetHeight / 2;
        }
        break;
    }

    /// The translate3d/gpu acceleration render a blurry text on chrome, the next line is commented until a browser fix
    // targetElement.style.transform = `translate3d(${Math.round(leftPosition)}px, ${Math.floor(topPosition)}px, 0px)`;
    // targetElement.style.transform = `translate(${Math.round(leftPosition)}px, ${Math.round(
    // 	topPosition
    // )}px)`;

    const [top, left] = [Math.round(topPosition) + "px", Math.round(leftPosition) + "px"];
    if (useGpu) {
      targetElement.style.transform = `translate(${left}, ${top})`;
    } else {
      targetElement.style.top = top;
      targetElement.style.left = left;
    }

    // Check if the targetElement is inside the viewport
    let targetElBCR;
    if (clientRectsCache) {
      targetElBCR = clientRectsCache[placement];
      if (!targetElBCR) {
        const targetElBCRTemp = targetElement.getBoundingClientRect();
        targetElBCR = clientRectsCache[placement] = {
          top: targetElBCRTemp.top,
          left: targetElBCRTemp.left,
          bottom: targetElBCRTemp.bottom,
          right: targetElBCRTemp.right
        };
      }
    } else {
      targetElBCR = targetElement.getBoundingClientRect();
    }
    const html = document.documentElement;
    const windowHeight = window.innerHeight || html.clientHeight;
    const windowWidth = window.innerWidth || html.clientWidth;

    return (
      targetElBCR.left >= 0 &&
      targetElBCR.top >= 0 &&
      targetElBCR.right <= windowWidth &&
      targetElBCR.bottom <= windowHeight
    );
  }
}

const placementSeparator = /\s+/;
const positionService = new Positioning();
const cache = new Map();

/*
 * Accept the placement array and applies the appropriate placement dependent on the viewport.
 * Returns the applied placement.
 * In case of auto placement, placements are selected in order
 *   'top', 'bottom', 'left', 'right',
 *   'top-left', 'top-right',
 *   'bottom-left', 'bottom-right',
 *   'left-top', 'left-bottom',
 *   'right-top', 'right-bottom'.
 * */
export function positionElements(
  hostElement: HTMLElement,
  targetElement: HTMLElement,
  placement: string | Placement | PlacementArray,
  appendToBody?: boolean,
  baseClass?: string,
  closed$?: Observable<any>,
  useGpu = true
): Placement {
  let clientRectsCache;
  if (closed$) {
    clientRectsCache = cache.get(targetElement);
    if (!clientRectsCache) {
      clientRectsCache = {};
      cache.set(targetElement, clientRectsCache);
      closed$.pipe(take(1)).subscribe(() => {
        cache.delete(targetElement);
      });
    }
  }

  let placementVals: Array<Placement> = Array.isArray(placement)
    ? placement
    : (placement.split(placementSeparator) as Array<Placement>);

  const allowedPlacements = [
    "top",
    "bottom",
    "left",
    "right",
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right",
    "left-top",
    "left-bottom",
    "right-top",
    "right-bottom"
  ];

  const classList = targetElement.classList;
  const addClassesToTarget = (targetPlacement: Placement): Array<string> => {
    const [primary, secondary] = targetPlacement.split("-");
    const classes = [];
    if (baseClass) {
      classes.push(`${baseClass}-${primary}`);
      if (secondary) {
        classes.push(`${baseClass}-${primary}-${secondary}`);
      }

      classes.forEach(classname => {
        classList.add(classname);
      });
    }
    return classes;
  };

  // Remove old placement classes to avoid issues
  if (baseClass) {
    allowedPlacements.forEach(placementToRemove => {
      classList.remove(`${baseClass}-${placementToRemove}`);
    });
  }

  // replace auto placement with other placements
  let hasAuto = placementVals.findIndex(val => val === "auto");
  if (hasAuto >= 0) {
    allowedPlacements.forEach(function(obj) {
      if (placementVals.find(val => val.search("^" + obj) !== -1) == null) {
        placementVals.splice(hasAuto++, 1, obj as Placement);
      }
    });
  }

  // Required for positioning:
  const style = targetElement.style;
  style.position = "absolute";
  // style.top = "0";
  // style.left = "0";
  // style["will-change"] = "transform";

  if (useGpu) {
    style.top = "0";
    style.left = "0";
    style["will-change"] = "transform";
  } else {
    style["will-change"] = "width, height, top, left";
  }

  let testPlacement: Placement;
  let isInViewport = false;
  const hostElPosition = appendToBody
    ? positionService.offset(hostElement, false)
    : positionService.position(hostElement, false);
  for (testPlacement of placementVals) {
    let addedClasses = addClassesToTarget(testPlacement);

    if (
      positionService.positionElements(
        hostElPosition,
        targetElement,
        testPlacement,
        clientRectsCache,
        useGpu
      )
    ) {
      isInViewport = true;
      break;
    }

    // Remove the baseClasses for further calculation
    if (baseClass) {
      addedClasses.forEach(classname => {
        classList.remove(classname);
      });
    }
  }

  if (!isInViewport) {
    // If nothing match, the first placement is the default one
    testPlacement = placementVals[0];
    addClassesToTarget(testPlacement);
    positionService.positionElements(
      hostElPosition,
      targetElement,
      testPlacement,
      clientRectsCache,
      useGpu
    );

    if (!useGpu) {
      // style.width = '';
      // style.height = '';
    }
  }

  return testPlacement;
}

export type Placement =
  | "auto"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "left-top"
  | "left-bottom"
  | "right-top"
  | "right-bottom";

export type PlacementArray = Placement | Array<Placement> | string;
