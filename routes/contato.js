// Defini��o dos esquemas a serem usados pela documenta��o Swagger.
/**
 * @swagger
 * components:
 *   schemas:
 *     NovoContato:
 *       type: object
 *       properties:
 *         nome:
 *           type: string
 *           description: Nome do contato.
 *           example: Sabrina
 *         telefone:
 *           type: string
 *           description: Telefone do contato.
 *           example: (83) 98765-4321
 *     Contato:
 *       allOf:
 *         - $ref: '#/components/schemas/NovoContato'
 *         - type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: ID do contato.
 *               example: 0
 *             createdAt:
 *               type: string
 *               description: Data no formato ISO em que o contato foi registrado.
 *               example: 2021-07-08T18:08:19.965Z
 *             updatedAt:
 *               type: string
 *               description: >
 *                 Data no formato ISO em que o contato foi atualizado pela �ltima vez.
 *               example: 2021-07-08T18:08:19.965Z
 */

const express = require('express');
const router = express.Router();
const verify = require('../utils/verifyToken');

// Importa o controller
const contatoController = require('../controllers/contatoController');

/**
 * @swagger
 * /contato:
 *   get:
 *     summary: Recupera a lista de contatos.
 *     description: Recupera a lista de contatos da agenda. Pode ser usado sem autentica��o.
 *     responses:
 *       200:
 *         description: Uma lista de contatos.
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 contatos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Contato'
*/
router.get('/', contatoController.contatosList);

/**
 * @swagger
 * /contato/{id}:
 *   get:
 *     summary: Recupera um �nico contato.
 *     description: Recupera um �nico contato da agenda pelo ID. Pode ser usado sem autentica��o.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID num�rico do contato a ser recuperado.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Um �nico contato.
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 contato:
 *                   $ref: '#/components/schemas/Contato'
*/
router.get('/:id', contatoController.contatosRead);

/**
 * @swagger
 * /contato:
 *   post:
 *     summary: Cria um novo contato.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NovoContato'
 *     responses:
 *       201:
 *         description: Contato criado
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 contato:
 *                   $ref: '#/components/schemas/Contato'
*/
router.post('/',verify, contatoController.contatosCreate);
/**
 * @swagger
 * /contato/{id}:
 *   patch:
 *     summary: Atualiza um contato.
 *     description: Modifica os valores de um contato j� armazenado na agenda, recuperado pelo ID.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NovoContato'
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID num�rico do contato a ser recuperado.
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Contato atualizado.
*/
router.patch('/:id',verify, contatoController.contatosUpdate);
/**
 * @swagger
 * /contato/{id}:
 *   delete:
 *     summary: Apaga um contato.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID num�rico do contato a ser recuperado.
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Contato apgado.
*/
router.delete('/:id', verify, contatoController.contatosDelete);

module.exports = router;
