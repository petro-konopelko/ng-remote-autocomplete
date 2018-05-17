import { Observable } from "rxjs/Observable";

import { AutocompleteItem } from "./autocomplete.item";

export interface AutocompleteSourceService {
    get(searchParam: string): Observable<AutocompleteItem[]>;
}