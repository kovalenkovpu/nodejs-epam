# nodejs-epam

## TASK 6.1

Add authorization to the already existing REST service.

- Add `login(username, password)` method which should return JWT token.
- Add a middleware which will proxy all the requests (except login) and check that HTTP Authorization header has the correct value of JWT token.
- In case of the HTTP Authorization header is absent in the request, the middleware should stop further controller method execution and return HTTP 401 code (Unauthorized Error) and standard error message.
- In case of HTTP Authorization header has invalid JWT token in the request, the middleware should return HTTP code 403 (Forbidden Error) and standard error message.

## TASK 6.2

Add CORS middleware to access service methods from WEB applications hosted on another domains (https://github.com/expressjs/cors).

## EXTRA (self-study):

Intorduce DI and IoC (inversify)
