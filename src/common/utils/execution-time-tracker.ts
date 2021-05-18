import dotenv from 'dotenv';

dotenv.config();

const isPerformanceTrackingEnabled = process.env.PERF_TRACK === 'true';

const yellowFontColor = '\x1b[33m%s\x1b[0m';

const executionTimeTracker = (): MethodDecorator => {
  return (
    target: Record<string, any>,
    propertyName: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    const originalMethod = descriptor.value;

    if (isPerformanceTrackingEnabled) {
      descriptor.value = async function decoratedOriginalMethod(
        ...args: any[]
      ) {
        const start = process.hrtime();
        const result = await originalMethod.apply(this, args);
        const [sec, ms] = process.hrtime(start);
        const executionTime = `time: ${sec}s ${ms / 10e6}ms`;

        console.log(
          yellowFontColor,
          // eslint-disable-next-line max-len
          `[EXECUTION TIME] ${executionTime}, method: ${propertyName.toString()}`
        );

        return result;
      };
    }
  };
};

export { executionTimeTracker };
