import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

/**
 * A custom action definition for the CustomActionBarComponent.
 */
export interface BarCustomAction {
  id: string;
  iconId: string;
  tip?: string;
  style?: { [klass: string]: any } | null;
  disabled?: (payload: any) => boolean;
}

/**
 * A request for executing a custom action.
 */
export interface BarCustomActionRequest {
  id: string;
  payload?: any;
}

/**
 * Custom actions bar component. This bar contains a row of buttons
 * corresponding to custom-defined actions via the actions input property.
 * Whenever the user clicks a button, the actionRequest event is emitted.
 * To use this component, set the actions and handle the actionRequest
 * event. Eventually, you can set additional data in the payload property,
 * which will be passed back to the actionRequest handler.
 * Each custom action is defined by an object implementing BarCustomAction.
 */
@Component({
  selector: 'cadmus-custom-action-bar',
  templateUrl: './custom-action-bar.component.html',
  styleUrls: ['./custom-action-bar.component.css'],
})
export class CustomActionBarComponent implements OnInit {
  /**
   * Any optional payload data linked to this bar. For instance, in a list
   * of actionable items having a bar for each item, this could be the item.
   * The payload gets passed back to the actionRequest handler together
   * with the action's ID.
   */
  @Input()
  public payload: any;

  /**
   * The actions defined for this bar.
   */
  @Input()
  public actions: BarCustomAction[];

  /**
   * True if the bar should be disabled.
   */
  @Input()
  public disabled?: boolean;

  /**
   * Emitted when the user requests a custom action.
   */
  @Output()
  public actionRequest: EventEmitter<BarCustomActionRequest>;

  constructor() {
    this.actions = [];
    this.actionRequest = new EventEmitter<BarCustomActionRequest>();
  }

  ngOnInit(): void {}

  public onCustomAction(action: BarCustomAction, payload: any): void {
    this.actionRequest.emit({
      id: action.id,
      payload: payload,
    });
  }
}
