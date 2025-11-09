import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, Minus, Plus, Trash } from "lucide-react";

const Cart = () => {
  const { items, updateQty, removeItem, getSubTotal, itemCount } = useCart();

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [zip, setZip] = useState("");

  // Checkout functionality
  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/acct", { state: { from: "/cart" } });
    }
    navigate("/checkout");
  };

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-semibold mb-6">Shopping Cart</h1>

          <div className="bg-white p-8 rounded shadow text-center">
            <p className="text-lg">Your Cart Is Empty</p>
            <Link to="/" className="mt-4 inline-block text-green-500 underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white">
      {/* Hero / banner */}
      <div className="bg-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="text-sm text-gray-600 mb-2">Home / Shopping Cart</nav>
          <h1 className="text-4xl font-semibold">Shopping Cart</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: cart table */}
          <div className="lg:col-span-8">
            <div className="bg-white p-6 rounded shadow">
              <div className="hidden md:grid grid-cols-12 gap-4 text-sm text-gray-500 border-b pb-3 mb-4">
                <div className="col-span-6">Item</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Subtotal</div>
              </div>

              <div className="space-y-6">
                {items.map((item) => (
                  <div
                    key={item.sku}
                    className="grid grid-cols-12 gap-4 items-start"
                  >
                    <div className="col-span-12 md:col-span-6 flex items-start gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-28 h-28 object-cover rounded bg-gray-50"
                      />
                      <div>
                        <Link
                          to={`/products/${item.sku}`}
                          className="text-lg font-medium hover:underline"
                        >
                          {item.name}
                        </Link>
                        <div>
                          <p className="text-[#828282]/60">
                            <span className="text-[#828282] font-bold text-sm">
                              Size:
                            </span>{" "}
                            29
                          </p>
                          <p className="text-[#828282]/60">
                            <span className="text-[#828282] font-bold text-sm">
                              Color:
                            </span>{" "}
                            Green
                          </p>
                        </div>
                        {/* //remove icon for each items */}
                        <button onClick={() => removeItem(item.sku)}>
                          <Trash className="w-4 h-4 mt-4 text-red-500 hover:scale-105" />
                        </button>
                      </div>
                    </div>

                    <div className="col-span-6 md:col-span-2 text-right">
                      <div className="font-semibold">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>

                    <div className="col-span-6 md:col-span-2 flex items-center justify-center">
                      <div className="inline-flex items-center border rounded">
                        <button
                          onClick={() =>
                            updateQty(item.sku, Math.max(0, item.qty - 1))
                          }
                          className="px-1 py-2"
                        >
                          <Minus className="w-4 h-4 font-bold" />
                        </button>
                        <input
                          type="number"
                          value={item.qty}
                          onChange={(e) =>
                            updateQty(
                              item.sku,
                              Math.max(0, Number(e.target.value) || 0)
                            )
                          }
                          className="w-16 text-center"
                        />
                        <button
                          onClick={() => updateQty(item.sku, item.qty + 1)}
                          className="px-1 py-2"
                        >
                          <Plus className="w-4 h-4 font-bold" />
                        </button>
                      </div>
                    </div>

                    <div className="col-span-6 md:col-span-2 text-right font-semibold">
                      {(item.price * item.qty).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Update backend to handle multiple currency sources, and waitlist functionality ******************-----> */}

              <div className="mt-20 flex items-end justify-between border-t pt-6">
                <div>
                  <p className="mb-3">Apply Discount Code</p>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="SALE2020"
                      className="border px-3 py-2"
                    />
                    <button className="bg-swBlack text-white px-4 py-2">
                      Apply Discount
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="bg-swLightGray text-swBlack px-4 py-2 font-bold"
                >
                  Update Shopping Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: summary */}
        <aside className="min-w-[328px]">
          <div className="bg-[#F5F5F5] p-6 rounded shadow">
            <h2 className="text-lg font-medium mb-4 border-b-2 pb-2">
              Summary
            </h2>

            <div>
              {/* Details */}
              <div>
                {/* summary */}
                <div className="flex items-center justify-between">
                  <span>Estimate Shipping And Tax</span>
                  <ChevronDown className="w-5 h-5" />
                </div>

                <div className="mt-3 space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500">
                      Country
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full border px-3 py-2"
                      placeholder="United States"
                    />
                  </div>

                  <div>
                    <label>State/Provinces</label>
                    <input
                      type="text"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full border px-3 py-2"
                      placeholder="United States"
                    />
                  </div>
                  <div>
                    <label>Zip Postal Code</label>
                    <input
                      type="text"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="w-full border px-3 py-2"
                      placeholder="200100"
                    />
                  </div>
                </div>
              </div>

              <div className="text-sm text-swBlack">
                <div className="flex items-center justify-start my-2 gap-2">
                  <span>Sub Total:</span>
                  <span>${getSubTotal().toFixed(2)}</span>
                </div>

                <div>
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>

                <div>
                  <span>Order Total</span>
                  <span>${getSubTotal().toFixed()}</span>
                </div>

                <div className="border-t pt-4 mt-4 flex items-center justify-between font-semibold">
                  <span>Sub Total:</span>
                  <span>${getSubTotal().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="mt-6 w-full bg-swGreen text-white py-3 rounded-md"
              >
                Proceed To Checkout
              </button>

              <small className="flex items-center justify-center text-gray-400 text-xs underline underline-offset-2">
                Checkout to multiple address
              </small>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
