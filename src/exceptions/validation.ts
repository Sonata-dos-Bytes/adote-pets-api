import { ErrorCodes, HTTP_STATUS } from "src/utils/constants";
import { HttpException } from "./root";

export class UnprocessableEntity extends HttpException {
    constructor(message: string, errors: any = null) {
        super(message, ErrorCodes.VALIDATION_ERROR, HTTP_STATUS.UNPROCESSABLE_ENTITY, errors);
    }
}