import { products } from "./../db/schema";
import type { Request, Response } from "express";
import * as queries from "../db/queries";
import { getAuth } from "@clerk/express";

export const getAllProduct = async (req: Request, res: Response) => {
  try {
    const products = await queries.getAllProduct();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error getting products: ", error);
    res.status(500).json({ error: "Failed to get products" });
  }
};

export const getMyProducts = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const products = await queries.getProductByUserId(userId);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error getting user products: ", error);
    res.status(500).json({ error: "Failed to get user products" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") {
      return res.status(400).json({ error: "Invalid product ID" });
    }
    const product = await queries.getProductById(id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    console.error("Error getting product: ", error);
    res.status(500).json({ error: "Failed to get product" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const { title, description, imageUrl } = req.body;
    if (!title || !description || !imageUrl) {
      res
        .status(400)
        .json({ error: "Title, description and imageUrl are required" });
      return;
    }
    const product = await queries.createProduct({
      title,
      description,
      imageUrl,
      userId,
    });
    res.status(201).json(product);
  } catch (error) {
    console.error("Error create product: ", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const { id } = req.params;
    if (typeof id !== "string") {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }
    const { title, description, imageUrl } = req.body;
    const existingProduct = await queries.getProductById(id);
    if (!existingProduct)
      return res.status(404).json({ error: "Product not found" });
    if (existingProduct.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You can only update your own products" });
    }
    const product = await queries.updateProduct(id, {
      title,
      description,
      imageUrl,
    });
    res.status(200).json(product);
  } catch (error) {
    console.error("Error updating product: ", error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const { id } = req.params;
    if (typeof id !== "string") {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }
    const existingProduct = await queries.getProductById(id);
    if (!existingProduct)
      return res.status(404).json({ error: "Product not found" });
    if (existingProduct.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You can only delete your own products" });
    }
    await queries.deleteProduct(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product: ", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};
