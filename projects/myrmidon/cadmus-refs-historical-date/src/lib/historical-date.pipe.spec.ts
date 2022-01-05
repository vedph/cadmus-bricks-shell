import { HistoricalDatePipe } from './historical-date.pipe';

describe('HistoricalDatePipe', () => {
  it('create an instance', () => {
    const pipe = new HistoricalDatePipe();
    expect(pipe).toBeTruthy();
  });
});
