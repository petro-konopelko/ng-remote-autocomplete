import {
    Directive,
    HostListener
} from "@angular/core";

import { ItemListService } from "../services/item-list.service";
import { KeyCode } from "../enums/key-kode";

@Directive({
    selector: '[arrow-navigation]'
})
export class ArrowNavigationDirective {
    constructor(private itemListService: ItemListService) {
    }

    @HostListener('keydown', ['$event']) onKeydown(event: KeyboardEvent) {
        let key = event.which || event.keyCode;

        switch (key) {
            case KeyCode.DownArrow:
                this.handleDownKey();
                break;
        }
    }


    private handleDownKey() {
        if (this.itemListService.activeIndex >= 0) {
            this.itemListService.activeIndex++;
        }
    }
}