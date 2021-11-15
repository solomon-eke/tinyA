const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const cookieParser = require("cookie-parser");
const { uuid } = require("uuidv4");
const PORT = 4000;
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const myPlaintextPassword = "s0//P4$$w0rD";
const someOtherPlaintextPassword = "not_bacon";
const password = "purple-monkey-dinosaur"; // found in the req.params object
const hashedPassword = bcrypt.hashSync(password, 10);
app.set("view engine", "ejs");
app.use(cookieParser());
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

// AUTHENTICATION HELPER FUNCTIONS

const findUserByEmail = function (email, users) {
  for (let userId in users) {
    const user = users[userId];
    if (email === user.email) {
      return user;
    }
  }

  return false;
};

const createUser = function (email, password, users) {
  const userId = uuid().substring(0, 6);

  // adding to an object
  // objectname[key] = value
  // Create a new user
  users[userId] = {
    id: userId,
    email,
    password: bcrypt.hashSync(myPlaintextPassword, saltRounds),
  };

  return userId;
};

const authenticateUser = function (email, password, users) {
  // retrieve the user from the db
  const userFound = findUserByEmail(email, users);

  // compare the passwords
  // password match => log in
  // password dont' match => error message
  if (userFound && userFound.password === password) {
    return userFound;
  }

  return false;
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

app.get("/register", (req, res) => {
  const templateVars = { user: null };

  // display the register form
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  // we need to extract the info from the body of request => req.body
  console.log("req.body:", req.body);
  const email = req.body.email;
  const password = req.body.password;
  // If the e-mail or password are empty strings
  if (email === " " || password === " ") {
    return "both the email and password fields are empty, please fill out";
  }
  // check if that user already exist in the users db
  // if yes, send back error message
  // if no, we're good

  // userFound can be a user object OR
  // false
  const userFound = findUserByEmail(email, users);

  console.log("userFound:", userFound);

  if (userFound) {
    res.status(401).send("Sorry, that user already exists!");
    return;
  }

  // userFound is false => ok register the user

  const userId = createUser(email, password, users);

  // Log the user => ask the browser to set a cookie with the user id
  res.cookie("user_id", userId);

  // redirect to '/quotes'

  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  // if we here, we assume that the user is not logged in.
  const templateVars = { user: null };

  res.render("login", templateVars);
});
app.post("/login", (req, res) => {
  // extract the email and password from the body of request => req.body

  const email = req.body.email;
  const password = req.body.password;

  // compare the passwords
  // password match => log in
  // password dont' match => error message

  const user = authenticateUser(email, password, users);

  if (user) {
    // user is authenticated
    // setting the cookie
    res.cookie("user_id", user.id);

    // redirect to /quotes
    res.redirect("/quotes"); //=> hey browser, can you do another request => get /quotes
    return;
  }

  // user is not authenticated => send error

  res.status(401).send("Wrong credentials!");
});

app.get("/u/:shortURL", (req, res) => {
  // const longURL = ...
  res.redirect(longURL);
});

console.log(generateRandomString("hell"));
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
