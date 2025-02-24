
// export const catchAsync = (fn) => {
//   return (req, res, next) => {
//     fn(req, res, next).catch(next);
//   };
// };

export const catchAsync = (fn) => {
    return async (req, res, next) => {
      try {
        await fn(req, res, next); // ✅ Ensure the function runs
      } catch (error) {
        next(error); // ✅ Pass error to the global error handler
      }
    };
  };
  
