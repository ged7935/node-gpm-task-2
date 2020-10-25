import logger from '../loggers/logger';
import { performance } from 'perf_hooks';

const elapsed = (target: Object, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
        const start = performance.now();
        const result = await originalMethod.apply(this, args);
        logger.info(`${target.constructor.name}.${propertyKey} ran in ${performance.now() - start} ms`)
        return result;
    };
    return descriptor;
};

export default elapsed;