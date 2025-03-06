// src/automations/automation.types.ts
export type AutomationTriggerType =
  | 'onCreate'
  | 'onUpdate'
  | 'onDelete'
  | 'scheduled'
  | 'onCheck'
  | 'recordMatchesConditions'
  | 'formSubmitted'
  | 'buttonPressed';

export type AutomationActionType =
  | 'updateRecord'
  | 'callAPI'
  | 'sendNotification'
  | 'runScript'
  | 'sendEmail'
  | 'sendSlack'
  | 'createRecord'
  | 'deleteRecord';

export type StatusType = 'success' | 'error';

export interface TriggerConfig {
  cron?: string;
  // Можете расширять под другие триггеры
}
