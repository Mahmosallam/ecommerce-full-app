import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";

function useCartActions() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

const addItem = async (product, quantity = 1) => {
  dispatch(
    addToCart({
      ...product,
      qty: quantity,
    })
  );

  if (!user) return;

  try {
    const response = await axios.post(
      "http://localhost:5000/api/cart",
      { productId: product._id, quantity },
      {
        headers: { authorization: `Bearer ${user.token}` },
      }
    );

    console.log("ADDED TO CART:", response.data);
  } catch (err) {
    console.log("Error adding to cart:", err.response?.data || err.message);
  }
};

  return { addItem };
}

export default useCartActions;
