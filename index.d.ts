import { APIGatewayEvent, ProxyResult, APIGatewayProxyCallback } from "aws-lambda"

export type Responder = (err: Error, data: string | ProxyResult)=> void

export interface Options {responseType: string, bodyType: string}

export type MethodHandler = (path: string, response: Responder, options?: Options)=> void

export default class AWSLambdaRouter {

  public serve: (event: APIGatewayEvent, callback: APIGatewayProxyCallback)=> void

  public get: MethodHandler

  public post: MethodHandler

  public delete: MethodHandler

  public useCors: (option: boolean)=> void
}



