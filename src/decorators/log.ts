import logger from '../loggers/logger';

const log = (target: Object, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
        try {
            const result = await originalMethod.apply(this, args);
            logger.info(`Method Name: ${target.constructor.name}.${propertyKey} | Arguments: ${JSON.stringify(args)}`);
            return result;
        }
        catch (e) {
            logger.error(`Method Name: ${target.constructor.name}.${propertyKey} | Arguments: ${JSON.stringify(args)} | Error Message: ${e.message}`);
            throw e;
        }
    };
    return descriptor;
};

export default log;