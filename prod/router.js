const express = require('express');
const router = express.Router();
const {createProd, getAllProd, findByIdProd, PutProd, DeleteProd}= require('./controler');
router.post('/add',  createProd); // 10 seconds for timeout
router.get('/', getAllProd); // 10 seconds for timeout
router.get('/:id',  findByIdProd); // 10 seconds for timeout
router.put('/:id',  PutProd); // 10 seconds for timeout
router.delete('/:id',  DeleteProd); // 10 seconds for timeout
module.exports = router;
