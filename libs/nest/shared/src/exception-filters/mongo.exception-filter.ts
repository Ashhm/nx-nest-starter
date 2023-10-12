import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { MongoError } from 'mongodb';
import { Error as MongooseError } from 'mongoose';

@Catch(MongooseError, MongoError)
export class MongooseExceptionFilter implements ExceptionFilter {
  public catch(exception: MongooseError | MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof MongooseError) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Unhandled mongoose error: ' + exception.message,
      });
    } else if (exception instanceof MongoError) {
      if (exception.code === 11000 || exception.code === 11001) {
        return response.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          message: 'Duplicate field value',
        });
      }

      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Unhandled mongodb error: ' + exception.message,
      });
    } else {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Unhandled error: ' + JSON.stringify(exception),
      });
    }
  }
}
