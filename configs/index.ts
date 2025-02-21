import TriggerType from "./triggers/trigger_type";
import ActionType from "./actions/action_type";
import FieldType from "./fields/field_type";

type StatusType = "success" | "error";

namespace Types {
    export type Trigger = TriggerType;
    export type Action = ActionType;
    export type Field = FieldType;
    export type Status = StatusType;
};

export default Types