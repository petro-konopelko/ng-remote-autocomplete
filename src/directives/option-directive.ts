import {
    Input,
    Directive,
    HostListener
} from "@angular/core";

import { ItemListService } from "../services/item-list.service";
import { AutocompleteService } from "../services/autocomplete.service";

@Directive({
    selector: '[remote-autocomplete-option]',
    host: {
        '(mouseenter)': 'onMouseEnter($event)',
        '(mouseleave)': 'onMouseLeave($event)',
        '(click)': 'onClick($event)'
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

    onClick(event: MouseEvent) {
        this.autocompleteService.selectItemSubject.next(this.index);
    }
}