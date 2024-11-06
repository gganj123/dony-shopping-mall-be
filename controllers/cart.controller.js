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

cartController.deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req;
    const cart = await Cart.findOne({ userId });
    cart.items = cart.items.filter((item) => !item._id.equals(id));

    await cart.save();
    res
      .status(200)
      .json({ status: "delete success", cartItemCount: cart.items.length });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

cartController.updateCartItemQty = async (req, res) => {
  try {
    const { id } = req.params;
    const { qty } = req.body;
    const { userId } = req;

    const cart = await Cart.findOne({ userId });
    if (!cart) throw new Error("카트를 찾을 수 없습니다.");

    const item = cart.items.find((item) => item._id.equals(id));
    if (!item) throw new Error("아이템을 찾을 수 없습니다.");

    item.qty = qty;
    await cart.save();

    res.status(200).json({ status: "update success", qty: qty });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

cartController.getCartQty = async (req, res) => {
  try {
    const { userId } = req;
    const cart = Cart.fincById({ userId });
    if (!cart) throw new Error("There is no cart!");
    res.status(200).json({ status: "success", qty: cart.items.length });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = cartController;
