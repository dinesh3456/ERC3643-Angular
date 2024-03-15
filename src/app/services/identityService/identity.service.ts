import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdentityService {
  private _identitySubject = new BehaviorSubject<any>(null);
  identity$ = this._identitySubject.asObservable()

  constructor() { }

  updateIdentity (identity: any) {
    this._identitySubject.next(identity)
  }
}