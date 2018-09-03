import { Observable } from "rxjs/Observable";

import { AutocompleteItem } from "./autocomplete.item";

export interface ParameterizedAutocompleteSourceService {
    getWithParams(searchValue: string, searchParameters: any): Observable<AutocompleteItem[]>;
}