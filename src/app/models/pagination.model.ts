export class Pagination  {
  metaData!: any[];
  currentPage: number = 1;
  firstPage: number = 1;
  prevPage!: number;
  nextPage!: number;
  lastPage!: number;
  totalPages!: number;
  pageDetails!: string;
}