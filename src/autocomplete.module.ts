import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';

import { AutocompleteConponent } from "./components/autocomplete.component";
import { OptionTemplateDirective } from "./directives/label.directive";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        AutocompleteConponent,
        OptionTemplateDirective
    ],
    exports: [
        AutocompleteConponent,
        OptionTemplateDirective
    ]
})
export class AutocompleteModule {
}