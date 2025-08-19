import { CommonService } from "@/services";
import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";


export const LOGIN_GUARD: CanActivateFn = () => {
   const authService = inject(CommonService);
   const router = inject(Router);
   const user = authService.user;

   if (user) {
      router.navigate(['/application']);
      return false;
   }
   return true;
}