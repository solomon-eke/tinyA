const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const cookieParser = require("cookie-parser");
const PORT = 4000;
app.set("view engine", "ejs");
app.use(cookieParser());
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};
function generateRandomString(data) {
  const result = Math.random().toString(36).substr(2, 6);
  return result;
}
app.get("/", (req, res) => {
  res.send("Hello");
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});

app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };

  res.render("urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
// create a new long URL using a form and add to urlDatabase
app.post("/urls", (req, res) => {
  // extract the information that was submitted with the form
  const longURL = req.body.longURL;
  console.log(`this is:${longURL}`);
  // we need to create a random key first, that will
  // become the key of the new url we are about to
  //save in our urlDatabase. In this case, it is called
  // shortURL
  let id = Math.random().toString(36).substring(0, 8);
  urlDatabase[id] = longURL;
  console.log(urlDatabase);
  res.redirect("/urls/:id");
});

app.get("/urls/:id", (req, res) => {
  const urlId = req.params.id;
  console.log(`this is id:${urlId}`);
  const templateVars = { urlId: urlId, longUrl: urlDatabase[urlId] };

  res.render("urls_show", templateVars);
});
app.post("urls/:id", (req, res) => {
  const urlId = req.params.id;
  // extract the long url
  const longURL = req.body.longURL;
  // update the db
  urlDatabase[urlId].longURL = longURL;
  // redirect
  res.redirect("/urls");
});
app.post("/urls/:id/delete", (req, res) => {
  // extract the id
  const urlId = req.params.id;

  // delete from an object
  delete urlDatabase[urlId];

  // redirect
  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  // const longURL = ...
  res.redirect(longURL);
});

console.log(generateRandomString("hell"));
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
