import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    category: "المواد الغذائية",
    price: "",
    quantity: "",
  });

  const productsRef = useMemo(() => collection(db, "products"), []);

  useEffect(() => {
    const productsQuery = query(productsRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(productsQuery, (snapshot) => {
      const nextProducts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(nextProducts);
    });
 ;
    return () => unsubscribe();
  }, [productsRef]);

  const filteredProducts = products.filter((product) => {
    if (selectedCategory === "all") return true;
    return product.category === selectedCategory;
  });

  const startEdit = (product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name || "",
      category: product.category || "المواد الغذائية",
      price: product.price ?? "",
      quantity: product.quantity ?? "",
    });
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    if (!editingProduct) return;

    await updateDoc(doc(db, "products", editingProduct.id), {
      name: editForm.name,
      category: editForm.category,
      price: Number(editForm.price),
      quantity: Number(editForm.quantity),
    });

    setEditingProduct(null);
    Swal.fire("تم التعديل ✅", "", "success");
  };

  const handleDelete = async (productId) => {
    await deleteDoc(doc(db, "products", productId));
    Swal.fire("تم الحذف ✅", "", "success");
  };

  return (
    <>
    
      <div className="min-h-screen bg-linear-to-br from-green-50 to-green-100 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold text-green-800">جميع المنتجات</h1>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-green-800">فلترة حسب القسم</label>
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="border border-green-200 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="all">كل الأقسام</option>
              <option value="المواد الغذائية">المواد الغذائية</option>
              <option value="الاجهزة الكهربائية">الاجهزة الكهربائية</option>
              <option value="ادوات المنزل">ادوات المنزل</option>
              <option value="اكسسوارات الموبايل">اكسسوارات الموبايل</option>
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-green-200 bg-white p-8 text-center text-green-700">
            لا يوجد منتجات لهذا القسم حالياً.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              console.log(product),
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
              >
                <div className="h-40 bg-green-100 flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-xl"
                  />
                </div>

                <div className="p-4 flex flex-col gap-2">
                  <h2 className="text-lg font-bold text-gray-800">{product.name}</h2>
                  <p className="text-sm text-gray-500">التصنيف: {product.category}</p>
                  <p className="text-green-700 font-semibold text-lg">{product.price} ج.م</p>
                  <p> {product.quantity} </p>

                  {/* Actions */}
                  <div className="flex gap-2 mt-3">
                    <button
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm"
                      onClick={() => startEdit(product)}
                    >
                      تعديل
                    </button>
                    <button
                      className="flex-1 border border-green-600 text-green-700 hover:bg-green-50 py-2 rounded-lg text-sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingProduct && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-green-800">تعديل المنتج</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setEditingProduct(null)}
              >
                إغلاق
              </button>
            </div>

            <form className="grid grid-cols-1 gap-4" onSubmit={handleUpdate}>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-green-800">اسم المنتج</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="border border-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-green-800">القسم</label>
                <select
                  name="category"
                  value={editForm.category}
                  onChange={handleEditChange}
                  className="border border-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="المواد الغذائية">المواد الغذائية</option>
                  <option value="الاجهزة الكهربائية">الاجهزة الكهربائية</option>
                  <option value="ادوات المنزل">ادوات المنزل</option>
                  <option value="اكسسوارات الموبايل">اكسسوارات الموبايل</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-green-800">السعر</label>
                <input
                  type="number"
                  name="price"
                  value={editForm.price}
                  onChange={handleEditChange}
                  className="border border-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-green-800">الكمية</label>
                <input
                  type="number"
                  name="quantity"
                  value={editForm.quantity}
                  onChange={handleEditChange}
                  className="border border-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>


              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm"
                >
                  حفظ التعديل
                </button>
                <button
                  type="button"
                  className="flex-1 border border-green-600 text-green-700 hover:bg-green-50 py-2 rounded-lg text-sm"
                  onClick={() => setEditingProduct(null)}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Products;