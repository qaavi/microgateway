'use strict';
var _ = require('lodash');
var logger = require('apiconnect-cli-logger/logger.js')
               .child({loc: 'apiconnect-microgateway:error-handler'});

module.exports = function createErrorHandler(options) {

  return function errorHandler(err, req, res, next) {
    logger.debug('Error Handler: ' + JSON.stringify(err))
    var ctxerr = req.ctx.error;
    if (!_.isNil(ctxerr)) {
        res.status(ctxerr.statusCode || 500);
        if (ctxerr.statusMessage)
            res.statusMessage = ctxerr.statusMessage;
        if (ctxerr.headers)
            res.set(ctxerr.headers);
    } else  {
        res.status(500);
    }

    // Update X-Powered-By
    res.setHeader('X-Powered-By', 'IBM API Connect MicroGateway');

    // if the error conform to micro-gw's error format, return directly
    if (err instanceof Error || (_.isPlainObject(err) && err.name)) {
        res.send(err);
    } else {
        res.send({name: "GatewayError", message: "Internal Server Error", value: err.toString()});
    }
  };
};
