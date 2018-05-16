import { 
    Input,
    Directive, 
    HostListener
} from "@angular/core";

import { ItemListService } from "../services/item-list.service";
import { ACTIVE_OPTION_CLASS } from "../constants/autocomplete.constants";

@Directive({
    selector: '[cmpl-option]',
    host: {
        '(mouseenter)': 'onMouseEnter()',
        '(mouseleave)': 'onMouseLeave()'
    }
})
export class OptionDirective {
    @Input('itemIndex') index;

    constructor(private itemListService: ItemListService) {
    }

    onMouseEnter(event: MouseEvent) {
        this.itemListService.activeIndex = this.index;
    }

    onMouseLeave(event: MouseEvent) {
        if (this.itemListService.activeIndex === this.index) {
            this.itemListService.resetActiveIndex();
        }
    }
}