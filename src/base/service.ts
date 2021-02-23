export default class Service {
  successResponse(message?: string, data?: any){
    return {
      code: 200,
      message: message || null,
      data: data || null
    }
  }

  errorResponse(message: any, code: number = 500){
    return {
      code,
      message
    }
  }
}
