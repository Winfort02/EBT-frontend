import { UserRole } from "./role.model";

export class User {
   id?: number;
   email: string;
   roleId: number;
   displayName: string;
   createdAt: Date;
   updatedAt: Date;
   role?: UserRole;

   constructor(
      id?: number, 
      email = "", 
      roleId = 0, 
      displayName = "", 
      createdAt = new Date(), 
      updatedAt = new Date())
   {
      this.id = id;
      this.email = email;
      this.roleId = roleId;
      this.displayName = displayName;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
   }
}