class backendErrors extends Error {
  private statusCode: number;
  private status: string;
  private isOperational: boolean;
  constructor(statusCode: number, message: string | undefined) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode <= 500 ? "failed" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default backendErrors;
