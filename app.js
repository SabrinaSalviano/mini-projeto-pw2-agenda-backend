var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');
var swaggerJSDoc = require('swagger-jsdoc');
var swaggerUi = require('swagger-ui-express');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
var contatoRouter = require('./routes/contato');
var db = require('./config/db.config');
const User = db.user;

const cors = require('cors');
const { sequelize } = require('./config/db.config');

setInterval(async () =>{
  try{
    const users = await User.findAll({
    where:{
      status:false
    }
  })
  for (const user of users){
    let startTime = new Date(user.createdAt);
    let endTime = new Date();
    let dif = endTime - startTime;
    let timeDif = dif / 1000/ 60;

    console.log(timeDif);

    if (timeDif > 60) {
      try {
        user = User.destroy({
          where: {
            id: user.id
          }
        });
      } catch(err) {
        res.json({ message: err.message });
      }}
    }
  }catch(err){
    return err;
  }}, 1000);

var swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API REST Express de um gerenciador simples de contatos.',
    version: '1.0.0',
    description: ('Esta e uma aplicacao de API REST feita com Express.' +
                  'Ela utiliza dados de uma agenda de contatos.'),
   
    contact: {
      name: 'Sabrina Salviano e Wotson Sula',
    },

  },
  servers: [
    {
      url: 'https://api-agenda.onrender.com/',
      description: 'Development server',
    },
  ],
};
var options = {
  swaggerDefinition,
  apis: ['./routes/user.js', './routes/contato.js'],
};
var swaggerSpec = swaggerJSDoc(options);

var app = express();

// config dotenv and sequelize
dotenv.config();
db.sync();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors()); //permitir que aceite requisicoes de outros locais

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/contato', contatoRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { title: 'Express' });
});

module.exports = app;
