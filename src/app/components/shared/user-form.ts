import { Component, OnInit  } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { PasswordModule } from 'primeng/password';


@Component({
   standalone: true,
   selector: 'app-user-form',
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
            <p-select
               [options]="options"
               optionLabel="label"
               optionValue="value"
               placeholder="Select Role"
               styleClass="w-full"
               [filter]="false"
               filterBy="label"
               formControlName="roleId"
            />
         </div>
         @if(!editMode) {
         <div class="w-full flex flex-col gap-2">
            <label for="password1" class="px-1">Password</label>
            <p-password id="password1" formControlName="password" placeholder="Password" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>
         </div>
         }
      </div>
      <div class="w-full mt-5 pb-5">
         <p-button label="Save" icon="pi pi-save" styleClass="w-full" [disabled]="userForm.invalid" (onClick)="onSave()"/>
      </div>
   </form>`,
   imports: [ReactiveFormsModule, InputTextModule, ButtonModule, SelectModule, SelectModule, PasswordModule]
})
export class UserForm implements OnInit {
   options = [
      { label: 'Admin', value: 1 },
      { label: 'Employee', value: 2 },
   ];
   editMode = false;
    constructor(
      private readonly dialogRef: DynamicDialogRef,
      private readonly diaglogConfig: DynamicDialogConfig) {}

    userForm!:FormGroup;

    ngOnInit(): void {
      this.editMode = this.diaglogConfig?.data ?? false;
       const data = this.diaglogConfig?.data ?? null;
       this.userForm = new FormGroup({
         email: new FormControl(data?.email ?? null),
         displayName: new FormControl(data?.displayName ?? null),
         roleId: new FormControl({ value: data?.roleId, disabled: data }),
         password: new FormControl({ value: null, disabled: data })
       });
    }

    onSave() {
      this.dialogRef.close(this.userForm.getRawValue());
    }
}  