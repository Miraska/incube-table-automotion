import help from "./help";
import LOG from "./log";

function cmdParser(command: string): void {
    switch (command) {
        case "exit":
            return LOG.success("Выход...");
        case "help":
            LOG.success("Вывод списока команд...\n");
            return help();
        case "create":
            return LOG.success("Вы пытались создать\n");
        case "update":
            return LOG.success("Вы пытались обнговить\n");
        case "delete":
            return LOG.success("Вы пытались удалить\n");
        default:
            return LOG.error("Неизвестная команда");
    }
}

export default cmdParser;
