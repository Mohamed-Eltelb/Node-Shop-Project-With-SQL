const express = require("express");
const path = require("path");
const app = express();
const db = require('./utils/db');

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require('./controllers/error');

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin/", adminRoutes);
app.use(shopRoutes);

app.use(errorController.error404);

app.listen(3000);
