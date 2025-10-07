const http=require('http')
const express = require("express");
const route = express.Router();
route.use(express.json());
let users = [
  {
    id: 1,
    name: "durgaprasad",
    task: "random",
  },
];
route.get("/", (req, res) => {
  res.json(users);
});
route.post("/details", (req, res) => {
    let user = {
      id:users.length+1,
    name: req.body.name,
    task: req.body.task,
  };
  users.push(user);
  res.send(user);
});

exports.modules = route;