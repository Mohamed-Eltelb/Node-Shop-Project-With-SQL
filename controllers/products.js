const Product = require("../models/product");

/* ============= Products ============= */
exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      docTitle: "Shop",
      path: "/products",
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true,
    });
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = parseInt(req.params.productId, 10);
  Product.findById(prodId, (product) => {
    if (product) {
      res.render("shop/product-detail", {
        product: product,
        docTitle: product.title,
        path: "/product-detail",
      });
    } else {
      res.redirect("/");
    }
  });
};

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    activeAddProduct: true,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;
  const product = new Product(title, imageUrl, description, price);
  product.save();
  res.redirect("/products");
};

exports.getEditProduct = (req, res, next) => {
  const prodId = parseInt(req.params.productId, 10);
  Product.findById(prodId, (product) => {
    res.render("admin/edit-product", {
      docTitle: "Edit Product",
      path: "/admin/edit-product",
      formsCSS: true,
      product: product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = parseInt(req.params.productId, 10);
  const updatedProduct = new Product(
    req.body.title,
    req.body.imageUrl,
    req.body.description,
    req.body.price
    // req.body.inTheCart
  );
  updatedProduct.id = prodId;
  Product.editProduct(prodId, updatedProduct);
  res.redirect("/admin/products");
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = parseInt(req.body.productId, 10);
  Product.deleteById(prodId);
  res.redirect("/admin/products");
};

//admin products
exports.getAdminProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      docTitle: "Admin Products",
      path: "/admin/products",
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true,
    });
  });
};

/* ============= Cart ============= */
exports.getCart = (req, res, next) => {
  Product.fetchAllCart((cartItems) => {
    res.render("shop/cart", {
      docTitle: "Your Cart",
      path: "/cart",
      hasProducts: cartItems.length > 0,
      cartItems: cartItems,
      totalPrice: cartItems
        .reduce(
          (total, item) => total + parseFloat(item.price) * item.quantity,
          0
        )
        .toFixed(2),
    });
  });
};

exports.postAddToCart = (req, res, next) => {
  const prodId = parseInt(req.body.productId, 10);
  Product.addToCart(prodId);
  res.redirect("/cart");
};

exports.updateQuantityInCart = (req, res, next) => {
  const prodId = parseInt(req.body.productId, 10);
  const newQuantity = parseInt(req.body.quantity, 10);
  Product.updateQuantity(prodId, newQuantity);
  res.redirect("/cart");
};

exports.postRemoveFromCart = (req, res, next) => {
  const prodId = parseInt(req.body.productId, 10);
  Product.removeFromCart(prodId);
  res.redirect("/cart");
};

/* ============= General ============= */
exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      docTitle: "Shop",
      path: "/",
    });
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    docTitle: "Checkout",
    path: "/checkout",
  });
};
