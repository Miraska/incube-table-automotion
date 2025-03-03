// src/automations/automation.types.ts

/**
 * Возможные значения для triggerType
 */
export type AutomationTriggerType =
  | 'onCreate'
  | 'onUpdate'
  | 'onDelete'
  | 'scheduled'
  | 'onCreateRecord'
  | 'onUpdateRecord'
  | 'onDeleteRecord'
  | 'onCheck';

/**
 * Возможные значения для AutomationAction.type
 */
export type AutomationActionType =
  | 'updateRecord'
  | 'callAPI'
  | 'sendNotification'
  | 'runScript'
  | 'sendEmail'
  | 'sendSlack'
  // можно расширять дальше
  ;

/**
 * Возможные значения для поля status
 */
export type StatusType = 'success' | 'error';

export interface TriggerConfig {
  cron?: string;
  someOtherField?: string;
}
