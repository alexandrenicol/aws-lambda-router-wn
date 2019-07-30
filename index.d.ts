import { APIGatewayEvent, APIGatewayProxyResult, Callback } from "aws-lambda"

export type Responder = (err: Error, data?: string | {})=> void

export interface Options {responseType?: string, bodyType?: string, headers?: {}}

export type RouteHandler = (request: APIGatewayEvent, response: Responder)=> void

export type MethodHandler = (path: string, handler: RouteHandler, options?: Options)=> void

declare class AWSLambdaRouter {
  constructor()
  public serve: (event: APIGatewayEvent, callback: Callback<APIGatewayProxyResult>)=> void
  public get: MethodHandler
  public post: MethodHandler
  public delete: MethodHandler
  public useCors: (option: boolean)=> void
}

export default AWSLambdaRouter