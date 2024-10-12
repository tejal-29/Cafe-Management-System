const Menu = require("../models/menu");

async function handleGetAllUsers(req, res) {
  try {
    const menu = await Menu.find().exec();
    res.render("index", {
      title: "Home Page",
      menu: menu.reverse(),
    });
  } catch (err) {
    res.json({ message: err.message });
  }
}

async function showAddMenuPage(req, res) {
    res.render("add_menu", { title: "Add Menu" });
}

async function showEditMenuPage(req, res) {
  try {
    const id = req.params.id;
    const menu = await Menu.findById(id).exec();
    if (!menu) {
      res.redirect("/");
    } else {
      console.log("menu.image:", menu.image);

      res.render("edit_menu", {
        title: "Edit Menu",
        menu: menu,
      });
    }
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
}

async function showUpdateMenuPage(req, res) {
    try {
        const id = req.params.id;
        let new_image = "";
    
        if (req.file) {
          new_image = req.file.filename;
          try {
            fs.unlinkSync("./uploads/" + req.body.old_image);
          } catch (err) {
            console.error(err);
          }
        } else {
          new_image = req.body.old_image;
        }
    
        const result = await Menu.findByIdAndUpdate(
          id,
          {
            category: req.body.category,
            name: req.body.name,
            price: req.body.price,
            image: new_image,
            description: req.body.description,
          },
          { new: true } // To get the updated document
        );
    
        if (result) {
          req.session.message = {
            type: "success",
            message: "Menu updated successfully!",
          };
          res.redirect("/");
        } else {
          res.json({ message: "Menu not found", type: "danger" });
        }
      } catch (err) {
        console.error(err);
        res.json({ message: err.message, type: "danger" });
      }

}
async function showMenuItemDetails(req, res) {
    try {
      const id = req.params.id;
      const menu = await Menu.findById(id).exec();
      if (!menu) {
        // Handle the case where the menu item is not found
        res.status(404).render("not_found", { title: "Item Not Found" });
      } else {
        // Render a page to display the details of the menu item
        res.render("menu_details", {
          title: "Menu Item Details",
          menu: menu,
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message, type: "danger" });
    }
  }

module.exports = {
  handleGetAllUsers,
  showAddMenuPage,
  showEditMenuPage,
  showUpdateMenuPage,
  showMenuItemDetails,
};
