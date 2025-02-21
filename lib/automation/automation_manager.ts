import Interfaces from "@interfaces";
import LOG from "@lib/cmd/log";

export default function automationManager(automation?: Interfaces.Automation): void {
    if (automation) {
        switch(automation.triggerType) {
            case "onUpdate":
                console.log(LOG.info("Это автоматизация срабатывает при обновлении (onUpdate)"));
                break;
            case "onCreate":
                console.log(LOG.info("Это автоматизация срабатывает при создании записи (onCreate)"));
                break;
            case "onDelete":
                console.log(LOG.info("Это автоматизация срабатывает при удалении записи (onDelete)"));
                break;
            default:
                console.log(LOG.error("Неизвестный триггер автоматизации!!!"));
                break
        }
    } else {
        console.log(LOG.error("Автоматизация не переданна в менеджер"));
    }
}