export const noNestedActionsExample = {
    summary: 'Create Automation (no nested actions)',
    value: {
      name: 'Automation OnCreate Field',
      triggerType: 'onCreate',
      tableIdOrName: 'Fields table',
      conditions: null,
    },
  };
  
  export const nestedActionsExample = {
    summary: 'Create Automation (nested actions)',
    value: {
      name: 'Automation 1',
      triggerType: 'onCreate',
      tableIdOrName: 'Fields table',
      conditions: 'scheduled',
      actions: {
        create: [
          {
            order: 1,
            type: 'script',
            params: {
              message: 'A new Field record was created!',
            },
          },
        ],
      },
    },
  };
  
  export const scheduledAutomationExample = {
    summary: 'Create Scheduled Automation (cron)',
    value: {
      name: 'Run every minute',
      triggerType: 'scheduled',
      tableIdOrName: null,
      triggerConfig: {
        cron: '* * * * *',
      },
      actions: {
        create: [
          {
            order: 1,
            type: 'sendNotification',
            params: {
              message: 'Scheduled job triggered',
            },
          },
        ],
      },
    },
  };
  
  export const scriptAutomationExample = {
    summary: 'Create Script Automation',
    value: {
      name: '1',
      triggerType: 'onCheck',
      conditions: null,
      enabled: true,
      actions: {
        create: [
          {
            order: 1,
            type: 'runScript',
            params: {
              script:
                '(async () => { try { const table = base.getTable("NewTable"); if (!table) { throw new Error("Table \\"NewTable\\" not found"); } const records = await table.selectRecordsAsync(); console.log("Found records:", records); return records; } catch (error) { console.error("Error in script:", error); throw error; } })();',
            },
          },
        ],
      },
    },
  };
  
  // Можно объединить все примеры в один объект для удобства:
  export const createAutomationExamples = {
    noNestedActions: noNestedActionsExample,
    nestedActions: nestedActionsExample,
    scheduledAutomation: scheduledAutomationExample,
    scriptAutomation: scriptAutomationExample,
  };
  