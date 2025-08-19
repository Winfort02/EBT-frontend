import { Injectable } from "@angular/core";
import { ApiResponse, User } from "@/models";
import { CommonService, CoreService } from ".";
import { API_ENDPOINTS, dateFormat } from "@/constant";
import { delay, map, shareReplay, take, tap } from "rxjs/operators";

interface AuthResponse {
   user: User, 
   accessToken: string 
}

@Injectable({providedIn: 'root'})
export class UserService {
      constructor(
         private readonly coreService: CoreService<User | User[]>,
         private readonly commonService: CommonService
   ) {}

   /**
    * 
    * @param data 
    * @returns 
    */
   public login(data: { email: string, password: string}) {
      const model = data as unknown as User;
      return this.coreService.httpPost(API_ENDPOINTS.login, model).pipe(
         take(1), 
         tap((response) => {
            const data = response.data as unknown as AuthResponse;
            
            if (data && data?.user) {
               const user = data.user as User;
               this.commonService.setCurrentUser(user);
            }
         }),
         delay(300)
      );
   }
   
   /**
    * 
    * @returns 
    */
   public logout() {
      return this.coreService.httpPost(API_ENDPOINTS.logout, {} as User).pipe(delay(300));
   }

   /**
    * 
    * @returns 
    */
   public getUsers() {
      return this.coreService.httpGetRequest(API_ENDPOINTS.users.root).pipe(
         take(1),
         shareReplay(1),
         map((response: ApiResponse<User| User[]>) => {
            const data = response.data as User[];
            const user = data.map((user: User) => (({
               ...user,
               createdAt: this.commonService.formatDate(user.createdAt, dateFormat.long),
               updatedAt: this.commonService.formatDate(user.updatedAt, dateFormat.long)
            })))
            return new ApiResponse(response.timeStamp, user, response.message);
         })
      );
   }

   /**
    * 
    * @param id 
    * @param data 
    * @returns 
    */
   public updateUser(id: number, data: User) {
      return this.coreService.httpPutRequest(API_ENDPOINTS.users.root, id, data);
   }

   /**
    * 
    * @param data 
    * @returns 
    */
   public createUser(data: User) {
      return this.coreService.httpPost(API_ENDPOINTS.users.root, data);
   }

   /**
    * 
    * @param id 
    * @returns 
    */
   public deleteUser(id: number) {
      return this.coreService.httpDeleteRequest(API_ENDPOINTS.users.root, id);
   }
}