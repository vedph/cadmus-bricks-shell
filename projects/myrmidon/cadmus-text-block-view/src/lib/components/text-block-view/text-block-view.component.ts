import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface TextBlock {
  id: string;
  text: string;
  decoration?: string;
  htmlDecoration?: boolean;
  layerIds?: string[];
}

export interface TextBlockEventArgs {
  decoration?: boolean;
  block: TextBlock;
}

@Component({
  selector: 'cadmus-text-block-view',
  templateUrl: './text-block-view.component.html',
  styleUrls: ['./text-block-view.component.css'],
})
export class TextBlockViewComponent implements OnInit {
  private _blocks: TextBlock[];

  @Input()
  public selectedIds: string[] | undefined;

  @Input()
  public get blocks(): TextBlock[] {
    return this._blocks;
  }
  public set blocks(value: TextBlock[]) {
    this._blocks = value;
  }

  @Output()
  public blockClick: EventEmitter<TextBlockEventArgs>;

  constructor() {
    this._blocks = [];
    this.blockClick = new EventEmitter<TextBlockEventArgs>();
  }

  ngOnInit(): void {}

  public getBlockId(index: number, block: TextBlock): any {
    return block.id;
  }

  public onBlockClick(block: TextBlock, decoration: boolean): void {
    this.blockClick.emit({ decoration: decoration, block: block });
  }
}
