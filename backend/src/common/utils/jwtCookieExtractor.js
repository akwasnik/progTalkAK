module.exports = function cookieExtractor(req) {
    if (req && req.cookies) {
        return req.cookies.token || null;
    }
    return null;
};
