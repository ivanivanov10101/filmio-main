const developmentEnvironmentErrors = (response, error) => {
  return response.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};

const productionEnvironmentErrors = (response, error) => {
  if (error.isOperational) {
    return response
      .status(error.statusCode)
      .json({ status: error.statusCode, message: error.message });
  } else {
    return response.status(error.statusCode).json({
      status: "error",
      message: "Something went wrong! Please try again later!",
    });
  }
};

const projectHandler = (error, request, response) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    developmentEnvironmentErrors(response, error);
  } else if (process.env.NODE_ENV === "production") {
    productionEnvironmentErrors(response, error);
  } else {
    response.status(500).json({ message: "NODE Error!!" });
  }
};

export default projectHandler;
