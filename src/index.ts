import express, { NextFunction, Request, Response } from 'express';
import createHttpError, { HttpError } from 'http-errors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import { ERROR_MESSAGE } from '../constants'
import { MODULES_LIST } from '../routes'

// Express port configuration
const PORT_NUMBER = process.env.PORT || 3000;

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Service is up!');
})

// Load modules: authentication, task, etc.
MODULES_LIST.forEach((module) => app.use(module.PATH, module.ROUTER))

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createHttpError[404](ERROR_MESSAGE.INVALID_RESOURCE_URL))
})

// error handler
app.use(function (err: HttpError, req: Request, res: Response, next: NextFunction) {
  switch (err.statusCode || err.code) {
    default:
      res.status(err.statusCode || 500).send({
        name: err.name,
        message: err.message,
        statusCode: err.statusCode || 500
      });
  }
});

// Start server
app.listen(PORT_NUMBER, () => { console.log(`Server running on port ${PORT_NUMBER}`); }); 