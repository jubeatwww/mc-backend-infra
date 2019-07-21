import { readFileSync, writeFileSync } from 'fs';
import { spawn, ChildProcess, SpawnOptions } from 'child_process';
import { render } from 'mustache';

export interface TemplateOptions {
    [key: string]: any;
}

export const templateWrite = async (
    templatePath: string,
    options: TemplateOptions,
    targetPath: string,
): Promise<void> => {
    const template: string = await readFileSync(templatePath).toString();
    const rendered = render(template, {...options});
    await writeFileSync(targetPath, rendered);
};

export type ExecCmd = [string, string[]];

export interface ExecConfig extends Object {
    readonly name?: string;
    spawnOption?: object;
}

const isExecCmd = (cmd: string | ExecCmd): cmd is ExecCmd => {
    return cmd instanceof Array;
};

/* tslint:disable no-console */
export function exec(cmd: string | ExecCmd, config?: ExecConfig): ChildProcess {
    let name = cmd;
    let spawnOption: SpawnOptions;
    if (config) {
        name = config.name ? config.name : name;
        spawnOption = config.spawnOption;
    }

    let proc: ChildProcess;
    if (isExecCmd(cmd)) {
        proc = spawn(cmd[0], cmd[1], spawnOption);
    } else {
        proc = spawn(cmd, spawnOption);
    }

    proc.stdout.on('data', (data) => {
        console.log(`${name}: stdout: ${data}`);
    });
    proc.stderr.on('data', (data) => {
        console.error(`${name}: stderr: ${data}`);
    });
    proc.on('close', (code) => {
        console.log(`child process \`${name}' exited with code ${code}`);
    });

    return proc;
}
/* tslint:enable no-console */
