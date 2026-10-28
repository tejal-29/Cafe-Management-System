// const express = require("express");
// const router = express.Router();
// const Menu = require("../models/menu");
// const multer = require("multer");
// const fs = require("fs");
// const { handleGetAllUsers, showEditMenuPage, showAddMenuPage, showUpdateMenuPage, showMenuItemDetails } = require("../controllers/indexController");

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
//   },
// });

// var upload = multer({
//   storage: storage,
// }).single("image");

// router.post("/add", upload, async (req, res) => {
//   try {
//     const menu = new Menu({
//       category: req.body.category,
//       name: req.body.name,
//       price: req.body.price,
//       image: req.file.filename,
//       description: req.body.description,
//     });
//     await menu.save();
//     req.session.message = {
//       type: "success",
//       message: "Food Item added Successfully!",
//     };
//     res.redirect("/");
//   } catch (err) {
//     res.json({ message: err.message, type: "danger" });
//   }
// });

// // Home page route
// router.get("/", async (req, res) => {
//   try {
//     const menu = await Menu.find().exec();
//     res.render("home", {
//       title: "Home Page",
//       menu: menu.reverse(),
//     });
//   } catch (err) {
//     res.json({ message: err.message });
//   }
// });

// router.get("/index", async (req, res) => {
//   try {
//     const menu = await Menu.find().exec();
//     res.render("index", {
//       title: "Admin Dashboard",
//       menu: menu,
//       message: null,
//     });
//   } catch (err) {
//     res.json({ message: err.message });
//   }
// });

// // About page route
// router.get("/about", (req, res) => {
//   res.render("about", {
//     title: "About Us",
//     description: "CafeSerendipity is a cozy place for all coffee lovers. We offer a variety of coffees, teas, pastries, and light meals in a relaxed atmosphere.",
//     mission: "Our mission is to provide the best coffee experience to our customers while promoting sustainable practices.",
//     vision: "To be the preferred cafe in the community known for quality, service, and ambiance."
//   });
// });

// // Contact page route
// router.get("/contact", (req, res) => {
//   res.render("contact", {
//     title: "Contact Us",
//     contactInfo: [
//       { label: "Phone", value: "+123-456-7890" },
//       { label: "Email", value: "info@cafeserendipity.com" },
//       { label: "Location", value: "123 Cafe Street, City, Country" }
//     ]
//   });
// });

// router.get("/", handleGetAllUsers);

// router.get("/add", showAddMenuPage);

// // Edit menu item
// router.get("/edit/:id", showEditMenuPage);

// // Update menu item route
// router.post("/update/:id", upload, showUpdateMenuPage);

// //delete user
// router.get("/delete/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     // Use findByIdAndRemove with await
//     const deletedMenu = await Menu.findByIdAndRemove(id);

//     if (deletedMenu) {
//       // If the menu was successfully deleted, you can redirect or send a response accordingly
//       req.session.message = {
//         type: "success",
//         message: "Menu deleted successfully!",
//       };
//     } else {
//       // Handle the case where the menu with the given ID was not found
//       req.session.message = {
//         type: "danger",
//         message: "Menu not found!",
//       };
//     }
//     res.redirect("/");
//   } catch (err) {
//     // Handle errors
//     res.json({ message: err.message, type: "danger" });
//   }
// });

// router.get("/menu/:id", showMenuItemDetails);


// module.exports = router;

const express = require("express");
const router = express.Router();

const Menu = require("../models/menu");
const multer = require("multer");

const {
    showEditMenuPage,
    showAddMenuPage,
    showUpdateMenuPage,
    showMenuItemDetails
} = require("../controllers/indexController");


const mongoose = require("mongoose");
const crypto = require("crypto");
const Order = require("../models/Order");



// --------------------------------------------------
// IMAGE UPLOAD
// --------------------------------------------------

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },

    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "_" + Date.now() + "_" + file.originalname
        );
    }
});

const upload = multer({
    storage: storage
}).single("image");


// --------------------------------------------------
// DASHBOARD
// --------------------------------------------------

router.get("/dashboard", async (req, res) => {
    try {
        const menu = await Menu.find().exec();

        res.render("dashboard", {
            title: "Cafe Dashboard",

            revenue: 0,
            orders: 0,
            customers: 0,

            menuCount: menu.length,
            menuItems: menu
        });

    } catch (err) {
        console.error(err);

        res.render("dashboard", {
            title: "Cafe Dashboard",

            revenue: 0,
            orders: 0,
            customers: 0,

            menuCount: 0,
            menuItems: []
        });
    }
});


// --------------------------------------------------
// ADD MENU
// --------------------------------------------------

router.post("/add", upload, async (req, res) => {
    try {

        const menu = new Menu({
            category: req.body.category,
            name: req.body.name,
            price: req.body.price,
            image: req.file ? req.file.filename : "",
            description: req.body.description
        });

        await menu.save();

        req.session.message = {
            type: "success",
            message: "Food Item added Successfully!"
        };

        res.redirect("/index");

    } catch (err) {
        console.error(err);

        res.json({
            message: err.message,
            type: "danger"
        });
    }
});


// --------------------------------------------------
// HOME PAGE
// --------------------------------------------------

router.get("/", async (req, res) => {
    try {

        const menu = await Menu.find().exec();

        res.render("home", {
            title: "Home Page",
            menu: menu.reverse()
        });

    } catch (err) {

        console.error(err);

        res.json({
            message: err.message
        });
    }
});


// --------------------------------------------------
// ADMIN MENU PAGE
// --------------------------------------------------

router.get("/index", async (req, res) => {
    try {

        const menu = await Menu.find().exec();

        res.render("index", {
            title: "Admin Dashboard",
            menu: menu,
            message: null
        });

    } catch (err) {

        console.error(err);

        res.json({
            message: err.message
        });
    }
});


// --------------------------------------------------
// ABOUT
// --------------------------------------------------

router.get("/about", (req, res) => {

    res.render("about", {
        title: "About Us",

        description:
            "CafeSerendipity is a cozy place for all coffee lovers. We offer a variety of coffees, teas, pastries, and light meals in a relaxed atmosphere.",

        mission:
            "Our mission is to provide the best coffee experience to our customers while promoting sustainable practices.",

        vision:
            "To be the preferred cafe in the community known for quality, service, and ambiance."
    });

});


// --------------------------------------------------
// CONTACT
// --------------------------------------------------

router.get("/contact", (req, res) => {

    res.render("contact", {
        title: "Contact Us",

        contactInfo: [
            {
                label: "Phone",
                value: "+123-456-7890"
            },

            {
                label: "Email",
                value: "info@cafeserendipity.com"
            },

            {
                label: "Location",
                value: "123 Cafe Street, City, Country"
            }
        ]
    });

});


// --------------------------------------------------
// ADD MENU PAGE
// --------------------------------------------------

router.get("/add", showAddMenuPage);


// --------------------------------------------------
// EDIT MENU
// --------------------------------------------------

router.get("/edit/:id", showEditMenuPage);


// --------------------------------------------------
// UPDATE MENU
// --------------------------------------------------

router.post("/update/:id", upload, showUpdateMenuPage);


// --------------------------------------------------
// DELETE MENU
// --------------------------------------------------

router.get("/delete/:id", async (req, res) => {

    try {

        const id = req.params.id;

        const deletedMenu = await Menu.findByIdAndDelete(id);

        if (deletedMenu) {

            req.session.message = {
                type: "success",
                message: "Menu deleted successfully!"
            };

        } else {

            req.session.message = {
                type: "danger",
                message: "Menu not found!"
            };

        }

        res.redirect("/index");

    } catch (err) {

        console.error(err);

        res.json({
            message: err.message,
            type: "danger"
        });
    }

});


// --------------------------------------------------
// MENU DETAILS
// --------------------------------------------------

router.get("/menu/:id", showMenuItemDetails);


// --------------------------------------------------
// EXPORT
// --------------------------------------------------

module.exports = router;


// --------------------------------------------------
// API: GET ALL MENU ITEMS FOR REACT
// --------------------------------------------------

router.get("/api/menu", async (req, res) => {
    try {
        const menu = await Menu.find().sort({ _id: -1 });
        res.json(menu);
    } catch (err) {
        console.error("Error fetching menu:", err);
        res.status(500).json({
            message: "Failed to fetch menu items"
        });
    }
});

// --------------------------------------------------
// API: GET ONE MENU ITEM
// --------------------------------------------------

router.get("/api/menu/:id", async (req, res) => {
    try {
        const menuItem = await Menu.findById(req.params.id);

        if (!menuItem) {
            return res.status(404).json({
                message: "Menu item not found"
            });
        }

        res.json(menuItem);
    } catch (err) {
        console.error("Error fetching menu item:", err);
        res.status(500).json({
            message: "Failed to fetch menu item"
        });
    }
});



/* =========================================
   CREATE ORDER — called by React checkout
========================================= */
router.post("/api/orders", async (req, res) => {
  try {
    const { customer, items } = req.body;

    if (
      !customer ||
      !customer.name?.trim() ||
      !customer.phone?.trim()
    ) {
      return res.status(400).json({
        message: "Customer name and phone are required."
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Your cart is empty."
      });
    }

    // Validate and combine duplicate menu IDs.
    const quantities = new Map();

    for (const item of items) {
      const id = String(item.menuId || "");
      const quantity = Number(item.quantity);

      if (
        !mongoose.isValidObjectId(id) ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 99
      ) {
        return res.status(400).json({
          message: "Invalid menu item or quantity."
        });
      }

      quantities.set(id, (quantities.get(id) || 0) + quantity);
    }

    for (const quantity of quantities.values()) {
      if (quantity > 99) {
        return res.status(400).json({
          message: "Maximum quantity per item is 99."
        });
      }
    }

    // Fetch menu data from MongoDB. Do not trust browser prices.
    const ids = [...quantities.keys()];
    const menuItems = await Menu.find({ _id: { $in: ids } });
    const menuMap = new Map(
      menuItems.map(item => [String(item._id), item])
    );

    if (menuMap.size !== ids.length) {
      return res.status(400).json({
        message: "One or more menu items are no longer available."
      });
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const [menuId, quantity] of quantities) {
      const item = menuMap.get(menuId);
      const price = Number(item.price);

      if (!Number.isFinite(price) || price < 0) {
        return res.status(400).json({
          message: `Invalid price for ${item.name}. Please contact the cafe.`
        });
      }

      const safePrice = Math.round(price * 100) / 100;
      totalAmount += safePrice * quantity;

      orderItems.push({
        menuId: item._id,
        name: item.name,
        price: safePrice,
        quantity,
        image: item.image || ""
      });
    }

    totalAmount = Math.round(totalAmount * 100) / 100;

    // Unique, human-readable order reference.
    const orderNumber =
      `FS-${Date.now()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

    const order = await Order.create({
      orderNumber,
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        address: String(customer.address || "").trim()
      },
      items: orderItems,
      totalAmount,
      status: "Pending"
    });

    return res.status(201).json({
      message: "Order placed successfully.",
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt
      }
    });
  } catch (err) {
    console.error("Create order error:", err);
    return res.status(500).json({
      message: "Unable to place your order. Please try again."
    });
  }
});


/* =========================================
   ADMIN API — LIST ORDERS
========================================= */
router.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .lean();

    res.json(orders);
  } catch (err) {
    console.error("Fetch orders error:", err);
    res.status(500).json({ message: "Unable to fetch orders." });
  }
});


/* =========================================
   ADMIN API — UPDATE STATUS
========================================= */
router.patch("/api/orders/:id/status", async (req, res) => {
  try {
    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Preparing",
      "Ready",
      "Completed",
      "Cancelled"
    ];

    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status." });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.json({ message: "Order status updated.", order });
  } catch (err) {
    console.error("Update order error:", err);
    res.status(500).json({ message: "Unable to update order status." });
  }
});


/* =========================================
   ADMIN PAGES
========================================= */
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    res.render("orders", { title: "Customer Orders", orders });
  } catch (err) {
    console.error(err);
    res.status(500).send("Unable to load orders.");
  }
});

router.get("/orders/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid order ID.");
    }

    const order = await Order.findById(req.params.id).lean();

    if (!order) {
      return res.status(404).send("Order not found.");
    }

    res.render("order-details", {
      title: `Order ${order.orderNumber}`,
      order
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Unable to load order details.");
  }
});

router.post("/orders/:id/status", async (req, res) => {
  try {
    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Preparing",
      "Ready",
      "Completed",
      "Cancelled"
    ];

    if (!allowedStatuses.includes(req.body.status)) {
      return res.status(400).send("Invalid status.");
    }

    await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { runValidators: true }
    );

    res.redirect(`/orders/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Unable to update order.");
  }
});




// Display all orders
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.render("orders", { orders });
  } catch (error) {
    console.error("Error loading orders:", error);
    res.status(500).send("Unable to load orders. Check the backend terminal.");
  }
});