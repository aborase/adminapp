import { SafePipe } from "./IframeSanitizer";
import { NgModule } from "@angular/core";

@NgModule({
    imports: [],
    declarations: [SafePipe],
    exports: [SafePipe]
})
export class IFrameSanitizerModule { }