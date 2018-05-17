import {
    Input,
    Directive,
    HostListener
} from "@angular/core";

import { ItemListService } from "../services/item-list.service";
import { AutocompleteService } from "../services/autocomplete.service";

@Directive({
    selector: '[cmpl-option]',
    host: {
        '(mouseenter)': 'onMouseEnter()',
        '(mouseleave)': 'onMouseLeave()',
        '(click)': 'onClick()'
    }
})
export class OptionDirective {
    @Input('itemIndex') index;

    constructor(private autocompleteService: AutocompleteService,
        private itemListService: ItemListService) {
    }

    onMouseEnter(event: MouseEvent) {
        this.itemListService.activeIndex = this.index;
    }

    onMouseLeave(event: MouseEvent) {
        this.itemListService.restoreIntialActiveIndex();
    }

    onClick() {
        this.autocompleteService.selectItemSubject.next(this.index);
    }
}