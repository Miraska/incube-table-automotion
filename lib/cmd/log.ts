import chalk from "chalk";

interface ILog {
    error: (message: string | unknown) => void;
    warning: (message: string) => void;
    success: (message: string) => void;
    info: (message: string) => void;
}

const LOG: ILog = {
    error: (msg: string | unknown): void => {
        console.error(chalk.red("ERR:"), msg);
    },
    warning: (msg: string): void => {
        console.warn(chalk.yellow("WAR:"), msg);
    },
    success: (msg: string): void => {
        console.log(chalk.green("SUC:"), msg);
    },
    info: (msg: string): void => {
        console.info(chalk.cyan("INF:"), msg);
    },
};

export default LOG;
