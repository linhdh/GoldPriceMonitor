import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

/** An actor's name can't match the actor's role */
export const repasswordIsMatchedValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const password = control.get('passwordControl');
  const repassword = control.get('repasswordControl');
  return password && repassword && password.value === repassword.value ? null : { repasswordIsMatched: true };
};