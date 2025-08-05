class ApiError {
    constructor(statusCode, message , err){
        this.statusCode = statusCode;
        this.message = message; 
        this.err = err || null ;
    }
}
export {
    ApiError
}