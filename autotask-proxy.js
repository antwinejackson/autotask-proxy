const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const app = express();
const PORT = 3001;
app.use(cors());
app.use(express.json());
app.use("/autotask", async function(req, res) {
  var username = req.headers["username"];
  var apikey = req.headers["apikey"];
  var zone = req.headers["zone"] || "";
  var base = "https://webservices" + zone + ".autotask.net/ATServicesRest/V1.0";
  var targetUrl = base + req.url;
  console.log("[PROXY] " + targetUrl);
  try {
    var response = await fetch(targetUrl, { method: req.method, headers: { "UserName": username, "Secret": apikey, "ApiIntegrationCode": apikey, "Content-Type": "application/json" }, body: req.method !== "GET" ? JSON.stringify(req.body) : undefined });
    var data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error("[PROXY ERROR] " + err.message);
    res.status(500).json({ error: err.message });
  }
});
app.listen(PORT, function() { console.log("Autotask proxy running at http://localhost:" + PORT); });
