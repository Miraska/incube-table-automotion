import cmdParser from "@lib/cmd/cmd_parser"
import LOG from "@lib/cmd/log"
import chalk from "chalk"
import readline from "readline"

const RL = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function askQuestion(query: string): Promise<string> {
    return new Promise(resolve => {
        RL.question(query, resolve);
    })
};

(async () => {
    let cmd: string = ""
    try {
        while (cmd !== "exit") {
            console.log(chalk.italic.gray("\nВведите команду (exit для выхода или help для справки)"))
            cmd = await askQuestion(chalk.blue("ENT: "))
            cmdParser(cmd)
        }
    } catch (error) {
        LOG.error("Произошла критическая ошибка")
        console.error(error)
    } finally {
        RL.close()
    }
})()
