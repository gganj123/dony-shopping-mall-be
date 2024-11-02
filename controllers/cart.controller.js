const Cart = require("../models/Cart");
const cartController = {};

cartController.addItemToCart = async (req, res) => {
  try {
    //카트 정보 읽어오기
    const { userId } = req;
    const { productId, size, qty } = req.body;

    //유저를 가지고 카트 찾기
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      //유저가 만든 카트가 없다, 만들어주'기
      cart = new Cart({ userId });
      await cart.save();
    }
    //이미 카트에 들어가있는 아이템이냐? product size 둘다 체크
    let existItem = cart.items.find(
      (item) => item.productId.equals(productId) && item.size === size
    ); //productId같은 몽구스 오브젝트 아이디타입은 string이 아니기 떄문에 ===가 안되고 equals를 써야한다!

    //그렇다면 에러('이미 아이템이 카트에 있따)
    if (existItem) {
      throw new Error("아이템이 이미 카트에 담겨 있습니다!");
    }
    //잇다면?
    //카트에 아이템을 추가
    cart.items = [...cart.items, { productId, size, qty }];
    console.log(cart.items.length);
    await cart.save();

    res
      .status(200)
      .json({ status: "success", data: cart, cartItemsQty: cart.items.length });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

cartController.getCartList = async (req, res) => {
  try {
    const { userId } = req;

    let cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) throw new Error("텅~");

    res.status(200).json({ status: "success", data: cart });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

cartController.deleteCartList = async (req, res) => {
  try {
    const { userId } = req;
    const { id: productId } = req.params.id;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res
        .status(404)
        .json({ status: "fail", error: "카트가 없습니다." });
    }

    // 카트에서 아이템을 삭제
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.equals(productId) // productId가 일치하는 아이템 찾기
    );

    // 아이템이 카트에 없을 경우 처리
    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ status: "fail", error: "해당 아이템이 카트에 없습니다." });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    res.status(200).json({ status: "success", data: cart });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = cartController;

module.exports = cartController;
