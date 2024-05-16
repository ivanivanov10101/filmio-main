const devErros = (response, error) => {
  return response.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};

const prodErrors = (response, error) => {
  if (error.isOperational) {
    return response
      .status(error.statusCode)
      .json({ status: error.statusCode, message: error.message });
  } else {
    return response.status(error.statusCode).json({
      status: "error",
      message: "Something went wrong! Please try again later",
    });
  }
};

const projectHandler = (error, request, response) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    devErros(response, error);
  } else if (process.env.NODE_ENV === "production") {
    prodErrors(response, error);
  } else {
    response.status(500).json({ message: "NODE_ENV Error!!" });
  }
};

export default projectHandler;
