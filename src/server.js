import express from "express";
import __dirname from "./dirname.js";
import handlebars from "express-handlebars";
import path from "path";
import productsRoutes from "./routes/products.routes.js";
import cartsRoutes from "./routes/carts.routes.js";
import productsView from "./routes/products.view.js";
import { Server } from "socket.io";
import ProductManager from "./services/ProductManager.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "../public")));

//Routes
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);
app.use("/", productsView);

//Config engine hablders
app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "main",
  })
);

//Set engine handlebars
app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`);

const httpserver = app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`)
);

//Socket.io
const io = new Server(httpserver);

io.on("connection", (socket) => {
  console.log("Client connected", socket.id); //Only for development

  async function loadProducts(socket) {
    try {
      const products = await ProductManager.getProducts();
      socket.emit("updateProducts", products);
    } catch (error) {
      socket.emit("error to load products");
    }
  }

  loadProducts(socket);

  //Add product
  socket.on("addProduct", async (newProductData) => {
    try {
      const newProduct = await ProductManager.addProduct(newProductData);
      socket.emit("statusAddProduct", newProduct);
      loadProducts(socket);
    } catch (error) {
      socket.emit("error to add product");
    }
  });

  //Delete product
  socket.on("deleteProduct", async (id) => {
    try {
      const deletedProduct = await ProductManager.deleteProduct(id);
      socket.emit("statusDeleteProduct", deletedProduct);
      loadProducts(socket);
    } catch (error) {
      socket.emit("error to delete product");
    }
  });
});
