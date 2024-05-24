type ErrorType = {
  statusCode: number;
  status: number | "error";
  message: string;
  stack: string;
  error: Error;
  isOperational: boolean;
}

const developmentEnvironmentErrors = (response: any, error: ErrorType) => {
  return response.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};

const productionEnvironmentErrors = (response: any, error: ErrorType) => {
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

const projectHandler = (error: ErrorType, response: any) => {
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
