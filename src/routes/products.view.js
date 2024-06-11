import { Router } from "express";
import ProductManager from "../services/ProductManager.js";

const router = Router();

//View products through handlebars
router.get("/", async (req, res) => {
  try {
    const allProducts = await ProductManager.getProducts();
    res.render("home", {
      title: "All products",
      allProducts,
    });
  } catch (error) {
    res.status(500).send(`Internal server error: ${error}`);
  }
});

//View products through socket.io in real-time
router.get("/realtimeproducts", async (req, res) => {
  try {
    res.render("realtimeproducts", {
      title: "Real time products",
    });
  } catch (error) {
    res.status(500).send(`Internal server error: ${error}`);
  }
});

export default router;
