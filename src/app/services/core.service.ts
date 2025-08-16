import { ApiResponse } from "@/models";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

const BASE_ULR = "http://127.0.0.1:8000/api";

@Injectable({ providedIn: 'root'})
export class CoreService<Model> {
   constructor(private readonly http: HttpClient) {}

   /**
    * Method to create post request
    * @param endpoint 
    * @param data 
    * @returns 
    */
   httpPost(endpoint: string, data: Model) {
      return this.http.post<ApiResponse<Model>>(`${BASE_ULR}/${endpoint}`, data);
   }
   /**
    * Method to create get reqeust (optional query params for pagination or search queries)
    * @param endpoint 
    * @param queryParams 
    * @returns 
    */
   httpGetRequest(endpoint: string, queryParams?: Record<string, string | number | boolean | undefined>) {
      const params = new HttpParams();
      if (queryParams) {
         const queries = Object.entries(queryParams);
         for(const [key, value] of queries) {
            if (key && value) {
               params.set(key, value.toString())
            }
         }
      }

      return this.http.get<ApiResponse<Model>>(`${BASE_ULR}/${endpoint}`, { params });
   }
   /**
    * Method to 
    * @param endpoint 
    * @param targetId 
    * @param data 
    * @returns 
    */
   httpPutRequest(endpoint: string, targetId: number, data: Model) {
      return this.http.put<Model>(`${BASE_ULR}/${endpoint}/${targetId}`, data);
   }

   /**
    * Method to create delete request
    * @param endpoint 
    * @param id 
    * @returns 
    */
   httpDeleteRequest(endpoint: string, id: number) {
      return this.http.delete<Model>(`${endpoint}/${id}`);
   }
}