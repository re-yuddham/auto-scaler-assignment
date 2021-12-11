const express = require("express");

const app = express();
const port = process.env.PORT || 8842; // Heroku will need the PORT environment variable

const response = {
  access_token: jwt,
  token_type: "bearer",
  expires_in: 43199,
  scope: "uaa.resource",
  jti: "bcf1174f876b481e873f802a6b81c2de",
};

const waitForTime = (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), time);
  });
};

app.post("/oauth/token", async (req, resp) => {
  console.log(JSON.stringify(req.headers));
  resp.setHeader("Transfer-Encoding", "chunked");
  resp.setHeader("Content-Type", "application/json");
  const _ = await waitForTime(200);
  resp.write(JSON.stringify(response));
  resp.end();
});


app.listen(port, () => console.log(`App is live on port ${port}!`));
