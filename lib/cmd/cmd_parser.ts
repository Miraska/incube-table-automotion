import help from "./help"
import LOG from "./log"

function cmdParser(command: string): unknown {
    switch (command) {
        case "exit":
            return LOG.success("Выход...")
        case "help":
            LOG.success("Вывод списока команд...\n")
            return help()
        default:
            return LOG.error("Неизвестная команда")
    }
}

export default cmdParser
