import { Injectable } from "@angular/core";

@Injectable()
export class AutocompleteService {
    get isOpen(): boolean {
        return true;
    }
}