const express = require('express');
const dotenv = require('dotenv');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoSanatize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const helmet = require('helmet');
const hpp = require('hpp');
const bodyParser = require('body-parser');
const ErrorHandler = require('./middlewares/ErrorHandler');
const fileUpload = require('express-fileupload');
const createHttpError = require('http-errors');
const AuthRouter = require('./routes/auth/index');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
// 1 ) Enviroment

dotenv.config({ path: './config.env' });

// 2) MiddleWares Globals

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cookieParser());
app.use(express.static(`${__dirname}/public`));
app.use(cors(corsOptions));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.urlencoded({ extended: true, trim: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
// 3 Middleware Routes
app.use('/api/auth', AuthRouter);

// 5 ) Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'User API',
      description: 'API for user registration, login, and profile retrieval',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:8000/api/auth',
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./doc.yaml'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// app.use(ErrorHandler);

// !! Middleware Error Handler
app.use(async (req, res, next) => {
  next(createHttpError.NotFound('This Route doest not exist.'));
});

app.use(async (err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    data: {},
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

// 4 ) helmet Securety http header , Data Sanitazion against NOSQL Query Injection , Data Sanitazion against XSS

app.use(mongoSanatize());
app.use(xss());
app.use(hpp());
app.use(helmet());

// 5 ) Swagger

module.exports = app;
