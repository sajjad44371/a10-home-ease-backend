const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// test api
app.get("/", (req, res) => {
  res.send("HomeEase backend running");
});

// listening port
app.listen(port, () => {
  console.log(`HomeEase listening from port: ${port}`);
});
