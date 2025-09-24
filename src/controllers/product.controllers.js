import mongoose from "mongoose";
import { uploadImage } from "../db/cloudinary.connection.js";
import productModel from "../models/product.model.js"
import { v2 as cloudinary } from "cloudinary";

const productAdd = async (req,res) => {
const { name, company, Subcategory, productDescription,Maincategory, price } = req.body;
    const File = req.file;
  if (File) {
    try {
      const result = await uploadImage(File.buffer, {
        folder: "product/picture",
      });
      await productModel.create({
        name,
        company,
        Subcategory,
        Maincategory,
        price,
        description: productDescription,
        productPic: result.secure_url,
        picPublicId : result.public_id
      })
      return res
        .status(200)
        .json({ message: "Product added successfully"});
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      return res.status(500).json({ message: "Image upload failed" });
    }
  }

}

const productDetsSender = async (req, res) => {
  try {
    const start = parseInt(req.query.start) || 0;
    const limit = parseInt(req.query.limit) || 12;
    const query = req.query.query?.trim() || "";
    const Subcategory = req.query.Subcategory?.trim() || "";
    const Maincategory = req.query.Maincategory?.trim() || "";

    if (!Maincategory) {
      return res.json({
        product: [],
        subcategories: [{ key: "", label: "All Products" }],
        maincategories: [],
        hasMore: false,
        nextStart: null,
      });
    }

    let productFilter = {};
    if (Maincategory !== "all") productFilter.Maincategory = Maincategory;

    if (query) {
      productFilter.$or = [
        { name: { $regex: query, $options: "i" } },
        { company: { $regex: query, $options: "i" } },
      ];
    }

    if (Subcategory) productFilter.Subcategory = Subcategory;

    let results = await productModel
      .find(productFilter)
      .skip(start)
      .limit(limit + 1)
      .select("name company _id price productPic Maincategory Subcategory") 
      .sort({ createdAt: -1 });

    const hasMore = results.length > limit;
    if (hasMore) results.pop();

    let subcategoryFilter = {};
    if (Maincategory !== "all") subcategoryFilter.Maincategory = Maincategory;
    const subcategoriesFromDB = await productModel.distinct("Subcategory", subcategoryFilter);
    const uniqueSubcategories = [
      { key: "", label: "All Products" },
      ...subcategoriesFromDB
        .map((sub) => sub.trim().toLowerCase())
        .filter((v, i, a) => a.indexOf(v) === i)
        .map((sub) => ({
          key: sub,
          label: sub.charAt(0).toUpperCase() + sub.slice(1),
        })),
    ];

    const maincategoriesFromDB = await productModel.distinct("Maincategory");
    const uniqueMaincategories = [
      "all",
      ...maincategoriesFromDB.map((m) => m.trim()),
    ];

    res.json({
      product: results,
      subcategories: uniqueSubcategories,
      maincategories: uniqueMaincategories,
      hasMore,
      nextStart: hasMore ? start + limit : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};


const productSendWithLimit = async (req, res) => {
  try {
    const start = parseInt(req.query.start) || 0;
    const limit = parseInt(req.query.limit) || 12;
    const query = req.query.query?.trim() || "";
    const Subcategory = req.query.Subcategory?.trim() || "";
    const Maincategory = req.query.Maincategory?.trim() || "";

    if (!Maincategory) {
      return res.json({
        product: [],
        subcategories: [{ key: "", label: "All Products" }],
        hasMore: false,
        nextStart: null,
      });
    }

    let productFilter = {};
    if (Maincategory !== "all") productFilter.Maincategory = Maincategory;

    if (query) {
      productFilter.$or = [
        { name: { $regex: query, $options: "i" } },
        { company: { $regex: query, $options: "i" } },
      ];
    }

    if (Subcategory) productFilter.Subcategory = Subcategory;

    let results = await productModel
      .find(productFilter)
      .skip(start)
      .limit(limit + 1)
      .select("name company _id price productPic")
      .sort({ createdAt: -1 });

    const hasMore = results.length > limit;
    if (hasMore) results.pop();

    let subcategoryFilter = {};
    if (Maincategory !== "all") subcategoryFilter.Maincategory = Maincategory;

    const subcategoriesFromDB = await productModel.distinct(
      "Subcategory",
      subcategoryFilter
    );

    const uniqueSubcategories = [
      { key: "", label: "All Products" },
      ...subcategoriesFromDB
        .map((sub) => sub.trim().toLowerCase())
        .filter((v, i, a) => a.indexOf(v) === i)
        .map((sub) => ({
          key: sub,
          label: sub.charAt(0).toUpperCase() + sub.slice(1),
        })),
    ];

    res.json({
      product: results,
      subcategories: uniqueSubcategories,
      hasMore,
      nextStart: hasMore ? start + limit : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const product = async (req,res)=>{
    const {id} = req.params;
     if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }
    const product = await productModel.findById(id).select("name productPic description price off company _id").lean();
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(product);
}

const clickOnProduct = async (req, res)=>{
    const {id} = req.params;
    await productModel.findByIdAndUpdate(id, { $inc: { clicked: 1 } });
}

const sendTopProduct = async (req, res)=>{
  const topProduct = await productModel.find().sort({clicked: -1}).limit(8).select("productPic company name price _id").lean();
  return res.status(200).json(topProduct)
}

const productInfo = async (req, res)=>{
    const {id} = req.params;
     if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }
    const product = await productModel.findById(id).select("name productPic description price off company Maincategory Subcategory _id").lean();
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(product);
}

const productUpdate = async (req, res) => {
  try {
    const { name, company, Subcategory, productDescription, price, id, Maincategory, off } = req.body;
    const File = req.file;

    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updateFields = {};

    if (name) updateFields.name = name;
    if (company) updateFields.company = company;
    if (Subcategory) updateFields.Subcategory = Subcategory;
    if (Maincategory) updateFields.Maincategory = Maincategory;
    if (off) updateFields.off = off;
    if (price) updateFields.price = price;

    if (productDescription) {
      updateFields.description = Array.isArray(productDescription)
        ? productDescription
        : [productDescription];
    }

    if (File) {
      if (product.picPublicId) {
        await cloudinary.uploader.destroy(product.picPublicId);
      }

      const result = await uploadImage(File.buffer, {
        folder: "product/picture",
      });

      updateFields.productPic = result.secure_url;
      updateFields.picPublicId = result.public_id;
    }

    await productModel.findByIdAndUpdate(id, updateFields, { new: true });

    return res.status(200).json({ message: "Product updated successfully" });
  } catch (err) {
    console.error("Product update failed:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const productDelete = async (req, res)=>{
  const {id} = req.params;
  if(req.admin.role === "superAdmin"){
    const product = await productModel.findById(id);
    if(product.picPublicId){
      await cloudinary.uploader.destroy(product.picPublicId);
    }
    await productModel.findByIdAndDelete(id);
    return res.status(200).json({message: "Product is deleted successfully."})
  } else {
    return res.status(401).json({message: "you have no authority to delete the product."})
  }
}

const productCount = async (req, res)=>{
  const count = await productModel.estimatedDocumentCount();
  return res.status(200).json(count);
}

const topMostProduct = async (req, res)=>{
  const filter = { off: { $gt: 0 } };
    const topProducts = await productModel
      .find(filter)
      .sort({ off: -1 }) 
      .select("productPic company name _id price off")
      .limit(6)
      .lean(); 

    if (!topProducts || topProducts.length === 0) {
      return res.status(404).json({ message: "No offer product found" });
    }

    return res.status(200).json(topProducts);
}

export {
  productAdd, 
  productDetsSender, 
  productSendWithLimit,
  product, 
  clickOnProduct, 
  sendTopProduct, 
  productInfo, 
  productUpdate, 
  productDelete, 
  productCount,
  topMostProduct
};