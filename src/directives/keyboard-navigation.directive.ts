import {
    Directive,
    HostListener
} from "@angular/core";

import { KeyCode } from "../enums/key-kode";
import { ItemListService } from "../services/item-list.service";
import { AutocompleteService } from "../services/autocomplete.service";

@Directive({
    selector: '[keyboard-navigation]'
})
export class KeyboardNavigationDirective {
    constructor(private autocompleteService: AutocompleteService,
        private itemListService: ItemListService) {
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
    }

    private handleUpKey(event: KeyboardEvent) {
        this.itemListService.activeIndex--;
    }

    private handleEnter(event: KeyboardEvent) {
        if (this.itemListService.activeIndex >= 0) {
            this.autocompleteService.selectItemSubject.next(this.itemListService.activeIndex);
            event.preventDefault();
        }
    }
}