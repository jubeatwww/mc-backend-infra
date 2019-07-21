import * as yargs from 'yargs';
import { Argv, Arguments } from 'yargs';

const devargv: Arguments = yargs.command(['dev', '$0'], '',
    (yarg: Argv) => {
        return yarg
            .commandDir('dev')
            .options({
                'gateway-port': {
                    alias: 'gp',
                    demandOptions: true,
                    default: 3000,
                    describe: 'nginx gateway server port',
                    type: 'number',
                },
                'auth-port': {
                    alias: 'op',
                    demandOptions: true,
                    default: 3001,
                    describe: 'auth server port',
                    type: 'number',
                },
                'api-port': {
                    alias: 'ap',
                    demandOptions: true,
                    default: 3002,
                    describe: 'api server port',
                    type: 'number',
                },
                'nginx-log': {
                    demandOptions: true,
                    default: './nginx-log/',
                },
                'nginx-error-log': {
                    requiresArg: true,
                },
                'nginx-access-log': {
                    requiresArg: true,
                },
            })
            .help();
    },
)
.help()
.argv;
