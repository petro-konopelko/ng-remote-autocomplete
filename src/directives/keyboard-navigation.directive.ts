import {
    Directive,
    HostListener,    ElementRef
} from "@angular/core";

import { KeyCode } from "../enums/key-kode";
import { ItemListService } from "../services/item-list.service";
import { AutocompleteService } from "../services/autocomplete.service";
import { ScrollService } from "../services/scroll-service";

@Directive({
    selector: '[keyboard-navigation]'
})
export class KeyboardNavigationDirective {
    private readonly scrollService: ScrollService;

    constructor(private autocompleteService: AutocompleteService,
        private itemListService: ItemListService,
        private element: ElementRef) {
        this.scrollService = new ScrollService(element);
    }

    @HostListener('keydown', ['$event']) onKeydown(event: KeyboardEvent) {
        let key = event.which || event.keyCode;

        switch (key) {
            case KeyCode.DownArrow:
                this.handleDownKey(event);
                break;
            case KeyCode.UpArrow:
                this.handleUpKey(event);
                break;
            case KeyCode.Enter:
                this.handleEnter(event);
                break;
        }
    }

    private handleDownKey(event: KeyboardEvent) {
        this.itemListService.activeIndex++;
        this.scrollService.handleKeyboarOptionNavigation(this.itemListService.activeIndex);
    }

    private handleUpKey(event: KeyboardEvent) {
        this.itemListService.activeIndex--;
        this.scrollService.handleKeyboarOptionNavigation(this.itemListService.activeIndex);
    }

    private handleEnter(event: KeyboardEvent) {
        if (this.itemListService.activeIndex >= 0) {
            this.autocompleteService.selectItemSubject.next(this.itemListService.activeIndex);
            event.preventDefault();
        }
    }
}