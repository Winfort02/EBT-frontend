import { CommonModule } from "@angular/common";
import { Component, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { RadioButtonModule } from "primeng/radiobutton";
import { RatingModule } from "primeng/rating";
import { RippleModule } from "primeng/ripple";
import { SelectModule } from "primeng/select";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { TextareaModule } from "primeng/textarea";
import { ToastModule } from "primeng/toast";
import { ToolbarModule } from "primeng/toolbar";
import { Table } from "../table/table";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { PersonForm } from "../shared/person-form";
import { PersonService } from "@/services/person.service";
import { PersonModel } from "@/models/person.model";
import { Subscription } from "rxjs";
import { ConfirmationService, MessageService } from "primeng/api";


@Component({
    standalone: true,
    selector: 'app-person',
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
                 <label for="user-list" class="text-primary indent-2 font-bold">{{'Person List Table' | uppercase }}</label>
            </ng-template>

            <ng-template #end>
                   <p-button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="onCreatePerson()"/>
            </ng-template>
      </p-toolbar>
      <app-table [cols]="cols" [actionButton]="{ edit: 'Edit', delete: 'Delete'}" [showActionBtn]="{ edit: true, delete: true}" 
        [items]="persons" (actionBtn)="onActionButtonClick($event)"/>
</div>`
})
export class Person implements OnInit {

    cols = signal([
        { field: 'fullName', header: 'Full Name'},
        { field: 'phoneNumber', header: 'Phone Number'},
        { field: 'Address', header: 'Address'},
        { field: 'createdAt', header: 'Created At'},
    ]);

    persons = signal<any[]>([]);
    dialogRef!: DynamicDialogRef;
    subscriptions!: Subscription;

    constructor(
        private readonly dialogService: DialogService,
        private readonly personService: PersonService,
        private readonly confirmService: ConfirmationService,
        private readonly messageService: MessageService
    ) {}

    /**
     * 
     * @param event 
     */
    onActionButtonClick(event: any) {
        if (event && event?.type === 'delete' && event?.data) {
            this.onDelete(event.data.id)
        } else {
            const data = event.data;
            console.log(data);
            this.dialogRef = this.dialogService.open(PersonForm, {
                header: 'Person Detail',
                width: '568px',
                position: 'top',
                modal: true,
                closable: true,
                contentStyle: { overflow: 'auto' },
                breakpoints: {
                    '960px': '75vw',
                    '640px': '90vw'
                },
                data
            });

            this.dialogRef.onClose.subscribe(data => {
            if (data) {
                this.personService.updatePerson(event.data.id, data as PersonModel).subscribe({
                    next: () => {
                        this.onLoadPersons();
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Updated Successfully' });
                    },
                    error: () => {
                        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Error occured. Please try again.' });
                    }
                })
            }
            })
        }
    }
    /**
     * 
     */
    ngOnInit() {
        this.onLoadPersons();
    }

    /**
     * 
     */
    onLoadPersons() {
        this.subscriptions = this.personService.getPersonList().subscribe(response => {
            if (response && response?.data) {
                const data = response?.data as PersonModel[] ?? []
                this.persons.set(data)
            }
        })
    }

    /**
     * 
     */
    onCreatePerson() {
        this.dialogRef = this.dialogService.open(PersonForm, {
            header: 'Person Detail',
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
        })

        this.dialogRef.onClose.subscribe(data => {
           if (data) {
            this.personService.createPerson(data as PersonModel).subscribe({
                next: () => {
                    this.onLoadPersons();
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'New Person Addedd' });
                },
                error: () => {
                    this.onLoadPersons()
                    this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Error occured. Please try again.' });
                }
            })
           }
        })
    }

    /**
     * 
     * @param id 
     */
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
                this.personService.deletePerson(id).subscribe({
                        next: () => {
                            this.onLoadPersons();
                            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record deleted' });
                        },
                        error: (error) => {
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