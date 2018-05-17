import { Injectable } from "@angular/core";

import { AutocompleteService } from "./autocomplete.service";
import { DEFAULT_ACTIVE_INDEX } from "../constants/autocomplete.constants";
import { AutocompleteItem } from "../interfaces/autocomplete.item";

@Injectable()
export class ItemListService {
    constructor(private autocompleteService: AutocompleteService) {
    }

    private _activeIndex: number = DEFAULT_ACTIVE_INDEX;

    public items: AutocompleteItem[] = [];

    set activeIndex(index: number) {
        if (this.autocompleteService.isOpen) {
            if (index >= this.items.length) {
                this.restoreIntialActiveIndex();
                return;
            }


            if (index < DEFAULT_ACTIVE_INDEX) {
                this._activeIndex = this.items.length - 1;
                this.autocompleteService.changedHighlightItemSubject.next(this._activeIndex);
                return;
            }

            this._activeIndex = index;
            this.autocompleteService.changedHighlightItemSubject.next(this._activeIndex);
        }
    }

    get activeIndex(): number {
        return this._activeIndex;
    }

    restoreIntialActiveIndex(): void {
        this._activeIndex = DEFAULT_ACTIVE_INDEX;
        this.autocompleteService.changedHighlightItemSubject.next(this._activeIndex);
    }
}