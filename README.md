# nodejs-epam

## TASK 5.1

- Add express middleware which will log which service method has been invoked and which arguments have been passed to it.

## TASK 5.2

- Add express middleware which will log all unhandled errors and return a standard message with HTTP code 500 (Internal Server Error).

  Remark: Do not modify the status code and the message for other errors like validation errors from the previous task.

- Add error handling to process.on ('uncaughtException', ...).
- Add Unhandled promise rejection listener to log errors.

## TASK 5.3

- Every method in the controllers should log the errors which should include the following information:
  - method name;
  - arguments which have been passed to the method;
  - error message.
