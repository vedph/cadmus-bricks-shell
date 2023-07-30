import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Message used by MessageService.
 */
export interface Message {
  id: string;
  payload?: any;
}

/**
 * A simple message service used to tunnel messages from the
 * lookup component to the parent component when using lookup set.
 */
@Injectable({ providedIn: 'root' })
export class MessageService {
  private _subject = new BehaviorSubject<Message | null>(null);

  /**
   * The current message or null.
   */
  public get current(): Message | null {
    return this._subject.value;
  }

  /**
   * Select the message stream.
   * @returns The observable message stream.
   */
  select(): Observable<Message | null> {
    return this._subject.asObservable();
  }

  /**
   * Send a message.
   * @param message The message object.
   */
  send(message: Message) {
    this._subject.next(message);
  }

  /**
   * Clear the current message.
   */
  clear() {
    this._subject.next(null);
  }
}
