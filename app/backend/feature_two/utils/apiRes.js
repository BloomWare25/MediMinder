class ApiRes {
    constructor(statusCode = 200 , data = null , message){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
    }
}

export {
    ApiRes
}