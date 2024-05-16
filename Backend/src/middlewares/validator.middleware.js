import customError from "../utils/customErrorHandler.js";

const validate = (schema) => async (request, response, next) => {
  try {
    request.body = await schema.parseAsync(request.body);
    next();
  } catch (err) {
    next(new customError(422, err.errors[0].message));
  }
};

export default validate;
