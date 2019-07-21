import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';
import { resolve } from 'path';
import { homedir } from 'os';

import * as appRoot from 'app-root-path';
import * as Mustache from 'mustache';
import { Arguments, Argv } from 'yargs';

import { templateWrite, exec } from '../utils';

exports.command = ['local', '$0'];
exports.desc = 'Build up local dev server';

exports.builder = (yargs: Argv) => {
    return yargs.options({
        'auth-server-path': {
            alias: 'osp',
            demandOptions: true,
            default: resolve(homedir(), 'motacheng-backend-auth'),
        },
        'api-server-path': {
            alias: 'asp',
            demandOptions: true,
            default: resolve(homedir(), 'motacheng-backend-api'),
        },
    });
};

exports.handler = async (argv: Arguments): Promise<void> => {
    console.log(argv);
    const { gp, op, ap, authServerPath, apiServerPath } = argv;

    const isNginxRunning = await fs.existsSync('/var/run/nginx.pid');
    if (isNginxRunning) {
        const nginxConfPath = appRoot.resolve('src/templates/default.conf.mustache');
        templateWrite(
            nginxConfPath,
            {
                auth_ip: 'localhost',
                api_ip: 'localhost',
                gateway_port: gp,
                auth_port: op,
                api_port: ap,
            },
            '/etc/nginx/conf.d/default.conf',
        );
        exec('nginx -s reload', {
            spawnOption: {
                env: { PATH: process.env.PATH },
                shell: true,
            },
        });
    } else {
        exec('nginx -g "daemon off;"', {
            spawnOption: {
                env: { PATH: process.env.PATH },
                shell: true,
            },
        });
    }

    exec('yarn install && yarn run start:dev', {
        name: 'authServer',
        spawnOption: {
            cwd: authServerPath,
            env: { PORT: op.toString(), PATH: process.env.PATH },
            shell: true,
        },
    });

    exec('yarn install && yarn run start:dev', {
        name: 'apiServer',
        spawnOption: {
            cwd: apiServerPath,
            env: { PORT: ap.toString(), PATH: process.env.PATH },
            shell: true,
        },
    });
};
