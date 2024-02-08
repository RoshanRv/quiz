const express = require("express");
const app = express();
const cors = require("cors");
const bodyparser = require("body-parser");
const db = require("./db");
const port = process.env.PORT || 3010;

app.use(bodyparser.urlencoded({ extended: true }));

app.use(bodyparser.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.get("/health", (req, res) => res.send(200));

app.post("/quiz", (req, res) => {
  const { ques, opt1, opt2, answerIndex } = req.body;

  db.query(
    "INSERT INTO questions (question,opt1,opt2,ans) VALUES (?,?,?,?)",
    [ques, opt1, opt2, answerIndex],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(400).send(err.message);
      }
      return res.sendStatus(201);
    }
  );
});

app.get("/quiz", (req, res) => {
  db.query("SELECT * FROM questions", (err, result) => {
    if (err) {
      console.log(err);
      return res.status(400).send(err.message);
    }
    return res.status(200).send(result);
  });
});

db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("DB connected");
  }
});

app.listen(port, () => {
  console.log(`server start listening on ${port}`);
});
