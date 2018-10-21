import { APIGatewayEvent, ProxyResult, APIGatewayProxyCallback } from "aws-lambda"

export type Responder = (err: Error, data: string | ProxyResult)=> void

export interface Options {responseType: string, bodyType: string}

export type MethodHandler = (path: string, response: Responder, options?: Options)=> void

export interface AWSLambdaRouter {

  serve: (event: APIGatewayEvent, callback: APIGatewayProxyCallback)=> void,

  get: MethodHandler,

  post: MethodHandler,

  delete: MethodHandler,

  useCors: (option: boolean)=> void
}


declare function router(): AWSLambdaRouter;

export default router



