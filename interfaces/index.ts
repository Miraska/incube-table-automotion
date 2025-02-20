import Types from "@configs";


interface IJsonTriggerConfig {
    table: string;
    record: string;
}

// Доделать
interface IAutomation {
    id: string;
    name: string;
    trigger_config: IJsonTriggerConfig;
    trigger_type: Types.Trigger;
    enabled: boolean;
    created_by: string;
}

namespace Interfaces {
    export type JsonTriggerConfig = IJsonTriggerConfig;
    export type Automation = IAutomation;
};

export default Interfaces