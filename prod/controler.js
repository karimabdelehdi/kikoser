const express = require('express');
const Prod = require('./model');


const timeoutWrapper = (milliseconds, asyncFn) => {
  return async (req, res, next) => {
    const timeout = setTimeout(() => {
      res.status(500).json({ error: 'Request timed out' });
    }, milliseconds);

    try {
      await asyncFn(req, res, next);
    } catch (err) {
      res.status(500).json({ error: err.message });
    } finally {
      clearTimeout(timeout);
    }
  };
};

// Create a new rental house

async function createProd(req, res) {
  try {
    const newProd = await Prod.create(req.body);
    res.status(201).json(newProd);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Retrieve all rental houses
async function getAllProd(req, res) {
  try {
    const prods = await Prod.find();
    res.status(200).json(prods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Retrieve a specific rental house by ID
async function findByIdProd(req, res) {
  try {
    const prod = await Prod.findById(req.params.id);
    if (!prod) {
      return res.status(404).json({ error: 'Prod not found' });
    }
    res.status(200).json(prod);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a rental house by ID
async function PutProd(req, res) {
  try {
    const updatedProd = await Prod.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProd) {
      return res.status(404).json({ error: 'Prod not found' });
    }
    res.status(200).json(updatedHouse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a rental house by ID
async function DeleteProd (req, res) {
  try {
    const deletedProd = await Prod.findByIdAndDelete(req.params.id);
    if (!deletedProd) {
      return res.status(404).json({ error: 'Prod not found' });
    }
    res.status(204).end(); // No content (successful deletion)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {createProd, getAllProd, findByIdProd, PutProd,DeleteProd,timeoutWrapper};
