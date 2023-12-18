const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const routerProd = require("./prod/router");
const routerUser = require("./user/router")

console.log('heloo')
app.use(express.json());
app.use(cors());
app.use("/prod", routerProd);
app.use("/user",routerUser); 

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use(express.urlencoded({ extended: false }));
const db = 'mongodb+srv://karim:0000@ak.wogwya2.mongodb.net/?retryWrites=true&w=majority';
mongoose.set('strictQuery', true)
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => {
    console.log('Database temchi mrigla ..');
  })
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}...`);
});