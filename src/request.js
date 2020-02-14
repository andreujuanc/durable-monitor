import fetch from 'node-fetch'
import { table, getBorderCharacters } from 'table'
import chalk from 'chalk'

export async function request(appname, authcode, fromtime, excludeList, status) {

    if (!appname) {
        throw new Error('appname is mandatory')
    }

    if (!excludeList) {
        excludeList = []
    }

    if (typeof status === 'undefined') {
        status = false
    }

    try {

        var response = await fetch(
            `https://${appname}.azurewebsites.net`
            + '/runtime/webhooks/durabletask/instances?'
            //+ '&runtimeStatus=Pending,Running' // TODO 
            + (fromtime ? '&createdTimeFrom=' + fromtime : '')
            + (authcode ? '&code=' + authcode : '')
        )

        const rawData = await response.json();

        var filteredData = rawData
            .filter(x => !excludeList.includes(x.name))

        console.clear()

        var items = filteredData.reduce((p, c) => {
            if (typeof c.customStatus === 'object')
                return p
            if (!(c.customStatus in p))
                p[c.customStatus] = 0
            p[c.customStatus]++
            return p
        }, {})

        function toTable(object) {
            const keys = Object.keys(object)
            if (keys.length === 0) return []

            return keys.map(x => [chalk.green(x), chalk.yellowBright(object[x])])
        }

        const data = [
            [chalk.bold('STATUS:'), appname],
            [chalk.white('Total'), filteredData.length],
            [chalk.yellow('Pending'), filteredData.filter(x => x.runtimeStatus == "Pending").length],
            [chalk.green('Running'), filteredData.filter(x => x.runtimeStatus == "Running").length],
            [chalk.blue('Completed'), filteredData.filter(x => x.runtimeStatus == "Completed").length],
            [chalk.red('Failed'), filteredData.filter(x => x.runtimeStatus == "Failed").length]
        ];

        const config1 = {
            border: getBorderCharacters(`void`),
            singleLine: true,
            columns: {
                0: {
                    alignment: 'left',
                },
                1: {
                    alignment: 'right'
                }
            }
        }

        const output = table(data, config1);
        console.log(output);

        if (status === true) {
            const config2 = {
                border: getBorderCharacters(`void`),
                singleLine: true,
                columns: {
                    0: {
                        alignment: 'left',
                        width: 60
                    },
                    1: {
                        alignment: 'right'
                    }
                }
            }

            const output2 = table([[chalk.bold('Custom Status:'), ' '], ...toTable(items)], config2);
            console.log(output2);
        }

    } catch (ex) {
        throw ex;
    }
}