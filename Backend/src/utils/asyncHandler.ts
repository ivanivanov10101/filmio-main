import {NextFunction, RequestHandler, Request, Response} from "express";

const asyncHandler = (requestHandler: RequestHandler) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    requestHandler(request, response, next);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default asyncHandler;
