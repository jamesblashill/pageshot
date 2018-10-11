const express = require("express");
const PageShot = require("./page-shot");

const app = express();
const port = process.env.PORT || 3333;

app.use("/reports", express.static("reports"));
app.use("/screenshots", express.static("screenshots"));

app.get("/api/page_shots", async (req, res) => {
  const pageShots = await PageShot.fetch();
  res.json(pageShots);
});

app.listen(port, () =>
  console.log(`Page shots app listening on port ${port}!`)
);
