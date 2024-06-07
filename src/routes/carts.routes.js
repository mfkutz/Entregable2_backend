import { Router } from "express";
import CartManager from "../services/CartManager.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const newCart = await CartManager.addCart();
    res.status(200).json(newCart);
  } catch (error) {
    res.status(500).send(`Internal server error: ${error}`);
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const isId = parseInt(req.params.cid, 10);
    const cart = await CartManager.getCartById(isId);
    if (!cart) return res.status(404).send("Cart not found");
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).send(`Internal server error: ${error}`);
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const isCartId = parseInt(req.params.cid, 10);
    const isProductId = parseInt(req.params.pid, 10);
    const cart = await CartManager.addProductToCart(isCartId, isProductId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).send(`Internal server error: ${error}`);
  }
});

export default router;
