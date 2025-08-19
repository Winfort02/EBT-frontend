import { Component, OnInit  } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { PasswordModule } from 'primeng/password';


@Component({
   standalone: true,
   selector: 'app-person-form',
   template: `
   <form class="w-full px-3 " [formGroup]="personForm">
      <div class="w-full flex flex-col gap-2">
         <div class="w-full flex flex-col gap-2">
            <label for="email" class="px-1">Full Name</label>
            <input type="text" pInputText formControlName="fullName" required fluid />
         </div>
         <div class="w-full flex flex-col gap-2">
            <label for="displayName" class="px-1">Phone number</label>
            <input type="text" pInputText formControlName="phoneNumber" required fluid />
         </div>
         <div class="w-full flex flex-col gap-2">
            <label for="displayName" class="px-1">Address</label>
            <input type="text" pInputText formControlName="address" required fluid />
         </div>
      </div>
      <div class="w-full mt-5 pb-5">
         <p-button label="Save" icon="pi pi-save" styleClass="w-full" [disabled]="personForm.invalid" (onClick)="onSave()"/>
      </div>
   </form>`,
   imports: [ReactiveFormsModule, InputTextModule, ButtonModule, SelectModule, SelectModule, PasswordModule]
})
export class PersonForm implements OnInit {
    
   editMode = false;
    constructor(
      private readonly dialogRef: DynamicDialogRef,
      private readonly diaglogConfig: DynamicDialogConfig) {}

    personForm!:FormGroup;

    ngOnInit(): void {
      this.editMode = this.diaglogConfig?.data ?? false;
       const data = this.diaglogConfig?.data ?? null;
       this.personForm = new FormGroup({
         fullName: new FormControl(data?.fullName ?? null),
         phoneNumber: new FormControl(data?.phoneNumber ?? null),
         address: new FormControl(data?.Address ?? null),
       });
    }

    onSave() {
      this.dialogRef.close(this.personForm.getRawValue());
    }
}  