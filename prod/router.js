const express = require('express');
const router = express.Router();
const {createProd, getAllProd, findByIdProd, PutProd, DeleteProd,timeoutWrapper}= require('./controler');
router.post('/add', timeoutWrapper(10000, createProd)); // 10 seconds for timeout
router.get('/', timeoutWrapper(10000, getAllProd)); // 10 seconds for timeout
router.get('/:id', timeoutWrapper(10000, findByIdProd)); // 10 seconds for timeout
router.put('/:id', timeoutWrapper(10000, PutProd)); // 10 seconds for timeout
router.delete('/:id', timeoutWrapper(10000, DeleteProd)); // 10 seconds for timeout
module.exports = router;
