import HttpException from "./HttpException.js"

export default (func) => (req, res, next) => func(req, res, next).catch((error) => {
    if (error instanceof Error) {
        let status = 500;
        if (error instanceof HttpException) status = error.status;
        res.status(status).json({
            message: error.message
        });
    } else {
        res.status(500).send(error);
    }
    console.log(error);
});
