const db = require('../config/db.config');
const User = db.user;

const ActiveAccount = require('../utils/authSendToken');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('express');

// Cadastrar usuário
exports.userCreate = async(req, res) => {
  let user = null;
  try {
    user = await User.findOne({
      where: {
        email: req.body.email
      }
    });
  } catch(err) {
    res.json({ message: err.message} );
  }

  if (user != null) {
    return res.status(400).json({ message: 'E-mail já cadastrado.'} );
  }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    const newUser = Object.assign({}, req.body);
    newUser.password = hashedPassword;

  try {
    user = await User.create(newUser);
    ActiveAccount({id: user.id, email: user.email, username: user.username});
    res.json({ usuario: user.id });
  } catch(err) {
    res.json({ message: err.message} );
  }
};

// Fazer login
exports.userLogin = async(req, res) => {
  let user = null;
  try {
    user = await User.findOne({
      where: {
        email: req.body.email
      }
    });
  } catch(err) {
    res.json({ message: err.message });
  }

  const message = 'E-mail ou senha inválidos.';
  if (user == null) {
    return res.status(400).json({ message: message });
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).json({ message: message });
  }

  if(!user.status){
    return res.status(400).json({ message: 'Esta conta ainda não foi ativada, verifique seu email e ative imeidiatamente!!!' });
  }

  const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET);
  res.header('Auth-Token', token).json({ token: token, idUser: user.id, admin: user.admin });
};

// Ativar conta 
exports.userActive = async(req, res) => {
  const userUpdate = {status: true};
  console.log(req.params)
  try{
    const user = await User.update(userUpdate, {
      where: {
        id: req.params.id
      }
    });
    res.status(204).send();
  } catch(err) {
    res.send({message: err.message});
  }
};

// Listar todos os usuarios
exports.usersList = async(req, res) => {
  try {
    const users = await User.findAll();
    res.json({ users: users });
  } catch(err) {
    res.send({ message: err.message });
  }
};

// Detalhar um usuario
exports.userRead = async(req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id
      }
    });
    res.json({ user: user });
  } catch(err) {
    res.send({ message: err.message });
  }
};

// Atualizar um usuario
exports.userUpdate = async(req, res) => {
  const newEmail = req.body.email;
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt)
  const newUser = Object.assign({}, req.body);
  newUser.password = hashedPassword;
  
  try {
    const user = await User.findOne({ where: { id: req.params.id } });
    if (user.email !== newEmail) {
      newUser.status = "false"
      ActiveAccount({id: user.id, email: newEmail, username: user.username});
      
    }

    const updatedUser = await User.update(newUser, {
      where: {
        id: req.params.id
      }
    });
    res.status(204).send();
  } catch(err) {
    res.send({ message: err.message });
  }
};

// Apagar um usuario
exports.userDelete = async(req, res) => {
  try {
    const user = await User.destroy({
      where: {
          id: req.params.id
      }
    });
    res.status(204).send();
  } catch(err) {
    res.send({ message: err.message });
  }
};
