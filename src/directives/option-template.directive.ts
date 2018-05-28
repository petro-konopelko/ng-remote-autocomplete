import { Directive, TemplateRef } from "@angular/core";

@Directive({
    selector: '[remote-autocomplete-option-tmpl]'
})
export class OptionTemplateDirective {
    constructor(public template: TemplateRef<any>) {
    }
}