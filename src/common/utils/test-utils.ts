import { NextFunction } from 'express';

const nextFunction: NextFunction = () => {};

const mockError = new Error('Test error');

export { nextFunction, mockError };
