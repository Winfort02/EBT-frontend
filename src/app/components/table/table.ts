import { Pagination } from '@/models';
import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

interface ITableColumn {
  field: string;
  header: string;
}

@Component({
  standalone: true,
  selector: 'app-table',
  imports: [
    TableModule,
    ButtonModule,
    CommonModule
  ],
  template: `
    @defer(on timer(500ms)) {
      <p-table [columns]="getColumns()" [value]="getUsers()" [tableStyle]="{ 'min-width': '50rem' }" [loading]="loading" class="p-datatable-gridlines"
        [resizableColumns]="true"
      >
        <ng-template pTemplate="header" let-columns>
          <tr>
            @for(col of columns; track $index) {
              <th class="capitalize" pResizableColumn> {{ col.header }} </th>
              } @if (getUsers().length) { @if (showActionBtn.edit) {
              <th [width]="'5%'" class="text-center text-md capitalize"> {{ actionButton.edit }} </th>
              } @if(showActionBtn.delete) {
              <th [width]="'5%'" class="text-center text-md capitalize"> {{ actionButton.delete }} </th>
              } 
            }
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-rowData let-columns="columns">
          @defer (when !loading && items().length) {
          <tr>
            @for(col of columns; track $index) {
            <td>{{ rowData[col.field] }}</td>
            } @if(showActionBtn.edit) {
            <td>
              <p-button severity="info" size="small" [label]="actionButton.edit" (click)="onClickActionBtn('edit', rowData)" styleClass="custom-button"/>
            </td>
            } @if(showActionBtn.delete) {
            <td>
              <p-button severity="danger" size="small" [label]="actionButton.delete" (click)="onClickActionBtn('delete', rowData)" styleClass="custom-button" />
            </td>
            }
          </tr>
          }
        </ng-template>
      </p-table>

      @defer (when enablePagination) {
      <div class="col-12 w-full">
        <div
          class="flex sm:align-items-start md:align-items-center column-gap-1 row-gap-1"
        >
          <div>
            <button pButton pRipple type="button" label="<<" class="p-button-text p-button-sm p-button-secondary" id="firstPage"
              [disabled]="getPagination().firstPage === getPagination().currentPage" (click)="onPaginatePage('firstPage')" ></button>
          </div>
          <div>
            <button pButton pRipple type="button" label="Prev" class="p-button-text p-button-sm p-button-secondary my-1" id="prevPage"
              [disabled]="!getPagination().prevPage" (click)="onPaginatePage('prevPage')" ></button>
          </div>
          <div class="flex flex-wrap column-gap-1 row-gap-1">
            <button
              *ngFor="let page of pageNumbers"
              pButton
              type="button"
              class="p-button-text p-button-sm text-white"
              [disabled]="getPagination().totalPages === 1"
              [ngClass]="{
                'surface-500': getPagination().currentPage == page,
                'bg-teal-500': getPagination().currentPage != page
              }"
              [style]="{ width: '50px' }"
              (click)="onPageChange(page)"
              label="{{ page }}"
            ></button>
          </div>
          <div>
            <button
              pButton
              pRipple
              type="button"
              label="Next"
              class="p-button-text p-button-sm p-button-secondary"
              id="nextPage"
              [disabled]="!getPagination().nextPage"
              (click)="onPaginatePage('nextPage')"
            ></button>
          </div>
          <div>
            <button
              pButton
              pRipple
              type="button"
              label=">>"
              class="p-button-text p-button-sm p-button-secondary my-1"
              [disabled]="getPagination().lastPage === getPagination().currentPage"
              (click)="onPaginatePage('lastPage')"
            ></button>
          </div>
          <div>
            <!-- <p-dropdown
                [options]="rows"
                [(ngModel)]="maxRow"
                optionLabel="name"
                (onChange)="selectedRow()"
              ></p-dropdown> -->
          </div>
        </div>
      </div>
      } }
  
  `,
})
export class Table implements OnInit {

  @Input() cols = signal<ITableColumn[]>([]);
  @Input() items = signal<any[]>([]);
  @Input() loading: boolean = false;
  @Input() pagination = signal<Pagination>(new Pagination());
  @Input() enablePagination: Boolean = false;
  @Input() actionButton: { edit: string; delete: string } = {
    edit: 'EDIT',
    delete: 'DELETE',
  };
  @Input() showActionBtn: { edit: boolean; delete: boolean } = {
    edit: true,
    delete: true,
  };

  @Output() paginatePage = new EventEmitter<string>();
  @Output() pageChanged = new EventEmitter<number>();
  @Output() maxRowChange = new EventEmitter<any>();
  @Output() actionBtn = new EventEmitter<{ type: string; data: any }>();

  pageSize = 5;
  pageNumbers: number[] = [];
  end = 5;
  getUsers = computed(() => this.items());
  getColumns = computed(() => this.cols());
  getPagination = computed(() => this.pagination());

  onPaginatePage(page: string) {
    this.paginatePage.emit(page);
  }

  onPageChange(page: number) {
    this.pageChanged.emit(page);
    this.updatePageNumbers();
  }

  onClickActionBtn(type: string, data: any) {
    const response = { type, data };
    this.actionBtn.emit(response);
  }

  updatePageNumbers() {
    let start;
    this.pageNumbers = [];
    if (
      this.getPagination().currentPage >
      this.getPagination().totalPages - 4
    ) {
      start = Math.max(1, this.getPagination().totalPages - 4);
    } else {
      start = Math.max(1, this.getPagination().currentPage - 2);
    }
    const end = Math.min(
      start + this.pageSize - 1,
      this.getPagination().totalPages
    );
    for (let i = start; i <= end; i++) {
      this.pageNumbers.push(i);
    }
  }

  ngOnInit(): void {}
  
}
