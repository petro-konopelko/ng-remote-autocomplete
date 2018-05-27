import { ElementRef } from "@angular/core";
import { OPTION_LIST_WRAPPER_CLASS, OPTION_CLASS, DEFAULT_ACTIVE_INDEX } from "../constants/autocomplete.constants";

export class ScrollService {
    constructor(private element: ElementRef) {
    }

    handleKeyboarOptionNavigation(activeIndex: number): void {
        const autocompleteElement = <HTMLElement>this.element.nativeElement;
        const listElement = autocompleteElement.querySelector(`.${OPTION_LIST_WRAPPER_CLASS}`);

        if (listElement) {
            if (activeIndex === DEFAULT_ACTIVE_INDEX) {
                listElement.scrollTo(0, 0);
                return;
            }

            const optionElements = listElement.querySelectorAll(`.${OPTION_CLASS}`);
            const activeElement = optionElements[activeIndex];

            const listTop = listElement.getBoundingClientRect().top;
            const listBottom = listTop + listElement.clientHeight;

            const elementTop = activeElement.getBoundingClientRect().top;
            const elementBottom = elementTop + activeElement.clientHeight;

            if (listTop > elementTop) {
                activeElement.scrollIntoView(true);
            }

            if (listBottom < elementBottom) {
                activeElement.scrollIntoView(false);
            }
        }
    }
}