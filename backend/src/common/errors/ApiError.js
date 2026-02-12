class ApiError extends Error {
    
    constructor(status, message, details = null) {
        super(message); // from object Error
        this.status = status;
        this.details = details;
    }

    static badRequest(message = "Bad Request", details = null) {
        return new ApiError(400, message, details);
    }

    static unauthorized(message = "Unauthorized", details = null) {
        return new ApiError(401, message, details);
    }

    static forbidden(message = "Forbidden", details = null) {
        return new ApiError(403, message, details);
    }

    static notFound(message = "Not Found", details = null) {
        return new ApiError(404, message, details);
    }

    static conflict(message = "Conflict", details = null) {
        return new ApiError(409, message, details);
    }

    static internal(message = "Internal Server Error", details = null) {
        return new ApiError(500, message, details);
    }
}

module.exports = ApiError;
