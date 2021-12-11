import { Component, OnInit } from '@angular/core';
import {
  RefLookupFilter,
  RefLookupService,
} from '@myrmidon/cadmus-refs-lookup';
import { Observable, of } from 'rxjs';

export interface WebColor {
  name: string;
  value: string;
}

const COLORS: WebColor[] = [
  { name: 'aliceblue', value: '#f0f8ff' },
  { name: 'antiquewhite', value: '#faebd7' },
  { name: 'aqua', value: '#00ffff' },
  { name: 'aquamarine', value: '#7fffd4' },
  { name: 'azure', value: '#f0ffff' },
  { name: 'beige', value: '#f5f5dc' },
  { name: 'bisque', value: '#ffe4c4' },
  { name: 'black', value: '#000000' },
  { name: 'blanchedalmond', value: '#ffebcd' },
  { name: 'blue', value: '#0000ff' },
  { name: 'blueviolet', value: '#8a2be2' },
  { name: 'brown', value: '#a52a2a' },
  { name: 'burlywood', value: '#deb887' },
  { name: 'cadetblue', value: '#5f9ea0' },
  { name: 'chartreuse', value: '#7fff00' },
  { name: 'chocolate', value: '#d2691e' },
  { name: 'coral', value: '#ff7f50' },
  { name: 'cornflowerblue', value: '#6495ed' },
  { name: 'cornsilk', value: '#fff8dc' },
  { name: 'crimson', value: '#dc143c' },
  { name: 'cyan', value: '#00ffff' },
  { name: 'darkblue', value: '#00008b' },
  { name: 'darkcyan', value: '#008b8b' },
  { name: 'darkgoldenrod', value: '#b8860b' },
  { name: 'darkgray', value: '#a9a9a9' },
  { name: 'darkgreen', value: '#006400' },
  { name: 'darkgrey', value: '#a9a9a9' },
  { name: 'darkkhaki', value: '#bdb76b' },
  { name: 'darkmagenta', value: '#8b008b' },
  { name: 'darkolivegreen', value: '#556b2f' },
  { name: 'darkorange', value: '#ff8c00' },
  { name: 'darkorchid', value: '#9932cc' },
  { name: 'darkred', value: '#8b0000' },
  { name: 'darksalmon', value: '#e9967a' },
  { name: 'darkseagreen', value: '#8fbc8f' },
  { name: 'darkslateblue', value: '#483d8b' },
  { name: 'darkslategray', value: '#2f4f4f' },
  { name: 'darkslategrey', value: '#2f4f4f' },
  { name: 'darkturquoise', value: '#00ced1' },
  { name: 'darkviolet', value: '#9400d3' },
  { name: 'deeppink', value: '#ff1493' },
  { name: 'deepskyblue', value: '#00bfff' },
  { name: 'dimgray', value: '#696969' },
  { name: 'dimgrey', value: '#696969' },
  { name: 'dodgerblue', value: '#1e90ff' },
  { name: 'firebrick', value: '#b22222' },
  { name: 'floralwhite', value: '#fffaf0' },
  { name: 'forestgreen', value: '#228b22' },
  { name: 'fuchsia', value: '#ff00ff' },
  { name: 'gainsboro', value: '#dcdcdc' },
  { name: 'ghostwhite', value: '#f8f8ff' },
  { name: 'goldenrod', value: '#daa520' },
  { name: 'gold', value: '#ffd700' },
  { name: 'gray', value: '#808080' },
  { name: 'green', value: '#008000' },
  { name: 'greenyellow', value: '#adff2f' },
  { name: 'grey', value: '#808080' },
  { name: 'honeydew', value: '#f0fff0' },
  { name: 'hotpink', value: '#ff69b4' },
  { name: 'indianred', value: '#cd5c5c' },
  { name: 'indigo', value: '#4b0082' },
  { name: 'ivory', value: '#fffff0' },
  { name: 'khaki', value: '#f0e68c' },
  { name: 'lavenderblush', value: '#fff0f5' },
  { name: 'lavender', value: '#e6e6fa' },
  { name: 'lawngreen', value: '#7cfc00' },
  { name: 'lemonchiffon', value: '#fffacd' },
  { name: 'lightblue', value: '#add8e6' },
  { name: 'lightcoral', value: '#f08080' },
  { name: 'lightcyan', value: '#e0ffff' },
  { name: 'lightgoldenrodyellow', value: '#fafad2' },
  { name: 'lightgray', value: '#d3d3d3' },
  { name: 'lightgreen', value: '#90ee90' },
  { name: 'lightgrey', value: '#d3d3d3' },
  { name: 'lightpink', value: '#ffb6c1' },
  { name: 'lightsalmon', value: '#ffa07a' },
  { name: 'lightseagreen', value: '#20b2aa' },
  { name: 'lightskyblue', value: '#87cefa' },
  { name: 'lightslategray', value: '#778899' },
  { name: 'lightslategrey', value: '#778899' },
  { name: 'lightsteelblue', value: '#b0c4de' },
  { name: 'lightyellow', value: '#ffffe0' },
  { name: 'lime', value: '#00ff00' },
  { name: 'limegreen', value: '#32cd32' },
  { name: 'linen', value: '#faf0e6' },
  { name: 'magenta', value: '#ff00ff' },
  { name: 'maroon', value: '#800000' },
  { name: 'mediumaquamarine', value: '#66cdaa' },
  { name: 'mediumblue', value: '#0000cd' },
  { name: 'mediumorchid', value: '#ba55d3' },
  { name: 'mediumpurple', value: '#9370db' },
  { name: 'mediumseagreen', value: '#3cb371' },
  { name: 'mediumslateblue', value: '#7b68ee' },
  { name: 'mediumspringgreen', value: '#00fa9a' },
  { name: 'mediumturquoise', value: '#48d1cc' },
  { name: 'mediumvioletred', value: '#c71585' },
  { name: 'midnightblue', value: '#191970' },
  { name: 'mintcream', value: '#f5fffa' },
  { name: 'mistyrose', value: '#ffe4e1' },
  { name: 'moccasin', value: '#ffe4b5' },
  { name: 'navajowhite', value: '#ffdead' },
  { name: 'navy', value: '#000080' },
  { name: 'oldlace', value: '#fdf5e6' },
  { name: 'olive', value: '#808000' },
  { name: 'olivedrab', value: '#6b8e23' },
  { name: 'orange', value: '#ffa500' },
  { name: 'orangered', value: '#ff4500' },
  { name: 'orchid', value: '#da70d6' },
  { name: 'palegoldenrod', value: '#eee8aa' },
  { name: 'palegreen', value: '#98fb98' },
  { name: 'paleturquoise', value: '#afeeee' },
  { name: 'palevioletred', value: '#db7093' },
  { name: 'papayawhip', value: '#ffefd5' },
  { name: 'peachpuff', value: '#ffdab9' },
  { name: 'peru', value: '#cd853f' },
  { name: 'pink', value: '#ffc0cb' },
  { name: 'plum', value: '#dda0dd' },
  { name: 'powderblue', value: '#b0e0e6' },
  { name: 'purple', value: '#800080' },
  { name: 'rebeccapurple', value: '#663399' },
  { name: 'red', value: '#ff0000' },
  { name: 'rosybrown', value: '#bc8f8f' },
  { name: 'royalblue', value: '#4169e1' },
  { name: 'saddlebrown', value: '#8b4513' },
  { name: 'salmon', value: '#fa8072' },
  { name: 'sandybrown', value: '#f4a460' },
  { name: 'seagreen', value: '#2e8b57' },
  { name: 'seashell', value: '#fff5ee' },
  { name: 'sienna', value: '#a0522d' },
  { name: 'silver', value: '#c0c0c0' },
  { name: 'skyblue', value: '#87ceeb' },
  { name: 'slateblue', value: '#6a5acd' },
  { name: 'slategray', value: '#708090' },
  { name: 'slategrey', value: '#708090' },
  { name: 'snow', value: '#fffafa' },
  { name: 'springgreen', value: '#00ff7f' },
  { name: 'steelblue', value: '#4682b4' },
  { name: 'tan', value: '#d2b48c' },
  { name: 'teal', value: '#008080' },
  { name: 'thistle', value: '#d8bfd8' },
  { name: 'tomato', value: '#ff6347' },
  { name: 'turquoise', value: '#40e0d0' },
  { name: 'violet', value: '#ee82ee' },
  { name: 'wheat', value: '#f5deb3' },
  { name: 'white', value: '#ffffff' },
  { name: 'whitesmoke', value: '#f5f5f5' },
  { name: 'yellow', value: '#ffff00' },
  { name: 'yellowgreen', value: '#9acd32' },
];

export class WebColorLookup implements RefLookupService {
  public lookup<T>(filter: RefLookupFilter): Observable<T[]> {
    if (!filter.text) {
      return of([]);
    }
    const matches: unknown[] = [];
    for (let i = 0; i < COLORS.length; i++) {
      if (COLORS[i].name.includes(filter.text!)) {
        matches.push(COLORS[i]);
        if (matches.length >= filter.limit) {
          break;
        }
      }
    }
    return of(matches as T[]);
  }

  public getName(item: any): string {
    return item?.name || '';
  }
}

@Component({
  selector: 'app-ref-lookup-pg',
  templateUrl: './ref-lookup-pg.component.html',
  styleUrls: ['./ref-lookup-pg.component.css'],
})
export class RefLookupPgComponent implements OnInit {
  public item: WebColor;
  public service: WebColorLookup;

  constructor() {
    this.item = COLORS[0];
    this.service = new WebColorLookup();
  }

  ngOnInit(): void {}

  public onItemChange(item: any | undefined) : void {
    this.item = item;
  }
}
