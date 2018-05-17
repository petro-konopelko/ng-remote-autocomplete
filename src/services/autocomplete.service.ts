import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";

@Injectable()
export class AutocompleteService {
    public changedHighlightItemSubject: Subject<number> = new Subject<number>();
    public selectItemSubject: Subject<number> = new Subject<number>();

    private _isOpen: boolean = false;

    set isOpen(value: boolean) {
        this._isOpen = value;
    }

    get isOpen(): boolean {
        return this._isOpen;
    }
}