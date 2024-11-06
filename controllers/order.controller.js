const Order = require("../models/Order");
const productController = require("./product.controller");

const orderController = {};

orderController.createOrder = async (req, res) => {
  try {
    //order데이터 받아오기totalPrice,shipTo, contact, orderList
    const { totalPrice, shipTo, contact, orderList } = req.body;
    const { userId } = req;

    //재고확인 & 재고 업데이트
    const insufficientStockItems = await productController.checkItemListStock(
      orderList
    );

    const newOrder = new Order({
      userId,
      totalPrice,
      shipTo,
      contact,
      items: orderList,
    });
    await newOrder.save();
    res.status(200).json({});
  } catch (error) {}
};

module.exports = orderController;
