import chalk from "chalk";

export default function help(): void {
    console.log(chalk.bold("Основные команды:"))
    console.log(chalk.cyan("help"), "— выводит список команд;");
    console.log(chalk.cyan("exit"), "— выходит из программы;");
};