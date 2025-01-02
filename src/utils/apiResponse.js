/**
 * this class will help us in creating a standard and simple way to manage  api responses
 * this will help in incresing code reusibility
 */
class apiResponse {
    constructor (statusCode,data,message="success"){
        this.data=data;
        this.statusCode=statusCode;
        this.message=message;
        this.success=statusCode < 400
    }
}

export {apiResponse}