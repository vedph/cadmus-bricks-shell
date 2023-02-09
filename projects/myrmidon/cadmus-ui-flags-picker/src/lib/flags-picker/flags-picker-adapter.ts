import { BehaviorSubject, Observable } from 'rxjs';
import { Flag } from './flags-picker.component';

interface FlagPickerSlot {
  id: string;
  checkedIds: string[];
  flags: Flag[];
}

/**
 * Adapter for FlagsPickerComponent. This adapts a FlagsPickerComponent
 * to a consumer which may provide in unpredictable order either the flags
 * or their checks or both. The adapter has any number of slots, each keyed
 * with a string ID. Every slot contains the checked IDs and the list of flags.
 * When setting either flags or checks, the two values are merged into a
 * new list of flags which can be subscribed to.
 */
export class FlagsPickerAdapter {
  private _slots: Map<string, FlagPickerSlot>;
  private _slotSubjects: Map<string, BehaviorSubject<Flag[]>>;

  constructor() {
    this._slots = new Map<string, FlagPickerSlot>();
    this._slotSubjects = new Map<string, BehaviorSubject<Flag[]>>();
  }

  /**
   * Check if a slot with the specified ID is present in this adapter.
   *
   * @param slotId The slot ID.
   * @returns True if the slot is present in this adapter.
   */
  public hasSlot(slotId: string): boolean {
    return this._slots.has(slotId);
  }

  /**
   * Gets the IDs of all the slots in this adapter.
   *
   * @returns The IDs.
   */
  public getSlotIds(): string[] {
    return [...this._slots.keys()];
  }

  /**
   * Get the current flags in the specified slot.
   *
   * @param slotId The slot ID.
   * @returns The flags in the slot.
   */
  public getFlags(slotId: string): Flag[] {
    const s = this._slotSubjects.get(slotId);
    return s?.value || [];
  }

  private ensureSlotCreated(slotId: string): void {
    if (this._slots.has(slotId)) {
      return;
    }
    this._slots.set(slotId, {
      id: slotId,
      checkedIds: [],
      flags: [],
    });
    this._slotSubjects.set(slotId, new BehaviorSubject<Flag[]>([]));
  }

  private ensureSubjectCreated(slotId: string): void {
    if (!this._slotSubjects.has(slotId)) {
      this._slotSubjects.set(slotId, new BehaviorSubject<Flag[]>([]));
    }
  }

  /**
   * Get an observable array of flags for the specified slot.
   *
   * @param slotId The slot ID.
   * @returns Observable with Flag[].
   */
  public selectFlags(slotId: string): Observable<Flag[]> {
    this.ensureSlotCreated(slotId);
    return this._slotSubjects.get(slotId)!.asObservable();
  }

  /**
   * Set the flags for the specified slot. The slot receives the new flags,
   * but retains their previous checks, unless it's a new slot or applyChecks
   * is true.
   *
   * @param slotId The slot's ID.
   * @param flags The flags to set.
   * @param applyChecks True to apply the checked values of flags to the slot
   * checks; false to preserve slot's checks. When the slot does not exist,
   * the checked values of flags are always applied.
   * @returns The current flags of the specified slot.
   */
  public setSlotFlags(
    slotId: string,
    flags: Flag[],
    applyChecks = false
  ): Flag[] {
    let oldSlot: FlagPickerSlot | undefined = this._slots.get(slotId);
    let slot: FlagPickerSlot;

    if (oldSlot) {
      // if the slot exists:
      // - either update flags checks according to existing IDs, or update the
      //   existing IDs according to the received flags;
      // - update slot flags with the received ones.
      if (applyChecks) {
        oldSlot.checkedIds = flags.filter((f) => f.checked).map((f) => f.id);
      } else {
        for (let i = 0; i < flags.length; i++) {
          flags[i].checked = oldSlot.checkedIds.includes(flags[i].id);
        }
      }
      slot = {
        id: slotId,
        // previous/updated checks
        checkedIds: oldSlot.checkedIds,
        // received flags untouched
        flags: flags,
      };
    } else {
      // if the slot does not exist:
      // - create a new slot with flags and checks from the received flags
      slot = {
        id: slotId,
        // received flags IDs
        checkedIds: flags.filter((f) => f.checked).map((f) => f.id),
        // received flags untouched
        flags: flags,
      };
    }

    this._slots.set(slotId, slot);
    this.ensureSubjectCreated(slotId);
    this._slotSubjects.get(slotId)!.next(slot.flags);
    return slot.flags;
  }

  /**
   * Set the checks for the specified slot.
   *
   * @param slotId The slot ID.
   * @param ids The IDs of the flags to check.
   * @returns The current flags of the specified slot.
   */
  public setSlotChecks(slotId: string, ids: string[]): Flag[] {
    let oldSlot: FlagPickerSlot | undefined = this._slots.get(slotId);
    let slot: FlagPickerSlot;

    // if the slot exists:
    // - update its checks;
    // - update the flags to reflect the checks.
    if (oldSlot) {
      slot = {
        id: slotId,
        checkedIds: ids,
        flags: oldSlot.flags.map((f) => {
          return {
            ...f,
            checked: ids.includes(f.id),
          };
        }),
      };
    } else {
      // if the slot does not exist:
      // - create it with the specified checks and empty flags list.
      slot = {
        id: slotId,
        checkedIds: ids,
        flags: [],
      };
    }

    this._slots.set(slotId, slot);
    this.ensureSubjectCreated(slotId);
    this._slotSubjects.get(slotId)!.next(slot.flags);
    return slot.flags;
  }

  /**
   * Delete the slot with the specified ID from this adapter.
   *
   * @param slotId The slot ID.
   */
  public deleteSlot(slotId: string): void {
    this._slots.delete(slotId);
    this._slotSubjects.get(slotId)!.complete();
    this._slotSubjects.delete(slotId);
  }

  /**
   * Delete all the slots from this adapter.
   */
  public clear(): void {
    this._slots.clear();
    this._slotSubjects.forEach((s) => s.complete());
    this._slotSubjects.clear();
  }
}
