import { Arguments, Argv } from 'yargs';
import * as Docker from 'dockerode';

exports.command = 'docker';
exports.desc = 'Build up local dev server in docker';
exports.builder = (yargs: Argv) => {
    return yargs.options({
            'protocol': {
                default: 'sock',
                choices: ['http', 'https', 'unix', 'sock'],
                type: 'string',
            },
            'host': {
                alias: 'h',
                default: 'localhost',
                type: 'string',
            },
            'port': {
                alias: 'p',
                default: 2375,
                type: 'number',
            },
            'socket-path': {
                alias: 's',
                default: '/var/run/docker.sock',
                type: 'string',
            },
        }).help();
};

exports.handler = (argv: Arguments) => {
    console.log(argv);
    const { protocol } = argv;

    let dockerApiInfo;
    if (protocol === 'sock') {
        dockerApiInfo = { socketPath: argv.socketPath };
    } else {
        const { host, port } = argv;
        dockerApiInfo = { protocol, host, port };
    }
    const docker = new Docker(dockerApiInfo);
    console.log(docker.version());
    docker.listContainers((err, containers) => {
        console.log(containers);
    });
};
