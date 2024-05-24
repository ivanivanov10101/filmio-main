import backendErrors from "../utils/backendErrorsHandler.ts";
import { Request, Response, NextFunction } from "express";
import {ZodSchema} from "zod";

const validate = (schema: ZodSchema) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    request.body = await schema.parseAsync(request.body);
    next();
  } catch (error: any) {
    next(new backendErrors(422, error.errors[0].message));
  }
};

export default validate;
