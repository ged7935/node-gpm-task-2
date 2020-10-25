import { NextFunction, Request, Response } from "express";

const handleError = (func: Function) => {
    return async (req: Request, res: Response, next: NextFunction) => {        
        try {
            return await func(req, res, next);
        }
        catch (e) {
            next(e);
        }
    };
    
};

export default handleError;