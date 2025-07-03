class ApiError extends Error {
    constructor(
        statusCode , message = "something went wrong" , errs = [] , stack = "" ){
            super(message)
            this.statusCode = statusCode ,
            this.data = null ,
            this.message = message ,
            this.success = false ,
            this.errors = errs 

            if(stack){
                this.stack = stack
            }else{
                Error.captureStackTrace(this , this.constructor)
            }
    }
}

export {ApiError}