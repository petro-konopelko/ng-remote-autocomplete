import { Observable } from "rxjs/Observable";

export interface AutocompleteSourceService {
    get(searchParam: string): Observable<any[]>;
}