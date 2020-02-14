import chalk from 'chalk'
import { Observable } from 'rxjs'
import { request } from './request'

export async function monitor(appname, flags) {
    let from = flags.from;
    if (from && from.toLocaleLowerCase() === 'now'.toLocaleLowerCase()) {
        from = new Date(Date.now()).toISOString()
    }
    const maintask = async () => {
        while (true) {
            await request(appname, flags.code, from, flags.exclude, flags.status)
            await delay(flags.delay || 2)
        }
    }

    await maintask()
}

function delay(sec) {
    return new Promise(function (success) {
        setTimeout(success, sec * 1000)
    })
}