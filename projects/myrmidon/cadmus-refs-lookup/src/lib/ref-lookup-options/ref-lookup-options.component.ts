import { Component, Inject, InjectionToken, Injector } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// export const CADMUS_REF_LOOKUP_OPTIONS_DATA: InjectionToken<string> =
//   new InjectionToken<string>('cadmus.ref.lookup.options.data');

/**
 * The options dialog for RefLookupComponent. This provides a dialog frame
 * whose content should be dynamically set via data.component. In turn,
 * data gets injected via the MAT_DIALOG_DATA token.
 */
@Component({
  selector: 'cadmus-ref-lookup-options',
  templateUrl: './ref-lookup-options.component.html',
  styleUrls: ['./ref-lookup-options.component.css'],
})
export class RefLookupOptionsComponent {
  // public optInjector: Injector;

  constructor(
    // injector: Injector,
    private _dialogRef: MatDialogRef<RefLookupOptionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // this injector is used to pass data to the outlet
    // this.optInjector = Injector.create({
    //   providers: [
    //     {
    //       provide: CADMUS_REF_LOOKUP_OPTIONS_DATA,
    //       useValue: this.data,
    //     },
    //   ],
    //   parent: injector,
    // });
  }

  onClose(): void {
    this._dialogRef.close();
  }
}
