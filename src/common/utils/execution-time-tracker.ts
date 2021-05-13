const environment = process.env.NODE_ENV || 'development';

const executionTimeTracker = (): MethodDecorator => {
  return (
    target: Record<string, any>,
    propertyName: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    const originalMethod = descriptor.value;

    if (environment !== 'production') {
      descriptor.value = async function decoratedOriginalMethod(
        ...args: any[]
      ) {
        const start = process.hrtime();
        const result = await originalMethod.apply(this, args);
        const [sec, ms] = process.hrtime(start);
        const executionTime = `time: ${sec}s ${ms / 10e6}ms`;

        console.log(
          '\x1b[33m%s\x1b[0m',
          // eslint-disable-next-line max-len
          `[EXECUTION TIME] ${executionTime}, method: ${propertyName.toString()}`
        );

        return result;
      };
    }
  };
};

export { executionTimeTracker };
