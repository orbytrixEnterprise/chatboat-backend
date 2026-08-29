/****************************
 EXPRESS AND ROUTING HANDLING
 ****************************/
import timeout from 'connect-timeout';
import express from 'express';
import limiter from 'express-rate-limit';
import expressSanitizer from 'express-sanitizer';
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { Global } from '.';
import { swaggerDocument } from '../swagger-document';
import * as routes from "../app/route";

export const expressConfig = function () {

  const app = express();

  app.set("trust proxy", 1);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  // serve swagger
  app.get('/swagger.json', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocument);
  });
  app.use(express.urlencoded({ limit: "50mb", extended: true}));
  app.use(express.json({ limit: '50mb' }));
  app.use(helmet());
  app.use(expressSanitizer());
  app.use(limiter({
    windowMs: 60000,
    max: 100,
    message: {
      status: 0,
      message: "Too many requests, please try again later."
    }
  }));

  // =======   Settings for CORS
  app.options("/*", function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization ");
    res.header('Access-Control-Allow-Credentials', "*");
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    res.sendStatus(200);
  });
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  });

  app.use(timeout(12000000));

  function haltOnTimedOut(req: any, res: any, next: any) {
    if (!req.timedout) {
      next();
    }
  }

  app.use(haltOnTimedOut);

  // =======   Routing
  Object.values(routes).forEach((route) => route(app, express));

  app.use(express.static('public'));
  app.use(Global.notFound);

  return app;
};
