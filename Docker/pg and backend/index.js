const express = require("express");
const postgres = require("postgres");

const randomWords = [
  "admiring",
  "agitated",
  "blissful",
  "brave",
  "clever",
  "dreamy",
  "eager",
  "ecstatic",
  "festive",
  "focused",
  "friendly",
  "frosty",
  "gallant",
  "goofy",
  "gracious",
  "happy",
  "hopeful",
  "hungry",
  "inspiring",
  "jolly",
  "kind",
  "lucid",
  "modest",
  "musing",
  "serene",
  "bardeen",
  "curie",
  "darwin",
  "einstein",
  "elion",
  "fermat",
  "feynman",
  "galileo",
  "gauss",
  "goldberg",
  "hawking",
  "heisenberg",
  "kapitsa",
  "keen",
  "knuth",
  "lovelace",
  "maxwell",
  "mirzakhani",
  "newton",
  "nobel",
  "pasteur",
  "raman",
  "shockley",
  "turing",
  "wozniak",
];

const sql = postgres({
  host: "pg5",
  port: "5432",
  username: "postgres",
  database: "postgres",
  password: "root",
});

const app = express();

app.get("/", async (req, res) => {
  const tests = await sql`
        SELECT * FROM test;
    `;
  let html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tests</title>
  </head>
  <body style="font-family: Arial, Helvetica, sans-serif">
    <a href="/add" style="cursor: pointer; color: blue; background-color: yellow; padding: 4px 12px; display: inline-block">Add New Record</a>
    <hr />
    <table border="" style="border-collapse: collapse; min-width: 480px">
      <tr style="background-color: black; color: white; font-size: large">
        <th>id</th>
        <th>title</th>
      </tr>`;

  tests.forEach((test) => {
    html += `
            <tr>
                <td>${test.id}</td>
                <td>${test.title}</td>
            </tr>
        `;
  });

  html += `
    </table>
  </body>
</html>

      `;
  return res.send(html);
});

// Dummy POST
app.get("/add", async (req, res) => {
  const randomWord = randomWords[Math.floor(Math.random() * randomWords.length)];
  try {
    await sql`INSERT INTO test(title) VALUES(${randomWord});`;
  } catch (error) {
    res.status(500);
    return res.json({ error });
  }
  return res.redirect("/");
});

app.listen(3000, () => {
  console.log("app is listening on port 3000");
});
