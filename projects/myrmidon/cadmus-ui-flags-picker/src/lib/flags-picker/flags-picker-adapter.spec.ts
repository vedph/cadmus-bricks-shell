import { FlagsPickerAdapter } from './flags-picker-adapter';
import { Flag } from './flags-picker.component';

describe('FlagsPickerAdapter', () => {
  it('getFlags should return empty for non existing slot', () => {
    let adapter = new FlagsPickerAdapter();
    const flags = adapter.getFlags('a');
    expect(flags).toBeTruthy();
    expect(flags.length).toBe(0);
  });

  it('selectFlags should create a non-existing slot', () => {
    let adapter = new FlagsPickerAdapter();
    const flags$ = adapter.selectFlags('a');
    expect(flags$).toBeTruthy();
    const flags = adapter.setSlotFlags('a', [
      {
        id: 'A',
        label: 'alpha',
      },
    ]);
    expect(flags.length).toBe(1);
  });

  it('selectFlags should create a non-existing slot', () => {
    let adapter = new FlagsPickerAdapter();
    adapter.selectFlags('a');
    expect(adapter.hasSlot('a')).toBeTrue();
    expect(adapter.getSlotIds()[0] == 'a');
  });

  // set flags - slot does not exist
  it('setSlotFlags without slot should copy flags', () => {
    let adapter = new FlagsPickerAdapter();
    const flags: Flag[] = [
      {
        id: 'A',
        label: 'alpha',
      },
    ];
    adapter.setSlotFlags('a', flags);
    const flags2 = adapter.getFlags('a');
    expect(flags2.length).toBe(1);
    expect(flags2[0].id).toBe(flags[0].id);
    expect(flags2[0].label).toBe(flags[0].label);
    expect(flags2[0].checked).toBe(flags[0].checked);
    expect(flags2[0].user).toBe(flags[0].user);
  });

  // set flags - slot exists
  it('setSlotFlags with slot should update flags but not checks', () => {
    let adapter = new FlagsPickerAdapter();
    const flags: Flag[] = [
      {
        id: 'A',
        label: 'alpha',
        checked: true,
      },
      {
        id: 'B',
        label: 'beta',
      },
    ];
    adapter.setSlotFlags('a', flags);

    flags.push({
      id: 'C',
      label: 'gamma',
    });
    flags[0].checked = false;
    flags[1].checked = true;
    adapter.setSlotFlags('a', flags);

    const flags2 = adapter.getFlags('a');
    expect(flags2.length).toBe(3);

    let flag = flags2.find((f) => f.id === 'A');
    expect(flag).toBeTruthy();
    expect(flag!.label).toBe('alpha');
    expect(flag!.checked).toBeTrue();

    flag = flags2.find((f) => f.id === 'B');
    expect(flag).toBeTruthy();
    expect(flag!.label).toBe('beta');
    expect(flag!.checked).toBeFalsy();

    flag = flags2.find((f) => f.id === 'C');
    expect(flag).toBeTruthy();
    expect(flag!.label).toBe('gamma');
    expect(flag!.checked).toBeFalsy();
  });

  it('setSlotFlags with slot should update flags and checks when requested', () => {
    let adapter = new FlagsPickerAdapter();
    const flags: Flag[] = [
      {
        id: 'A',
        label: 'alpha',
        checked: true,
      },
      {
        id: 'B',
        label: 'beta',
      },
    ];
    adapter.setSlotFlags('a', flags);

    flags.push({
      id: 'C',
      label: 'gamma',
    });
    flags[0].checked = false;
    flags[1].checked = true;
    adapter.setSlotFlags('a', flags, true);

    const flags2 = adapter.getFlags('a');
    expect(flags2.length).toBe(3);

    let flag = flags2.find((f) => f.id === 'A');
    expect(flag).toBeTruthy();
    expect(flag!.label).toBe('alpha');
    expect(flag!.checked).toBeFalsy();

    flag = flags2.find((f) => f.id === 'B');
    expect(flag).toBeTruthy();
    expect(flag!.label).toBe('beta');
    expect(flag!.checked).toBeTrue();

    flag = flags2.find((f) => f.id === 'C');
    expect(flag).toBeTruthy();
    expect(flag!.label).toBe('gamma');
    expect(flag!.checked).toBeFalsy();
  });

  // set check - slot does not exist
  it('setSlotChecks without slot should add it with no flags', () => {
    let adapter = new FlagsPickerAdapter();
    const flags = adapter.setSlotChecks('a', ['A', 'C']);
    expect(flags.length).toBe(0);
  });

  it('setSlotChecks without slot should add it with no flags and preserve them', () => {
    let adapter = new FlagsPickerAdapter();
    adapter.setSlotChecks('a', ['A', 'C']);

    const flags: Flag[] = [
      {
        id: 'A',
        label: 'alpha',
      },
      {
        id: 'B',
        label: 'beta',
      },
      {
        id: 'C',
        label: 'gamma',
      },
    ];
    const flags2 = adapter.setSlotFlags('a', flags);
    expect(flags2.length).toBe(3);

    let flag = flags2.find((f) => f.id === 'A');
    expect(flag).toBeTruthy();
    expect(flag!.label).toBe('alpha');
    expect(flag!.checked).toBeTrue();

    flag = flags2.find((f) => f.id === 'B');
    expect(flag).toBeTruthy();
    expect(flag!.label).toBe('beta');
    expect(flag!.checked).toBeFalsy();

    flag = flags2.find((f) => f.id === 'C');
    expect(flag).toBeTruthy();
    expect(flag!.label).toBe('gamma');
    expect(flag!.checked).toBeTrue();
  });

  // set check - slot exists
  it('setSlotChecks with slot should update flag checks', () => {
    let adapter = new FlagsPickerAdapter();
    const flags: Flag[] = [
      {
        id: 'A',
        label: 'alpha',
        checked: true,
      },
      {
        id: 'B',
        label: 'beta',
      },
    ];
    adapter.setSlotFlags('a', flags);

    const flags2 = adapter.setSlotChecks('a', ['B']);
    let flag = flags2.find((f) => f.id === 'A');
    expect(flag).toBeTruthy();
    expect(flag!.label).toBe('alpha');
    expect(flag!.checked).toBeFalsy();

    flag = flags2.find((f) => f.id === 'B');
    expect(flag).toBeTruthy();
    expect(flag!.label).toBe('beta');
    expect(flag!.checked).toBeTrue();
  });
});
