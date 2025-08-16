import { CommonService } from "@/services";
import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";


export const AUTH_GUARD: CanActivateFn = () => {
   const authService = inject(CommonService);
   const router = inject(Router);
   const user = authService.user;

   if (!user) {
      router.navigate(['auth/login']);
      return false;
   } else if (user?.role && user?.role?.role === "ADMIN") {
      return true;
   } else {
      return true; // overrid this else block for other roles flow
   }
}