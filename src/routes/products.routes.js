import { Router } from "express";
import ProductManager from "../services/ProductManager.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || undefined;
    const allProducts = await ProductManager.getProducts();
    if (limit) {
      const limitedProducts = allProducts.slice(0, limit);
      res.status(200).json(limitedProducts);
    } else {
      res.status(200).json(allProducts);
    }
  } catch (error) {
    res.status(500).json(`Internal server error: ${error}`);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const isId = parseInt(req.params.id, 10);
    const foundProduct = await ProductManager.getProductById(isId);

    if (foundProduct !== "Product not found") {
      res.status(200).json(foundProduct);
    } else {
      res.status(404).json(foundProduct);
    }
  } catch (error) {
    res.status(500).send(`Internal server error: ${error}`);
  }
});

router.post("/", async (req, res) => {
  try {
    const product = req.body;
    const newProduct = await ProductManager.addProduct(product);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).send(`Internal server error: ${error}`);
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const updatedProduct = await ProductManager.updateProduct(
      parseInt(req.params.pid, 10),
      req.body
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).send(`Internal server error: ${error}`);
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const deletedProduct = await ProductManager.deleteProduct(
      parseInt(req.params.pid, 10)
    );
    res.status(200).json(deletedProduct);
  } catch (error) {
    res.status(500).send(`Internal server error: ${error}`);
  }
});

export default router;
