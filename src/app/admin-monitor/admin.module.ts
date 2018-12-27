import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { KWService } from "./service/KWService";
import { AdminComponent } from "./admin.component";
import { AdminRoutingModule } from "./admin-routing.module";
import {TableModule} from 'primeng/table';
import { FormsModule }   from '@angular/forms';
import {DropdownModule} from 'primeng/dropdown';

@NgModule({
  declarations: [
    AdminComponent
  ],
  imports: [
    TableModule, FormsModule,CommonModule,
    Ng4LoadingSpinnerModule.forRoot(),AdminRoutingModule, DropdownModule
  ],
  providers: [KWService],  
 
})
export class AdminModule { }
