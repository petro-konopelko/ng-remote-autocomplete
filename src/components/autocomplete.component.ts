import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    ContentChild,
    TemplateRef,    OnDestroy,
    forwardRef
} from "@angular/core";

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

import { Subscription } from 'rxjs/Rx';

import { AutocompleteItem } from "../interfaces/autocomplete.item";

import {
    DEFAULT_MIN_SEARCH_LENGTH,
    DEFAULT_PAUSE,
    NOT_FOUND_TEXT,
    SEARCHING_TEXT,
    DEFAULT_ACTIVE_INDEX
} from "../constants/autocomplete.constants";

import { SearchStateType } from "../enums/search-state.type";
import { OptionTemplateDirective } from "../directives/option-template.directive";
import { ItemListService } from "../services/item-list.service";
import { AutocompleteSourceService } from "../interfaces/autocomplete-source.service";
import { AutocompleteService } from "../services/autocomplete.service";

@Component({
    selector: 'remote-autocomplete',
    templateUrl: './autocomplete.component.html',
    styles: ['./autocomplete.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AutocompleteConponent),
            multi: true
        }
    ]
})

export class AutocompleteConponent implements OnInit, OnDestroy, ControlValueAccessor {
    @Input('service') service: AutocompleteSourceService;
    @Input('minChars') minChars: number;
    @Input('pause') pause: number;
    @Input('inputId') inputId: string;
    @Input('inputName') inputName: string;
    @Input('inputClass') inputClasses: string[];
    @Input('notFoundText') notFoundText: string;
    @Input('searchingText') searchingText: string;

    @Output('highlighted') highlighted: EventEmitter<any> = new EventEmitter<any>();
    @Output('selected') selected: EventEmitter<any> = new EventEmitter<any>();
    @Output('blur') blur: EventEmitter<Event> = new EventEmitter<Event>();

    //custom template
    @ContentChild(OptionTemplateDirective, { read: TemplateRef }) optionTemplate: TemplateRef<any>;

    public searchStates = SearchStateType;
    public searchState = SearchStateType.UnTracked;
    public searchValue: string;
    public searchResult: AutocompleteItem[];

    private oriiginalSearchValue: string;
    private changedHighlightSubscription: Subscription;
    private selectSubscription: Subscription;
    private propagateChange = (_: any) => { };

    constructor(public itemListService: ItemListService,
        public autocompleteService: AutocompleteService) {
    }

    ngOnInit(): void {
        if (!this.service) {
            throw new Error("AutocompleteService must be implemented");
        }

        this.minChars = this.minChars || DEFAULT_MIN_SEARCH_LENGTH;
        this.pause = this.pause || DEFAULT_PAUSE;
        this.notFoundText = this.notFoundText || NOT_FOUND_TEXT;
        this.searchingText = this.searchingText || SEARCHING_TEXT;

        this.changedHighlightSubscription = this.autocompleteService.changedHighlightItemSubject.subscribe((index: number) => {
            this.onActiveIndexChanged(index);
        });

        this.selectSubscription = this.autocompleteService.selectItemSubject.subscribe((index: number) => {
            const result = this.searchResult[index];
            this.propagateChange(result.value);
            this.selected.emit(result);
            this.autocompleteService.isOpen = false;
            this.searchState = this.searchStates.UnTracked;
        });
    }

    ngOnDestroy(): void {
        this.changedHighlightSubscription.unsubscribe();
        this.selectSubscription.unsubscribe();
    }

    onType(): void{
        this.propagateChange(this.searchValue);
        this.oriiginalSearchValue = this.searchValue;
        this.searchState = this.searchStates.Loading;

        this.service.get(this.searchValue).first().subscribe(
            (results: any[]) => {
                if (this.searchState !== this.searchStates.UnTracked) {
                    this.autocompleteService.isOpen = results.length > 0;
                    this.itemListService.items = results;
                    this.searchResult = results;
                    this.searchState = this.searchStates.Finished;
                }
            }
        )
    }

    writeValue(value: any) {
        if (value !== undefined) {
            this.searchValue = value;
        }
    }

    registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any) {
    }

    get inputClass(): string {
        let classes: string = '';

        if (this.inputClasses) {
            classes = this.inputClasses.join(' ');
        }

        return classes;
    }

    private onActiveIndexChanged(activeIndex: number): void {

        if (activeIndex === DEFAULT_ACTIVE_INDEX) {
            this.searchValue = this.oriiginalSearchValue;
            this.propagateChange(this.searchValue);
            this.highlighted.emit(null);

        } else {
            const highlightedItem = this.searchResult[activeIndex];
            this.searchValue = highlightedItem.value;
            this.propagateChange(highlightedItem.value);
            this.highlighted.emit(highlightedItem);
        }
    }
}