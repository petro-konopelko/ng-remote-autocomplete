import { Observable } from "rxjs/Observable";

export interface AutocompleteService {
    get(searchParam: string): Observable<any[]>;
}