class APIResponse {
  private status: number;
  private data: string | undefined | Object;
  private message: string;
  private success: boolean;
  constructor(statusCode: number, data: string | undefined | Object | null, message = "success") {
    this.status = statusCode;
    data && (this.data = data);
    this.message = message;
    this.success = statusCode < 400;
  }
}

export default APIResponse;
