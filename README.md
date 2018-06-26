
# ng-remote-autocomplete

The package is a remote autocomplete.

### Installation

The package requires Angular 5+ to run.

```sh
$ npm i ng-remote-autocomplete
```

### Usage

In order to use the remote autocomplete you need to:

 - add **RemoteAutocompleteModule** And **FormsModule** to the Module you want to use in.

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { AppComponent } from './app.component';
import { RemoteAutocompleteModule } from "ng-remote-autocomplete";

@NgModule({
  imports: [
      BrowserModule,
      FormsModule,
      RemoteAutocompleteModule
  ],
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
```
 - implement ***get*** method of **AutocompleteSourceService** which returns array of **AutocompleteItem**

```ts
import { Observable } from "rxjs/Rx";
import { } from "rxjs/Rx";

import { AutocompleteItem } from "ng-remote-autocomplete";
import { AutocompleteSourceService } from "ng-remote-autocomplete";

export class ItemService implements AutocompleteSourceService {
  get(searchParam: string): Observable<AutocompleteItem[]> {
    let fakeResult:AutocompleteItem[]  = [
        {value: "A", description: " - One letter", originalObject: {}},
     ];

    return Observable.of(fakeResult).delay(150);
  }
}
```
- provide the sevice to the **remote-autocomplete** component as a parameter
```ts
import { Component } from  '@angular/core';
import { ItemService } from  './services/itm-service';

@Component({
selector:  'app-root',
template:  `<remote-autocomplete [service]="itemService"></remote-autocomplete>`,
providers: [ ItemService ]
})
export  class  AppComponent {
constructor(public  itemService:  ItemService) {
}
```
If you don't provide the service then the module will throw and Exception that **AutocompleteSourceService** must be provided.

### Api

|Property Name|Description |Type|Required|Default value|
| ------ | ------ |------ |------ |------ |
| service | Implementation of **AutocompleteSourceService**  | AutocompleteSourceService | true
| minSearchLength | Minimum value length from which searching will be triggered | number | false|1
| maxChars | Allowable max length of search field | number | false | 2147483647|
| pause | The pause after which searching will be triggered  |number|false|100|
| inputId | The id for the input |string|false|-|
| inputName | The name for the input |string|false|-|
| inputClass | The array of string for the input |string[]|false|-|
| placeholder | The text to be placed as placeholder |string|false|-|
|disabled|The property if input should be disabled|boolean|false|false|
|notFoundText|The text which will be displayed if there is no result|string|false|"No results found"|
|searchingText|The text which will be displayed during the search|string|false|"Searching..."|

### Output events

|Event Name|Type|Description|
| ------ | ------ |------ |
| type | - | The type event on the input |
| highlighted | AutocompleteItem or null | The event is triggered when an option is higlighted with AutocompleteItem item or nul when it is unhighlighted |
| selected | AutocompleteItem  | The event is triggered when an option is selected |
| blur | FocusEvent  | **Important:** isn't fired when option is being selected and input loses focus|

### Available classes
|Class|Description|
| ------ | ------ |
| .remote-autocomplete | The main class of the **whole component**  |
| .autocomplete-search-wrapper | The class of the div which contains **loading, not found and otptions divs**  |
| .option-list-wrapper | The class of the **main div where options are placed** |
|.autocomplete-option|The class of an **option**|
| .autocomplete-option-active | The class of the **highlighted option**  |
| .autocomplete-option-value | The class of the span where **value** is placed  |
| .autocomplete-option-description| The class of the span where **description** is placed  |
|.autocomplete-loading|The class of the span where **loading text** is shown|
|.autocomplete-not-found|The class of the span where **searching text** is shown|

### Available methods
The local reference of the **remote-autocomplete** component is a type of **Autocomplete** and provides the following methods:

|Method|Description|
| ------ | ------ |
| focus()|Set the focus to the input field|
| open()|open the autocomplete where search parameters will be the current value, won't be open if the length of the current value is less than **minSearchLength** value.|
|close() |close the autocomplete|

```ts
import { Component } from  '@angular/core';
import { ItemService } from  './services/itm-service';

@Component({
selector:  'app-root',
template:  `<remote-autocomplete [service]="itemService" #autocomplete></remote-autocomplete>`,
providers: [ ItemService ]
})
export  class  AppComponent {

@ViewChild('autocomplete') autocompleteField:  Autocomplete;
constructor(public  itemService:  ItemService) {
}

focus(){
this.autocompleteField.focus();
}
}
```
### Template
The basic template will be used as default:
```html
 <ng-template #defaultOptionTemplate>
    <span class="autocomplete-option-value">{{item.value}}</span>
    <span *ngIf="item.description" class="autocomplete-option-description">{{item.description}}</span>
</ng-template>
```
If you want to use some custom template you need to put this custom template into the **remote-autocomplete** component with ***remote-autocomplete-option-tmpl*** directive where ***item*** is a type of **AutocompleteItem**.
```html
<remote-autocomplete [service]="itemService">
	<div *remote-autocomplete-option-tmpl="let item">
		<span>{{item.value}}</span>
	</div>
</remote-autocomplete>
```
### ngModel
You can bind the value to the **remote-autocomplete** component as in example. If the value is defined on the moment of the initialization of your component then the bind value will be set to the input field.
```ts
import { Component } from  '@angular/core';
import { ItemService } from  './services/itm-service';

@Component({
selector:  'app-root',
template:  `<remote-autocomplete [service]="itemService" [(ngModel)]="value"></remote-autocomplete>`,
providers: [ ItemService ]
})
export  class  AppComponent {
private value: string = 'test';

constructor(public  itemService:  ItemService) {
}
```

### License
**MIT**