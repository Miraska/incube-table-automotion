export type AutomationTriggerType =
  | 'onCreate'
  | 'onUpdate'
  | 'onDelete'
  | 'scheduled'
  | 'onCreateRecord'
  | 'onUpdateRecord'
  | 'onDeleteRecord'
  | 'onCheck';

export type AutomationActionType =
  | 'updateRecord'
  | 'callAPI'
  | 'sendNotification'
  | 'runScript'
  | 'sendEmail'
  | 'sendSlack';

export type StatusType = 'success' | 'error';

export interface TriggerConfig {
  cron?: string;
  someOtherField?: string;
}
