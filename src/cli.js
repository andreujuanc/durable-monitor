import meow from 'meow'
import { monitor } from './main'

function getOptions() {
    const cli = meow(`
	Usage
	  $ durable-monitor <app> [options]

    app:  App name in azure

    Options
      --code,           -c  Durable function authentication code
      --from,           -f  ISO time to filter data from (shortcut=>NOW )
      --status          -s  Shows data grouped by custom status
      --exclude         -e  Excludes orchestrators by name
      --delay           -d  Refresh rate, in seconds (default 2s)
      --help                This help
      --version         -v  Shows version 
      
	Examples
      $ durable-monitor MyFunctionsApp --code 6F6F6F66F6F6F6
      $ durable-monitor MyFunctionsApp --code 6F6F6F66F6F6F6 --from 2020-02-01T10:12:00Z
`, {
        flags: {
            code:{
                type: 'string',
                alias: 'c'
            },
            from: {
                type: 'string',
                alias: 'f'
            },
            status:{
                type: 'boolean',
                alias: 's'
            },
            exclude: {
                type: 'array',
                alias: 'e'
            },
            delay: {
                type: 'number',
                alias: 'd'
            },
            help: {
                type: 'boolean',
                alias: 'h'
            },
            version: {
                type: 'boolean',
                alias: 'v'
            }
        }
    });
    return cli;
}

export function cli() {
    const opts = getOptions()
    if (!opts || !opts.flags || opts.input.length === 0 || opts.flags.help)
        console.log(opts.showHelp());
    else
        monitor(opts.input[0], opts.flags)
}