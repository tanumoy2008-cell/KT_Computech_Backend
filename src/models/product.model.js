import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    Subcategory: {
        type: String,
        required: true,
    },
    Maincategory:{
        type: String,
        required: true,
    },
    description: {
        type: Array,
        required: true,
    },
    productPic: {
        type: String,
        required: true,
    },
    picPublicId: {
        type: String,
        default: ""
    },
    price:{
        type: Number,
        default: 0
    },
    clicked: {
        type: Number,
        default: 0
    },
    off:{
        type: Number,
        default: 0
    }
},{timestamps:true})

const productModel = mongoose.model("product", productSchema);

export default productModel;