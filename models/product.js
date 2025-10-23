const db = require("../utils/db");
const fs = require("fs");
const path = require("path");
const currentDir = require("../utils/path");

const p = path.join(currentDir, "data", "products.json");
const p2 = path.join(currentDir, "data", "cart.json");

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      const data = fileContent.toString().trim();
      const products = data ? JSON.parse(data) : [];
      cb(products);
    }
  });
};

const getCartItems = (cb) => {
  fs.readFile(p2, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      const data = fileContent.toString().trim();
      const products = data ? JSON.parse(data) : [];
      cb(products);
    }
  });
};

module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    // this.inTheCart = false;
  }

  save() {
    db.execute(
      "INSERT INTO products (title, imageUrl, description, price) VALUES (?, ?, ?, ?)",
      [this.title, this.imageUrl, this.description, this.price]
    );
  }

  static fetchAll() {
    return db.execute("SELECT * FROM products");
  }
  static findById(id) {
    return db.execute("SELECT * FROM products WHERE id = ?", [id]);
  }

  static editProduct(id, updatedProduct) {
    return db.execute(
      "UPDATE products SET title = ?, imageUrl = ?, description = ?, price = ? WHERE id = ?",
      [
        updatedProduct.title,
        updatedProduct.imageUrl,
        updatedProduct.description,
        updatedProduct.price,
        id,
      ]
    );
  }

  static deleteById(id) {
    db.execute("DELETE FROM products WHERE id = ?", [id]);

    getCartItems((cartItems) => {
      const updatedCartItems = cartItems.filter((item) => item.id !== id);
      fs.writeFile(p2, JSON.stringify(updatedCartItems), (err) => {
        if (err) console.log(err);
      });
    });
  }

  /* ============= Cart ============= */
  static fetchAllCart(cb) {
    getCartItems((cartItems) => {
      getProductsFromFile((products) => {
        const detailedCartItems = cartItems.map((cartItem) => {
          const product = products.find((p) => p.id === cartItem.id);
          return {
            ...product,
            quantity: cartItem.quantity,
          };
        });

        cb(detailedCartItems);
      });
    });
  }

  static addToCart(id) {
    getCartItems((cartItems) => {
      const existingCartItemIndex = cartItems.findIndex(
        (item) => item.id === id
      );
      if (existingCartItemIndex !== -1) {
        cartItems[existingCartItemIndex].quantity += 1;
        fs.writeFile(p2, JSON.stringify(cartItems), (err) => {
          if (err) console.log(err);
        });
      } else {
        cartItems.push({ id: id, quantity: 1 });
        fs.writeFile(p2, JSON.stringify(cartItems), (err) => {
          if (err) console.log(err);
        });
      }
    });
  }

  static removeFromCart(id) {
    getCartItems((cartItems) => {
      const updatedCartItems = cartItems.filter((item) => item.id !== id);
      fs.writeFile(p2, JSON.stringify(updatedCartItems), (err) => {
        if (err) console.log(err);
      });

      getProductsFromFile((products) => {
        const product = products.find((p) => p.id === id);
        // product.inTheCart = false;
        fs.writeFile(p, JSON.stringify(products), (err) => {
          if (err) console.log(err);
        });
      });
    });
  }

  static updateQuantity(id, newQuantity) {
    getCartItems((cartItems) => {
      const cartItemIndex = cartItems.findIndex((item) => item.id === id);
      cartItems[cartItemIndex].quantity = newQuantity;
      fs.writeFile(p2, JSON.stringify(cartItems), (err) => {
        if (err) console.log(err);
      });
    });
  }
};
