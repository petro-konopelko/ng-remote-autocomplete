import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RemoteAutocompleteComponent } from "./components/autocomplete.component";
import { OptionTemplateDirective } from "./directives/option-template.directive";
import { OptionDirective } from "./directives/option-directve";
import { ItemListService } from "./services/item-list.service";
import { KeyboardNavigationDirective } from "./directives/keyboard-navigation.directive";
import { AutocompleteService } from "./services/autocomplete.service";

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        RemoteAutocompleteComponent,
        OptionTemplateDirective,
        OptionDirective,
        KeyboardNavigationDirective
    ],
    exports: [
        RemoteAutocompleteComponent,
        OptionTemplateDirective
    ],
})
export class AutocompleteModule {
}