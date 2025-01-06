/**
 * here we are wrapping any fuction to execute any asyncronus function
 * now after exporting this function we can simply use this to execute any asyncronus function
 * anywhere.
 */


// this is one of the ways to do it

// here in this function the innerfunction  will act as middleware which will execute try catch here and look for rejection here
// if it get any rejection then it will pass it to the next error handling middleware.
// we use it because we don't want to use try and catch repeatidily for catching any rejection.
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        return Promise.resolve(requestHandler(req, res,next)).catch(error => next(error))
    } 
}

export {asyncHandler}

// try catch way to wrapp the asynchronus functions
/**
 * const asyncHandler=(requestHandler)=> async (req,res,next)=>{
 *    try{
 *        await requestHandler(req,res,next);
 *      }
 *      catch(error){
 *        res.send(err.code || 500).json({
 *         success:false,
 *         message:err.message
 *         })
 *      }
 * }
 */