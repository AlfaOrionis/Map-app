const express = require("express");
const app = express();
const xss = require("xss-clean");
const request = require("request");
const OAuth = require("oauth-1.0a");
const crypto = require("crypto");
require("dotenv").config;

app.use(express.json());
app.use(xss());

app.use("/get_token", (req, res, next) => {
  try {
    const oauth = OAuth({
      consumer: {
        key: "2SOYZc_dJGZ2cIU4F0soJw",
        secret:
          "e-tRqGU3oWygkjrGkB8jZu4qflu0aEFQ5Kia4HQvXnTGI62WX492KoMDdSece-xatX_lNu0lkEuQywHwgBjLDA",
      },
      signature_method: "HMAC-SHA256",
      hash_function(base_string, key) {
        return crypto
          .createHmac("sha256", key)
          .update(base_string)
          .digest("base64");
      },
    });

    const request_data = {
      url: "https://account.api.here.com/oauth2/token",
      method: "POST",
      data: { grant_type: "client_credentials" },
    };

    request(
      {
        url: request_data.url,
        method: request_data.method,
        form: request_data.data,
        headers: oauth.toHeader(oauth.authorize(request_data)),
      },
      function (error, response, body) {
        if (response.statusCode == 200) {
          const result = JSON.parse(response.body);
          console.log(result.access_token);
          res.json(result.access_token);
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.use(express.static("client/build"));
if (process.env.NODE_ENV === "production") {
  const path = require("path");
  app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`server is running on ${port}`));
