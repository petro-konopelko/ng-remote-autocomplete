import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AutocompleteConponent } from "./components/autocomplete.component";
import { OptionTemplateDirective } from "./directives/option-template.directive";
import { OptionDirective } from "./directives/option-directve";
import { ArrowNavigationDirective } from "./directives/arrow-navigation.directive";
import { ItemListService } from "./services/item-list.service";

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        AutocompleteConponent,
        OptionTemplateDirective,
        OptionDirective,
        ArrowNavigationDirective
    ],
    exports: [
        AutocompleteConponent,
        OptionTemplateDirective
    ],
    providers: [
        ItemListService
    ]
})
export class AutocompleteModule {
}