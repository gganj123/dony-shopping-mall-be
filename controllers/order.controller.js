const Order = require("../models/Order");
const { randomStringGenerator } = require("../utils/randomStringGenerator");
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
    //재고가 충분하지 않는 아이템이 있었다 => 에러
    if (insufficientStockItems.length > 0) {
      const errorMessage = insufficientStockItems.reduce(
        (total, item) => (total += item.message),
        ""
      );
      throw new Error(errorMessage);
    }

    const newOrder = new Order({
      userId,
      totalPrice,
      shipTo,
      contact,
      items: orderList,
      orderNum: randomStringGenerator(),
    });
    await newOrder.save();
    //save후에 카트를 비워두자

    res.status(200).json({ status: "success", orderNum: newOrder.orderNum });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

orderController.getOrder = async (req, res) => {
  try {
    const { userId } = req;
    const order = await Order.find({ userId }).populate("items.productId");
    if (!order) throw new Error("주문한 물품이 없습니다.");

    res.status(200).json({ status: "success", data: order });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

orderController.getOrderList = async (req, res) => {
  try {
    const cond = {
      ...(name && { name: { $regex: name, $options: "i" } }), // name검색 조건이 있을때 조건 따르기
      isDeleted: { $ne: true }, //isdelete 는 true가 아닌것은 항상 제외
    };

    const order = await Order.find(cond)
      .populate("userId", "email")
      .populate("productId", "name image");

    res.status(200).json({ status: "success", data: order });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = orderController;
