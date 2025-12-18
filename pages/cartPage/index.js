import Cart from "@/components/cart/Cart";
import Orders from "@/models/Orders";
import ValidateToken from "@/utils/auth";
import connectDB from "@/utils/connectDB";

export default function CartPage({ orders }) {
  return <Cart orders={orders}/>;
}
export async function getServerSideProps(context) {
  const payload = ValidateToken(context);
  if (!payload) {
    return {
      redirect: {
        destination: "/?message=login_required",
      },
    };
  }
  await connectDB();
  const userOrders = await Orders.find({ userId: payload.userId }).sort({
    createdAt: -1,
  });

  return {
    props: {
      orders: JSON.parse(JSON.stringify(userOrders)), // تبدیل ObjectId و Date
    },
  };
}
