import {createLogger, transports, format } from 'winston';

const logger = createLogger({
    format: format.json(),
    exitOnError: false,
    transports: [
      new transports.Console({ format: format.simple() }),
    ],
    exceptionHandlers: [
      new transports.Console({ format: format.simple() })
    ],
    rejectionHandlers: [
      new transports.Console()
    ]
  } as any);
  // *** any because winston doesn't have rejectionHandlers for typescript

  export default logger;