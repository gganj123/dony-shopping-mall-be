const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = Schema(
  {
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: Array, required: true },
    discription: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Object, required: true },
    status: { type: String, default: "active" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.method.toJSON = function () {
  const obj = this._doc;
  delete obj.updateAt;
  return obj;
};

const Product = mongoose.model("product", productSchema);
module.exports = Product;
