import chalk from "chalk";

export default function help(): void {
    console.log(chalk.bold("Основные команды:"))
    console.log(chalk.cyan("help"), "— выводит список команд;");
    console.log(chalk.cyan("exit"), "— выходит из программы;");
    console.log(chalk.cyan("create"), "— создать новую запись в таблице бд;");
    console.log(chalk.cyan("update"), "— обновить запись в таблице бд;");
    console.log(chalk.cyan("delete"), "— удалить запись в бд;");
};