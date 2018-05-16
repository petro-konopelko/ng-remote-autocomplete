import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    ContentChild,
    TemplateRef
} from "@angular/core";

import { Observable } from "rxjs/Observable";
import { } from 'rxjs/Rx';

import { AutocompleteItem } from "../interfaces/autocomplete.item";

import {
    DEFAULT_MIN_SEARCH_LENGTH,
    DEFAULT_PAUSE,
    NOT_FOUND_TEXT,
    SEARCHING_TEXT
} from "../constants/autocomplete.constants";

import { SearchStateType } from "../enums/search-state.type";
import { OptionTemplateDirective } from "../directives/option-template.directive";
import { ItemListService } from "../services/item-list.service";
import { AutocompleteSourceService } from "../interfaces/autocomplete-source.service";

@Component({
    selector: 'remote-autocomplete',
    templateUrl: './autocomplete.component.html',
    styles: [ './autocomplete.component.css' ]
})

export class AutocompleteConponent implements OnInit {
    @Input('service') service: AutocompleteSourceService;
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

    //custom template
    @ContentChild(OptionTemplateDirective, { read: TemplateRef }) optionTemplate: TemplateRef<any>;

    public searchResult: any[];
    public searchStates = SearchStateType;
    public searchState = SearchStateType.UnTracked;
    public searchValue: string;

    constructor(private itemListService: ItemListService) {
    }

    ngOnInit() {
        if (!this.service) {
            throw new Error("AutocompleteService must be implemented");
        }

        this.minChars = this.minChars || DEFAULT_MIN_SEARCH_LENGTH;
        this.pause = this.pause || DEFAULT_PAUSE;
        this.notFoundText = this.notFoundText || NOT_FOUND_TEXT;
        this.searchingText = this.searchingText || SEARCHING_TEXT;
        this.displayFormat = this.displayFormat || this.defaultDisplayFormat;
    }

    onKeypress(): void{
        this.searchState = this.searchStates.Loading;

        this.service.get(this.searchValue).first().subscribe(
            (results: any) => {
                this.searchResult = results;
                this.searchState = this.searchStates.Finished;
            }
        )
    }

    onMouseEnter(item: any): void{
       let value = this.displayFormat(item).value;
       this.searchValue = value;
    }

    get inputClass(): string {
        let classes: string = '';

        if (this.inputClasses) {
            classes = this.inputClasses.join(' ');
        }

        return classes;
    }

    private defaultDisplayFormat(item: any): AutocompleteItem {
        return {
            value: item,
            description: item,
            originalObject: item
        };
    }
}