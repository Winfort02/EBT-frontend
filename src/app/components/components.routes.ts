import { Routes } from "@angular/router";
import { Users } from "./users/users";
import { Person } from "./person/person";
import { ADMIN_GUARD } from "@/guard/admin.guard";

export default [
    { path: 'users', component: Users, canActivate: [ADMIN_GUARD] },
    { path: 'persons', component: Person },
] as Routes;