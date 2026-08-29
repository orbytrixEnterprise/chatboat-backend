import { createLogger, format, config } from 'winston';
import dailyRotateFile from 'winston-daily-rotate-file';
const { combine, timestamp, printf } = format;

export const applicationLogger = createLogger({
    levels: config.syslog.levels,
    format: combine(
        timestamp({
            format: 'HH:mm:ss'
        }),
        printf((info) => {
            const { timestamp: ts, level, message, ...rest } = info;
            const logObject = { level, message, timestamp: ts, ...rest };
            return JSON.stringify(logObject, null, 2) + ',';
        })
    ),
    transports: [
        new dailyRotateFile({
            dirname: './public/logs',
            filename: '%DATE%.log',
            datePattern: 'DD-MM-YYYY',
            zippedArchive: false,
            maxFiles: '30d'
        })
    ]
});
