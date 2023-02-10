// Definição dos esquemas a serem usados pela documentação Swagger.
/**
 * @swagger
 * components:
 *   schemas:
 *     NovoUsuario:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: nome do usuario.
 *           example: Sabrina
 *         email:
 *           type: string
 *           description: email do usuario.
 *           example: sabrina@gmail.com
 *         password:
 *           type: string
 *           description: senha do usuario.
 *           example: 12345678
 *         admin: 
 *           type: boolean
 *           description: diferenciar usuarios comuns de administradores.
 *           example: false
 *     Usuario:
 *       allOf:
 *         - $ref: '#/components/schemas/NovoUsuario'
 *         - type: object
 *       properties:
 *         id:
 *           type: number
 *           description: id do usuario.
 *           example: 0
 *         username:
 *           type: string
 *           description: nome do usuario.
 *           example: Sabrina
 *         email:
 *           type: string
 *           description: email do usuario.
 *           example: sabrina@gmail.com
 *         password:
 *           type: string
 *           description: senha do usuario.
 *           example: 12345678
 *         status: 
 *           type: boolean
 *           description: Statuda da conta do usuario.
 *           example: false
 *         admin: 
 *           type: boolean
 *           description: diferenciar usuarios comuns de administradores.
 *           example: false
 *         createdAt:
 *           type: string
 *           description: Data no formato ISO em que o contato foi registrado.
 *           example: 2021-07-08T18:08:19.965Z
 *         updatedAt:
 *           type: string
 *           description: >
 *             Data no formato ISO em que o contato foi atualizado pela última vez.
 *           example: 2021-07-08T18:08:19.965Z
 */

 const express = require('express');
 const router = express.Router();
 const verify = require('../utils/verifyToken');
 
 // Importa o controller
 const userController = require('../controllers/userController');
 /**
  * @swagger
  * /users/register:
  *   post:
  *     summary: Cria um novo usuario.
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/NovoUsuario'
  *     responses:
  *       201:
  *         description: Usuario criado
  *         content:
  *           application/json:
  *             schema:
  *               properties:
  *                 usuario:
  *                   $ref: '#/components/schemas/Usuario'
  */
 
 //const sendGrid= require('../utils/sendGrid');
 router.post('/register', userController.userCreate)//, sendGrid);
 
 /**
  * @swagger
  * /users/login:
  *   post:
  *     summary: Autenticar usuario.
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/NovoUsuario'
  *     responses:
  *       201:
  *         description: Usuario Autenticado
  *         content:
  *           application/json:
  *             schema:
  *               properties:
  *                 email:
  *                   type: string
  *                   description: email do usuario.
  *                   example: sabrina@gmail.com
  *                 password:
  *                   type: string
  *                   description: senha do usuario.
  *                   example: 12345678
  */
 
 
 router.post('/login', userController.userLogin);
 
 /**
  * @swagger
  * /users/activeAccount/{id}:
  *   get:
  *     summary: Ativa conta do usuario.
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         description: ID numérico da conta a ser ativada.
  *         schema:
  *           type: integer
  *     responses:
  *       201:
  *         description: Conta de usuario ativada
  *         content:
  *           application/json:
  *             schema:
  *               properties:
  *                 usuario:
  *                   $ref: '#/components/schemas/Usuario'
  */
 
  router.get("/activeAccount/:id",  userController.userActive)

  /**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Apaga um usuario.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID numerico do usuario a ser recuperado.
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Usuarios apagado.
*/
router.delete('/:id', verify, userController.userDelete);

 /**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Atualiza um usuario.
 *     description: Modifica os valores de um usuario ja armazenado na agenda, recuperado pelo ID.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NovoUsuario'
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID numerico do usuario a ser recuperado.
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Usuario atualizado.
*/
router.patch('/:id', userController.userUpdate);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Recupera a lista de Usuarios.
 *     description: Recupera a lista de usuarios. 
 *     responses:
 *       200:
 *         description: Uma lista de usuarios.
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 usuarios:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Usuario'
*/
router.get('/', userController.usersList);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Recupera um unico usuario.
 *     description: Recupera um unico usuario pelo ID. 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID numerico do usuario a ser recuperado.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Um unico usuario.
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
*/
router.get('/:id', verify, userController.userRead);


 module.exports = router;
 
