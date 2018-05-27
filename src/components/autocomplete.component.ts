import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    ContentChild,
    TemplateRef,    OnDestroy,
    forwardRef,    ViewChild,
    ElementRef} from "@angular/core";

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

import { Subscription } from 'rxjs/Rx';

import { AutocompleteItem } from "../interfaces/autocomplete.item";

import {
    DEFAULT_MAX_CHARS,
    DEFAULT_MIN_SEARCH_LENGTH,
    DEFAULT_PAUSE,
    NOT_FOUND_TEXT,
    SEARCHING_TEXT,
    DEFAULT_ACTIVE_INDEX,
    OPTION_LIST_WRAPPER_CLASS,
    OPTION_CLASS,
    OPTION_VALUE_CLASS,
    OPTION_DESCRIPTION_CLASS,
    LOADING_CLASS,
    RESULTS_NOT_FOUND_CLASS
} from "../constants/autocomplete.constants";

import { SearchStateType } from "../enums/search-state.type";
import { OptionTemplateDirective } from "../directives/option-template.directive";
import { ItemListService } from "../services/item-list.service";
import { AutocompleteSourceService } from "../interfaces/autocomplete-source.service";
import { AutocompleteService } from "../services/autocomplete.service";
import { Autocomplete } from "../interfaces/autocomplete";

@Component({
    selector: 'remote-autocomplete',
    templateUrl: './autocomplete.component.html',
    providers: [
        AutocompleteService,
        ItemListService,
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => RemoteAutocompleteComponent),
            multi: true
        }
    ]
})

export class RemoteAutocompleteComponent implements OnInit, OnDestroy, ControlValueAccessor, Autocomplete {
    @Input('service') service: AutocompleteSourceService;
    @Input('minSearchLength') minChars: number;
    @Input('maxChars') maxChars: number;
    @Input('pause') pause: number;
    @Input('inputId') inputId: string;
    @Input('inputName') inputName: string;
    @Input('inputClass') inputClasses: string[];
    @Input('disabled') disabled: boolean;
    @Input('notFoundText') notFoundText: string;
    @Input('searchingText') searchingText: string;

    @Output('highlighted') highlighted: EventEmitter<any> = new EventEmitter<any>();
    @Output('selected') selected: EventEmitter<any> = new EventEmitter<any>();
    @Output('blur') blur: EventEmitter<Event> = new EventEmitter<Event>();

    //custom template
    @ContentChild(OptionTemplateDirective, { read: TemplateRef }) optionTemplate: TemplateRef<any>;

    @ViewChild('input') inputField: ElementRef;

    public searchStates = SearchStateType;
    public searchState = SearchStateType.UnTracked;
    public searchValue: string;
    public searchResult: AutocompleteItem[];
    public OPTION_LIST_WRAPPER_CLASS: string = OPTION_LIST_WRAPPER_CLASS;
    public OPTION_CLASS: string = OPTION_CLASS;
    public OPTION_VALUE_CLASS: string = OPTION_VALUE_CLASS;
    public OPTION_DESCRIPTION_CLASS: string = OPTION_DESCRIPTION_CLASS;
    public LOADING_CLASS: string = LOADING_CLASS;
    public RESULTS_NOT_FOUND_CLASS: string = RESULTS_NOT_FOUND_CLASS;

    private typingTimeout: number;
    private originalSearchValue: string;
    private changedHighlightSubscription: Subscription;
    private selectSubscription: Subscription;
    private propagateChange = (_: any) => { };
    private propagateTouched = (_: any) => { };

    constructor(public itemListService: ItemListService,
        public autocompleteService: AutocompleteService) {
    }

    ngOnInit(): void {
        if (!this.service) {
            throw new Error("AutocompleteService must be implemented");
        }

        this.minChars = this.minChars || DEFAULT_MIN_SEARCH_LENGTH;
        this.maxChars = this.maxChars || DEFAULT_MAX_CHARS;
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
            this.close();
        });
    }

    ngOnDestroy(): void {
        this.changedHighlightSubscription.unsubscribe();
        this.selectSubscription.unsubscribe();
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
        this.propagateTouched = fn;
    }

    onType(): void{
        this.propagateChange(this.searchValue);
        this.originalSearchValue = this.searchValue;

        if (this.validsearchTerm()) {
            this.searchState = this.searchStates.Loading;
        } else {
            this.close();
        }

        this.resetSearchTimeout();
    }

    onInputBlur(event: FocusEvent) {
        if (event.relatedTarget) {
            let related = <HTMLElement>event.relatedTarget;
            if (related.classList.contains(this.OPTION_CLASS)) {
                return;
            }
        }

        this.propagateTouched(this.searchValue);
        this.close();
        this.blur.emit();
    }

    get inputClass(): string {
        let classes: string = '';

        if (this.inputClasses) {
            classes = this.inputClasses.join(' ');
        }

        return classes;
    }

    private onActiveIndexChanged(activeIndex: number): void {
        let highlightedItem: AutocompleteItem;

        if (activeIndex === DEFAULT_ACTIVE_INDEX) {
            highlightedItem = null;
            this.searchValue = this.originalSearchValue;
        } else {
            highlightedItem = this.searchResult[activeIndex];
            this.searchValue = highlightedItem.value;
        }

        this.propagateChange(this.searchValue);
        this.highlighted.emit(highlightedItem);
    }

    focus() {
        (<HTMLInputElement>this.inputField.nativeElement).focus();
    }

    open() {
        this.onType();
    }

    close() {
        this.autocompleteService.isOpen = false;
        this.searchState = this.searchStates.UnTracked;
    }

    private resetSearchTimeout() {
        this.clearSearchTimeout();
        this.setSearchTimeout();
    }

    private setSearchTimeout() {
        this.typingTimeout = setTimeout(this.search.bind(this), this.pause);
    }

    private clearSearchTimeout() {
        clearTimeout(this.typingTimeout);
    }

    private search() {
        if (this.validsearchTerm()) {
            this.service.get(this.searchValue).first().subscribe(
                (results: any[]) => {
                    if (this.searchState !== this.searchStates.UnTracked) {
                        this.itemListService.items = results;
                        this.searchResult = results;
                        this.searchState = this.searchStates.Finished;
                    }
                }
            );
        }
    }

    private validsearchTerm() {
        return this.searchValue && this.searchValue.length >= this.minChars;
    }
}