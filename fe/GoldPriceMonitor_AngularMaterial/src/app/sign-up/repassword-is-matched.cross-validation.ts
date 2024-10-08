import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

/** An actor's name can't match the actor's role */
export const repasswordIsMatchedValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const password = control.get('passwordControl');
  const repassword = control.get('repasswordControl');
  var condition = password && repassword && password.value === repassword.value;
  //console.log("condition: " + condition);
  //console.log(control.hasError('repasswordIsMatched'));
  if (!condition) {
    repassword?.setErrors({repasswordIsMatched: true});
  } else {
    repassword?.setErrors(null);
  }
  return condition ? null : { repasswordIsMatched: true };
};