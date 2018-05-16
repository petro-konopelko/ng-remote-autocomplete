import { Injectable } from "@angular/core";

@Injectable()
export class ItemListService {
    private readonly _defaultActiveIndex = -1;
    private _activeIndex: number = this._defaultActiveIndex;

    set activeIndex(index: number) {
        this._activeIndex = index;
    }

    get activeIndex(): number {
        return this._activeIndex;
    }

    resetActiveIndex(): void {
        this._activeIndex = this._defaultActiveIndex;
    }
}