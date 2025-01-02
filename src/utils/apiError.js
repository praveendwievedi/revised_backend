/**
 * this custom class help us to give a standard error to the api requests
 */

class apiError extends Error {
    constructor(
        statusCode=false,
        message="Something went wrong",
        errors=[],
        stack="",
    ){
        super(message);
        this.statusCode = statusCode;
        this.errors=errors;
        this.data=null;
        this.message=message;

        // here the stack is being created to tell about the point at which the error originated
        if(stack){
            this.stack=stack;
        }else{
            // this method  Error.captureStackTrace is used to create a new stack
            // here this.constructor is helping it to realise about the point where it will search for the error point..
            Error.captureStackTrace(this, this.constructor);
        }
    }
}


export {apiError}