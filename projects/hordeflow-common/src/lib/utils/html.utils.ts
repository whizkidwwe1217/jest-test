import { HtmlElementBoundingBox } from "./html-element-bounding-box";

export class HtmlUtils {
	/**
	 * Determines whether an element is contained in the visible viewport of its scrolled parents
	 * return a bounding box representing the element's visible portion:
	 * left: left edge of the visible portion of the element relative to the screen
	 * top: top edge of the visible portion of the element relative to the screen
	 * right: right edge of the visible portion of the element relative to the screen
	 * bottom: bottom edge of the visible portion of the element relative to the screen
	 * width: width of the element
	 * height: height of the element
	 * isVisible: whether any part of the element can be seen
	 * isContained: whether all of the element can be seen
	 * visibleWidth: width of the visible portion of the element
	 * visibleHeight: width of the visible portion of the element
	 * @param goDeep If false or undefined, just check the immediate scroll parent.
	 *               If truthy, check all scroll parents up to the Document.
	 */
	public static visibleInScroll(parentEl, el, goDeep): HtmlElementBoundingBox {
		let parent = parentEl,
			rect = el.getBoundingClientRect(),
			rects = [parent.getBoundingClientRect()];
		let elRect: HtmlElementBoundingBox = {
			left: rect.left,
			top: rect.top,
			right: rect.right,
			bottom: rect.bottom,
			width: rect.width,
			height: rect.height,
			visibleWidth: rect.width,
			visibleHeight: rect.height,
			isVisible: true,
			isContained: true
		};
		let elWidth = elRect.width,
			elHeight = elRect.height;

		while (parent !== null) {
			if (
				parent.scrollWidth > parent.clientWidth ||
				parent.scrollHeight > parent.clientHeight
			) {
				rects.push(parent.getBoundingClientRect());
			}
			if (rects.length && goDeep) {
				break;
			}
			parent = parent.scrollParent()[0];
		}
		if (!goDeep) {
			rects.length = 1;
		}
		for (let i = 0; i < rects.length; i += 1) {
			let rect = rects[i];
			elRect.left = Math.max(elRect.left, rect.left);
			elRect.top = Math.max(elRect.top, rect.top);
			elRect.right = Math.min(elRect.right, rect.right);
			elRect.bottom = Math.min(elRect.bottom, rect.bottom);
		}
		elRect.visibleWidth = Math.max(0, elRect.right - elRect.left);
		elRect.visibleHeight = elRect.visibleWidth && Math.max(0, elRect.bottom - elRect.top);
		if (!elRect.visibleHeight) {
			elRect.visibleWidth = 0;
		}
		elRect.isVisible = elRect.visibleWidth > 0 && elRect.visibleHeight > 0;
		elRect.isContained =
			elRect.visibleWidth === elRect.width && elRect.visibleHeight === elRect.height;
		return elRect;
	}
}
