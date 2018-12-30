import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import {TableModule} from 'primeng/table';
import { FormsModule }   from '@angular/forms';
import {DropdownModule} from 'primeng/dropdown';
import { LogInService } from "./service/log-in";
import { LogInComponent } from "./log-in.component";
import { LogInRoutingModule } from "./login-routing.module";

@NgModule({
  declarations: [
    LogInComponent
  ],
  imports: [
    TableModule, FormsModule,CommonModule,
    Ng4LoadingSpinnerModule.forRoot(),LogInRoutingModule, DropdownModule
  ],
  providers: [],  
 
})
export class LogInModule { }
