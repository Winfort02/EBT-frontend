import { Injectable } from "@angular/core";
import { CommonService } from "./common.service";
import { CoreService } from "./core.service";
import { PersonModel } from "@/models/person.model";
import { API_ENDPOINTS, dateFormat } from "@/constant";
import { map, shareReplay, take } from "rxjs/operators";
import { ApiResponse } from "@/models";


@Injectable({ providedIn: 'root'})
export class PersonService {

    constructor(
        private readonly commonService: CommonService,
        private readonly coreService: CoreService<PersonModel | PersonModel[]>
    ) {}

    /**
     * 
     * @param data 
     * @returns 
     */
    public createPerson(data: PersonModel) {
        return this.coreService.httpPost(API_ENDPOINTS.person.root, data);
    }

    /**
     * 
     * @returns 
     */
    public getPersonList() {
        return this.coreService.httpGetRequest(API_ENDPOINTS.person.root).pipe(take(1),
            shareReplay(1),
            map((response: ApiResponse<PersonModel[] | PersonModel>) => {
                const data = response.data as PersonModel[];
                const persons = data.map((person: PersonModel) => (({
                    ...person,
                    createdAt: this.commonService.formatDate(person.createdAt as Date, dateFormat.long),
                })));
                return new ApiResponse(response.timeStamp, persons, response.message);
            })
        );
    }

    /**
     * 
     * @param id 
     * @param data 
     * @returns 
     */
    public updatePerson(id: number, data: PersonModel) {
        return this.coreService.httpPutRequest(API_ENDPOINTS.person.root, id, data)
    }

    /**
     * 
     * @param id 
     * @returns 
     */
    public deletePerson(id: number) {
        return this.coreService.httpDeleteRequest(API_ENDPOINTS.person.root, id)
    }

}