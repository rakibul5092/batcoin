import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from './../user.service';

@Injectable({
  providedIn: 'root',
})
export class EmailExistsValidator {
  constructor(private readonly userService: UserService) {}

  emailExists(originalEmail: string | undefined) {
    return (control: AbstractControl) => {
      if (originalEmail && control.value && originalEmail.toLowerCase() === control.value.toLowerCase()) {
        return of(null);
      }

      return this.userService.checkIfEmailExists(control.value).pipe(map((result: boolean) => (result ? { emailAlreadyExists: true } : null)));
    };
  }
}
