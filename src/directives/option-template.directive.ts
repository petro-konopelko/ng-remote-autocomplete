import { Directive, TemplateRef } from "@angular/core";

@Directive({
    selector: '[option-tmp]'
})
export class OptionTemplateDirective {
    constructor(public template: TemplateRef<any>) {
    }
}