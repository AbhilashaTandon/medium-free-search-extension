//entry point for api

const express = require("express");
require("dotenv/config");

const app = express();

app.listen(5000, () => {
  console.log("Server started at http://localhost:5000/search");
});

app.get("/search/:title/:author/:snippet", async (req, res) => {
  //TODO: add jwt authentication

  console.log("title", req.params.title);
  console.log("author", req.params.author);
  console.log("snippet", req.params.snippet);

  const query = `"${req.params.title}" "${req.params.author}" "${req.params.snippet} -site:medium.com`;

  // Call the Lambda API Gateway
  const lambdaApiUrl = process.env.API_URL;

  try {
    await fetch(`${lambdaApiUrl}?q=${encodeURIComponent(query)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }) //replace this with message to backend server
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Parse as JSON
      })
      .then((data) => {
        if (data.link) {
          console.log("Free link found:", data.link);
          res.status(200).send({ freeLink: data.link });
        } else {
          console.warn("No free link found:", data.message);

          res.status(200).send({ freeLink: data.link });
        }
      });
  } catch (error) {
    console.error("Error calling Lambda:", error);
    return res.status(500).json({ message: error.message });
  }
});
