import { HTTP_STATUS } from "src/utils/constants";

export class CustomError extends Error {
  public readonly statusCode: number;
  public readonly description?: any;

  constructor(message: string, statusCode: number, description?: any) {
    super(message);
    this.statusCode = statusCode;
    this.description = description;
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string = 'Resource Not Found') {
    super(message, HTTP_STATUS.NOT_FOUND);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string = 'Unauthorized') {
    super(message, HTTP_STATUS.UNAUTHORIZED);
  }
}
