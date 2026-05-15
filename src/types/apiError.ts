export class ApiError extends Error {
  public res: Response;
  public status: number;

  constructor(res: Response, message?: string) {
    super(message);
    this.res = res;
    this.status = res.status;
  }
}
