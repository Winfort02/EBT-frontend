import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { Table } from "../table/table";
import { UserService } from '@/services/user.service';
import { User } from '@/models';
import { Subscription } from 'rxjs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserForm } from '../shared/user-form';
import { Footer } from 'primeng/api';


@Component({
  standalone: true,
  selector: 'app-users',
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule,
    Table
],
providers: [DialogService],
  template: `<div class="w-full">
      <p-toolbar styleClass="mb-6">
            <ng-template #start>
                  <p-button label="New" icon="pi pi-plus" severity="secondary" class="mr-2"/>
                  <p-button severity="secondary" label="Delete" icon="pi pi-trash" outlined  />
            </ng-template>

            <ng-template #end>
                  <p-button label="Export" icon="pi pi-upload" severity="secondary"/>
            </ng-template>
      </p-toolbar>
      <app-table [cols]="cols" [actionButton]="actionButton" [showActionBtn]="showActionBtn" [items]="users" (actionBtn)="onActionButtonClick($event)"/>
</div>`,
})
export class Users implements OnInit, OnDestroy {
      cols = signal<any>([
            { field: 'name', header: 'Name'},
            { field: 'email', header: 'Email'},
            { field: 'role_name', header: 'Role'},
            { field: 'createdAt', header: 'Date Created'},
      ])
      actionButton = {
            edit: 'Edit',
            delete: 'Delete',
      };
      showActionBtn = {
            edit: true,
            delete: true,
      };
      users = signal<User[]>([]);
      
      subscriptions!: Subscription;
      dialogRef!: DynamicDialogRef;

      constructor(
            private readonly userService: UserService,
            private readonly dialogService: DialogService) {}

      ngOnInit(): void { 

            this.subscriptions = this.userService.getUsers().subscribe(response => {
                  const user = response?.data as unknown as User[];
                  const data = user.map((u) => (({
                        ...u,
                        role_name: u.role?.role || ''
                  })));
                  this.users.set(data);
            });

      }

      ngOnDestroy(): void {
            this.subscriptions && this.subscriptions.unsubscribe();
      }

      onActionButtonClick(event: any) {
            this.dialogRef = this.dialogService.open(UserForm, {
                  header: 'User Details',
                  width: '25vw',
                  position: 'top',
                  modal: true,
                  closable: true,
                  contentStyle: { overflow: 'auto' },
                  breakpoints: {
                        '960px': '75vw',
                        '640px': '90vw'
                  },
                  data: event?.data ?? null
            });

            this.dialogRef.onClose.subscribe(data => {
                  if (data) {
                        const user = {
                              ...data,
                              id: event?.data?.id ?? null
                        } as User

                        console.log(user);
                        this.onUpdateUser(user);
                  }
            });
      }

      onUpdateUser(user: User) {
            this.userService.updateUser(user.id as number, user).subscribe({
                  next: (response) => {
                        console.log(response)
                  },
                  error: (error) => {
                        console.log(error)
                  }
            })
      }
}
