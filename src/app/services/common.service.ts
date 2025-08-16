import { Injectable, signal } from "@angular/core";
import { DatePipe } from "@angular/common";
import { NavigationEnd, Router } from "@angular/router";
import { storageKeys } from "@/constant";
import { User } from "@/models";

@Injectable({ providedIn: 'root'})
export class CommonService {
   
   public currentUrl = signal<string>('');
   private prevUrl = signal<string | null>(this.getLocalStorage(storageKeys.previousUrl));
   private accessToken = signal<string | null>(this.getLocalStorage(storageKeys.accessToken));
   private currentUser = signal<User>(JSON.parse(this.getLocalStorage(storageKeys.currentUser) as string));

   constructor(
      private readonly datePipe: DatePipe,
      private readonly router: Router
   ) {
      this.currentUrl.set(this.router.url);

      router.events.subscribe((event) => {
         if (event instanceof NavigationEnd) {
            this.setLocalStorage(storageKeys.previousUrl, this.currentUrl())
            this.prevUrl.set(this.currentUrl())
            this.currentUrl.set(event.url);
         }
      });
   }

   private getLocalStorage(key: string) {
      return localStorage.getItem(key);
   }

   private setLocalStorage(key: string, value: string) {
      localStorage.setItem(key, value);
   }

   public setCurrentUser(value: User){
      console.log(value);
      this.setLocalStorage(storageKeys.currentUser, JSON.stringify(value));
   }

   get user() {
      return this.currentUser();
   }

   get previousUrl() {
      return this.prevUrl();
   }

   get authToken() {
      return this.accessToken();
   }

   get isLogin() {
      return !!this.accessToken();
   }

   formatDate(date: Date, format: string) {
      return this.datePipe.transform(date, format);
   }
}