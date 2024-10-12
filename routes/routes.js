const express = require("express");
const router = express.Router();
const Menu = require("../models/menu");
const multer = require("multer");
const fs = require("fs");
const { handleGetAllUsers, showEditMenuPage, showAddMenuPage, showUpdateMenuPage, showMenuItemDetails } = require("../controllers/indexController");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

var upload = multer({
  storage: storage,
}).single("image");

router.post("/add", upload, async (req, res) => {
  try {
    const menu = new Menu({
      category: req.body.category,
      name: req.body.name,
      price: req.body.price,
      image: req.file.filename,
      description: req.body.description,
    });
    await menu.save();
    req.session.message = {
      type: "success",
      message: "Food Item added Successfully!",
    };
    res.redirect("/");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
});

// Home page route
router.get("/", async (req, res) => {
  try {
    const menu = await Menu.find().exec();
    res.render("home", {
      title: "Home Page",
      menu: menu.reverse(),
    });
  } catch (err) {
    res.json({ message: err.message });
  }
});

router.get("/index", async (req, res) => {
  try {
    const menu = await Menu.find().exec();
    res.render("index", {
      title: "Admin Dashboard",
      menu: menu,
      message: null,
    });
  } catch (err) {
    res.json({ message: err.message });
  }
});

// About page route
router.get("/about", (req, res) => {
  res.render("about", {
    title: "About Us",
    description: "CafeSerendipity is a cozy place for all coffee lovers. We offer a variety of coffees, teas, pastries, and light meals in a relaxed atmosphere.",
    mission: "Our mission is to provide the best coffee experience to our customers while promoting sustainable practices.",
    vision: "To be the preferred cafe in the community known for quality, service, and ambiance."
  });
});

// Contact page route
router.get("/contact", (req, res) => {
  res.render("contact", {
    title: "Contact Us",
    contactInfo: [
      { label: "Phone", value: "+123-456-7890" },
      { label: "Email", value: "info@cafeserendipity.com" },
      { label: "Location", value: "123 Cafe Street, City, Country" }
    ]
  });
});

router.get("/", handleGetAllUsers);

router.get("/add", showAddMenuPage);

// Edit menu item
router.get("/edit/:id", showEditMenuPage);

// Update menu item route
router.post("/update/:id", upload, showUpdateMenuPage);

//delete user
router.get("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // Use findByIdAndRemove with await
    const deletedMenu = await Menu.findByIdAndRemove(id);

    if (deletedMenu) {
      // If the menu was successfully deleted, you can redirect or send a response accordingly
      req.session.message = {
        type: "success",
        message: "Menu deleted successfully!",
      };
    } else {
      // Handle the case where the menu with the given ID was not found
      req.session.message = {
        type: "danger",
        message: "Menu not found!",
      };
    }
    res.redirect("/");
  } catch (err) {
    // Handle errors
    res.json({ message: err.message, type: "danger" });
  }
});

router.get("/menu/:id", showMenuItemDetails);


module.exports = router;
