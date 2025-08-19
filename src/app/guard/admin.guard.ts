import { CommonService } from "@/services";
import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";


export const ADMIN_GUARD: CanActivateFn = () => {
   const authService = inject(CommonService);
   const router = inject(Router);

   if (authService.isAdmin) {
      return true
   }
   router.navigate(['/']);
   return false;
}