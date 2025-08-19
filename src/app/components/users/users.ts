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
import { ConfirmationService, MessageService } from 'primeng/api';


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
providers: [DialogService, ConfirmationService, MessageService],
  template: `<div class="w-full">
      <p-toast position="bottom-left"/>
      <p-confirmdialog key="user-dialog" />
      <p-toolbar styleClass="mb-6">
            <ng-template #start>
                 <label for="user-list" class="text-primary indent-2 font-bold">{{'User List Table' | uppercase }}</label>
            </ng-template>

            <ng-template #end>
                   <p-button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="onCreateUser()"/>
            </ng-template>
      </p-toolbar>
      <app-table [cols]="cols" [actionButton]="actionButton" [showActionBtn]="showActionBtn" [items]="users" (actionBtn)="onActionButtonClick($event)"/>
</div>`,
})
export class Users implements OnInit, OnDestroy {
      cols = signal<any>([
            { field: 'displayName', header: 'Name'},
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
            private readonly dialogService: DialogService,
            private confirmService: ConfirmationService,
            private messageService: MessageService) {}

      ngOnInit(): void { 
            this.onLoadUsers();
      }

      onLoadUsers() {
            this.subscriptions = this.userService.getUsers().subscribe(response => {
            const user = response?.data as unknown as User[];
            const data = user.map((u) => (({
                  ...u,
                  role_name: u.role?.role || ''
            })));
            this.users.set(data);
            })  
      }

      ngOnDestroy(): void {
            this.subscriptions && this.subscriptions.unsubscribe();
      }

      onActionButtonClick(event: any) {
            if (event && event.type == 'delete') {
                  this.onDelete(event.data.id);
            } else {
                  this.dialogRef = this.dialogService.open(UserForm, {
                        header: 'User Details',
                        width: '568px',
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
                                    email: data?.email ?? null,
                                    displayName: data?.displayName ?? null,
                                    id: event?.data?.id ?? null
                              } as User
                              this.onUpdateUser(user);
                        }
                  });
            }
      }

      onUpdateUser(user: User) {
            this.userService.updateUser(user.id as number, user).subscribe(() => this.onLoadUsers());
      }

      onCreateUser() {
            this.dialogRef = this.dialogService.open(UserForm, {
                  header: 'User Details',
                  width: '568px',
                  position: 'top',
                  modal: true,
                  closable: true,
                  contentStyle: { overflow: 'auto' },
                  breakpoints: {
                        '960px': '75vw',
                        '640px': '90vw'
                  },
                  data: null
            });

            this.dialogRef.onClose.subscribe(data => {
                 if(data) {
                  this.userService.createUser(data).subscribe(() => this.onLoadUsers());
                 }
            });
      }

      onDelete(id: number) {
            this.confirmService.confirm({
                  key: "user-dialog",
                  message: 'Do you want to delete this record?',
                  header: 'Delete Confirmation',
                  icon: 'pi pi-info-circle',
                  position: 'top',
                  rejectLabel: 'Cancel',
                  rejectButtonProps: {
                        label: 'Cancel',
                        severity: 'secondary',
                        outlined: true,
                  },
                  acceptButtonProps: {
                        label: 'Delete',
                        severity: 'danger',
                  },
                  accept: () => {
                        this.userService.deleteUser(id).subscribe({
                              next: () => {
                                    this.onLoadUsers();
                                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record deleted' });
                              },
                              error: (error) => {
                                    console.log(error)
                                    this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Server Error. Please contact your system administrator' });
                              }
                        })
                  },
                  reject: () => {
                        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Transaction Cancelled' });
                  },
            });
      }
}
