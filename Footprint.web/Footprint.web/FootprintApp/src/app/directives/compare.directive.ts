import { Directive, Attribute } from '@angular/core';
import { Validator, FormControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[appCompare]',
  providers: [{ provide: NG_VALIDATORS, useExisting: CompareDirective, multi: true }]
})
export class CompareDirective implements Validator {

  constructor(@Attribute('appCompare') public comparer: string,
    @Attribute('parent') public parent: string) { }

  validate(c: FormControl): { [key: string]: any } {
    let e = c.root.get(this.comparer);

    // value not equal in verify control
    if (e && c.value !== e.value && !this.isParent) {
      return { "CompareDirective": true };
    }

    // user typing in password and match
    if (e && c.value === e.value && this.isParent) {
      delete e.errors['CompareDirective'];
      if (!Object.keys(e.errors).length) e.setErrors(null);
    }

    // user typing in password and mismatch
    if (e && c.value !== e.value && this.isParent) {
      e.setErrors({ "CompareDirective": true });
    }
  }

  private get isParent() {
    if (!this.parent)
      return false;

    return this.parent === 'true' ? true : false;
  }

}
