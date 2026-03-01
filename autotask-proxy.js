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
  var trackingid = req.headers["trackingid"] || "";
  var zone = req.headers["zone"] || "";
  var base = "https://webservices" + zone + ".autotask.net/ATServicesRest/V1.0";
  var targetUrl = base + req.url;
  console.log("[PROXY] " + targetUrl);
  try {
    var response = await fetch(targetUrl, { method: req.method, headers: { "UserName": username, "Secret": apikey, "ApiIntegrationCode": trackingid, "Content-Type": "application/json" }, body: req.method !== "GET" ? JSON.stringify(req.body) : undefined });
    var text = await response.text();
    console.log("[AUTOTASK RESPONSE] " + response.status + " " + text);
    try { res.status(response.status).json(JSON.parse(text)); } catch(e) { res.status(response.status).send(text); }
  } catch (err) {
    console.error("[PROXY ERROR] " + err.message);
    res.status(500).json({ error: err.message });
  }
});
app.listen(PORT, function() { console.log("Autotask proxy running at http://localhost:" + PORT); });
