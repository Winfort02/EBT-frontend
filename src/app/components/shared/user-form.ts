import { Component, OnInit  } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';


@Component({
   standalone: true,
   selector: 'app-users',
   template: `
   <form class="w-full px-3 " [formGroup]="userForm">
      <div class="w-full flex flex-col gap-2">
         <div class="w-full flex flex-col gap-2">
            <label for="email" class="px-1">Email</label>
            <input type="text" pInputText formControlName="email" required fluid />
         </div>
         <div class="w-full flex flex-col gap-2">
            <label for="displayName" class="px-1">Display Name</label>
            <input type="text" pInputText formControlName="displayName" required fluid />
         </div>
         <div class="w-full flex flex-col gap-2">
            <label for="role" class="px-1">Role</label>
            <input type="text" pInputText formControlName="role" required fluid />
         </div>
      </div>
      <div class="w-full mt-5 pb-5">
         <p-button label="Save" icon="pi pi-save" styleClass="w-full" [disabled]="userForm.invalid" (onClick)="onSave()"/>
      </div>
   </form>`,
   imports: [ReactiveFormsModule, InputTextModule, ButtonModule ]
})
export class UserForm implements OnInit {
    constructor(
      private readonly dialogRef: DynamicDialogRef,
      private readonly diaglogConfig: DynamicDialogConfig) {}

    userForm!:FormGroup;

    ngOnInit(): void {
       const data = this.diaglogConfig?.data ?? null;
       this.userForm = new FormGroup({
         email: new FormControl(data?.email ?? null),
         displayName: new FormControl(data?.name ?? null),
         role: new FormControl({ value: data?.role?.role ?? null, disabled: true }),
       });

    }

    onSave() {
      const { email, displayName } = this.userForm.getRawValue();
      this.dialogRef.close({ email, displayName });
    }
}  