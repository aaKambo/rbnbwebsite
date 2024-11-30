module.exports = (fn) => {
    return function(req, res, next) {
        fn(req, res, next).catch(next); // This will catch and pass errors to next()
    };
};
