/**
 * here we are wrapping any fuction to execute any asyncronus function
 * now after exporting this function we can simply use this to execute any asyncronus function
 * anywhere.
 */


// this is one of the ways to do it
const asyncHandler= (requestHandler)=>{
    (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch(error => (next(error)))
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