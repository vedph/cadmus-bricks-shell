import { TestBed } from '@angular/core/testing';
import { IiifUri } from './iiif-uri';

fdescribe('IiifUri', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('parse with real-world URI works', () => {
    const uri = IiifUri.parse(
      'https://stacks.stanford.edu/image/iiif/xj710dc7305/029_fob_TC_46/full/full/0/default.jpg'
    );
    expect(uri).toBeTruthy();
    expect(uri!.scheme).toBe('https');
    expect(uri!.server).toBe('stacks.stanford.edu');
    expect(uri!.prefix).toBe('image/iiif/xj710dc7305');
    expect(uri!.identifier).toBe('029_fob_TC_46');
    expect(uri!.region).toBe('full');
    expect(uri!.size).toBe('full');
    expect(uri!.rotation).toBe('0');
    expect(uri!.quality).toBe('default');
    expect(uri!.format).toBe('jpg');
  });
});
