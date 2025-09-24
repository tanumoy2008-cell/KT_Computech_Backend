import userModel from "../models/user.model.js";

const addProductInCart = async (req, res)=> {
    const userId = req.user.id;
    const {productId} = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingProduct = user.cart.find(
      (item) => item.productId.toString() === productId
    );

    if (existingProduct) {
      if(existingProduct.quantity == 20){
        return res.status(406).json({message: "You reach Product quantity limit!"});
      }
      existingProduct.quantity += 1;
    } else {
      user.cart.push({ productId, quantity: 1 });
    }

    await user.save();
    const updatedUser = await userModel
      .findById(userId)
      .populate({
        path: "cart.productId",
        select: "name price productPic _id"
      })

    const cartWithMergedQuantity = updatedUser.cart.map(item => {
      const product = item.productId.toObject();
      product.quantity = item.quantity;
      return product;
    });

    return res.status(200).json({
      message: "Product added to cart successfully",
      cart:  cartWithMergedQuantity,
    });
}

const cartInfo = async (req, res)=>{
  const userId = req.user.id;

  const user = await userModel
  .findById(userId)
  .populate({
    path: "cart.productId",
    select: "name price productPic _id"
  });

  const cartWithMergedQuantity = user.cart.map(item => {
      const product = item.productId.toObject();
      product.quantity = item.quantity;
      return product;
    });
  
  return res.status(200).json({
      message: "cart send successfully",
      cart:cartWithMergedQuantity,
    });
}

const addQuantityOfPerticularProduct = async (req, res) => {
  const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartItem = user.cart.find(
      (item) => item.productId.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    if (cartItem.quantity == 20) {
      return res.status(406).json({ message: "You reached highest product quantity limit!" });
    }
    cartItem.quantity += 1;

    await user.save();

    const updatedUser = await userModel
      .findById(userId)
      .populate({
        path: "cart.productId",
        select: "name price productPic _id",
      });

    const updatedProduct = updatedUser.cart
      .find(item => item.productId._id.toString() === productId);

    const product = updatedProduct.productId.toObject();
    product.quantity = updatedProduct.quantity;

    return res.status(200).json({
      message: "Quantity updated successfully",
      product,
    });
};

const reduceQuantityOfPerticularProduct = async (req, res) => {
  const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartItem = user.cart.find(
      (item) => item.productId.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    if (cartItem.quantity == 1) {
      return res.status(406).json({ message: "You reached lowest product quantity limit!" });
    }
    cartItem.quantity -= 1;

    await user.save();

    const updatedUser = await userModel
      .findById(userId)
      .populate({
        path: "cart.productId",
        select: "name price productPic _id",
      });

    const updatedProduct = updatedUser.cart
      .find(item => item.productId._id.toString() === productId);

    const product = updatedProduct.productId.toObject();
    product.quantity = updatedProduct.quantity;

    return res.status(200).json({
      message: "Quantity updated successfully",
      product,
    });
}


export {
    addProductInCart,
    cartInfo,
    addQuantityOfPerticularProduct,
    reduceQuantityOfPerticularProduct
}