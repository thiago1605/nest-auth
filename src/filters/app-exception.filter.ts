import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AppError } from '../errors/index.module';

@Catch(Error)
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof AppError) {
      response
        .status(exception.statusCode)
        .json({ message: exception.message });
    } else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'internal error',
        message: `Internal Server Error: ${exception.message}`,
      });
    }
  }
}
