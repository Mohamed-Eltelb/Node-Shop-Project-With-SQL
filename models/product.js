const db = require("../utils/db");
const fs = require("fs");


module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    // this.inTheCart = false;
  }

  save() {
    return db.execute(
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
  }

  /* ============= Cart ============= */
  static fetchAllCart() {
    return db.execute("SELECT * FROM cart").then(([rows]) => {
      const cartItems = rows;
      if (cartItems.length === 0) return [];
      const productIds = cartItems.map((item) => item.product_id);
      const placeholders = productIds.map(() => "?").join(",");
      return db
        .execute(`SELECT * FROM products WHERE id IN (${placeholders})`, productIds)
        .then(([productRows]) => {
          return productRows.map((product) => {
            const cartItem = cartItems.find(
              (item) => item.product_id === product.id
            );
            return {
              ...product,
              quantity: cartItem.quantity,
            };
          });
        });
    });
  }

  static addToCart(id) {
    db.execute("SELECT * FROM cart WHERE product_id = ?", [id]).then(([rows]) => {
      if (rows.length > 0) {
        const currentQuantity = rows[0].quantity;
        db.execute("UPDATE cart SET quantity = ? WHERE product_id = ?", [currentQuantity + 1, id]);
      } else {
        db.execute("INSERT INTO cart (product_id, quantity) VALUES (?, ?)", [id, 1]);
      }
    });
  }

  static removeFromCart(id) {
    db.execute("DELETE FROM cart WHERE product_id = ?", [id]);
  }

  static updateQuantity(id, newQuantity) {
    db.execute("UPDATE cart SET quantity = ? WHERE product_id = ?", [newQuantity, id]);
  }
};
