import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter
} from "@angular/core";

import { AutocompleteService } from "../interfaces/autocomplete.service";
import { AutocompleteItem } from "../interfaces/autocomplete.item";

import {
    DEFAULT_MIN_SEARCH_LENGTH,
    DEFAULT_PAUSE,    NOT_FOUND_TEXT,
    SEARCHING_TEXT
} from "../constants/autocomplete.constants";
import { SearchStateType } from "../enums/search-state.type";

@Component({
    selector: 'my-autocomplete',
    templateUrl: './autocomplete.component.html'
})

export class AutocompleteConponent implements OnInit {
    @Input('service') service: AutocompleteService;
    @Input('display') displayFormat: (item: any) => AutocompleteItem;
    @Input('minChars') minChars: number;
    @Input('pause') pause: number;
    @Input('inputId') inputId: string;
    @Input('inputName') inputName: string;
    @Input('inputClass') inputClasses: string[];
    @Input('notFoundText') notFoundText: string;
    @Input('searchingText') searchingText: string;

    @Output('selected') selected: EventEmitter<any> = new EventEmitter<any>();
    @Output('blur') blur: EventEmitter<Event> = new EventEmitter<Event>();

    public searchResult: any[];
    public searchStates = SearchStateType;
    public searchState = SearchStateType.UnTracked;

    ngOnInit() {
        if (!this.service) {
            throw new Error("AutocompleteService must be implemented");
        }

        this.minChars = this.minChars || DEFAULT_MIN_SEARCH_LENGTH;
        this.pause = this.pause || DEFAULT_PAUSE;
        this.notFoundText = this.notFoundText || NOT_FOUND_TEXT;
        this.searchingText = this.searchingText || SEARCHING_TEXT;
    }

    get inputClass(): string {
        let classes: string = null;

        if (this.inputClasses) {
            classes = this.inputClasses.join(' ');
        }

        return classes;
    }
}