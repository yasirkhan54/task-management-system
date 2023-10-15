import { Request, Response, NextFunction } from 'express'
import { validate } from 'class-validator';
import { plainToClass, plainToInstance } from 'class-transformer';

export const validatorMiddleware = (validationClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;

    const object = plainToInstance(validationClass, data);
    const errors = await validate(object);
    
    if (errors.length > 0) {
      const errorObject: any = {};
      errors.forEach((error: any) => {
        for (const constraint in error.constraints) {
          if (!errorObject[error.property]) {
            errorObject[error.property] = [];
          }
          errorObject[error.property].push(error.constraints[constraint]);
        }
      });
      return res.status(400).json({ errors: errorObject });
    }

    next();
  };
}