const express = require("express");
const app = express();
const connectDB = require("./config/db");
const cors = require("cors");
const Ques = require("./models/Quiz");
const Quiz = require("./models/Quiz");
app.use(cors());
const PORT = process.env.PORT || 4000;
connectDB();
app.get("/", (req, res) => {
  res.send("Running api");
});
app.use(express.json({ entended: false }));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/survey", require("./routes/api/survey"));
app.get("/data", async (req, res) => {
  try {
    const posts = await Quiz.find();
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
app.post("/ques", async (req, res) => {
  console.log(req.body);
  try {
    const newQuiz = new Ques({ questions: req.body.ques });
    const post = await newQuiz.save();
    res.send(post);
  } catch (err) {
    res.status(500).send("Aryan");
  }
});
app.listen(PORT, () => console.log("server"));
