import React, { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";
import Swal from "sweetalert2";

const OffersList = () => {
  const [offers, setOffers] = useState([]);
  const [filter, setFilter] = useState("الكل");
const [isEditOpen, setIsEditOpen] = useState(false);
const [selectedOffer, setSelectedOffer] = useState(null);

const [editData, setEditData] = useState({
  name: "",
  oldPrice: "",
  discountPercent: "",
  category: "",
  quantity: "",
});
const handleEdit = (offer) => {
  setSelectedOffer(offer);
  setEditData({
    name: offer.name,
    oldPrice: offer.oldPrice,
    discountPercent: offer.discountPercent,
    category: offer.category,
    quantity: offer.quantity,
  });
  setIsEditOpen(true);
};
const calculateNewPrice = (oldPrice, discount) => {
  if (!oldPrice || !discount) return oldPrice;
  return Math.round(
    oldPrice - (oldPrice * discount) / 100
  );
};

const handleUpdate = async () => {
  try {
    const newPrice = calculateNewPrice(
      Number(editData.oldPrice),
      Number(editData.discountPercent)
    );

    await updateDoc(doc(db, "offers", selectedOffer.id), {
      name: editData.name,
      oldPrice: Number(editData.oldPrice),
      discountPercent: Number(editData.discountPercent),
      newPrice, // ⭐ ده المهم
      category: editData.category,
      quantity: Number(editData.quantity),
    });

    Swal.fire("تم التعديل ✅", "", "success");
    setIsEditOpen(false);
  } catch (err) {
    Swal.fire("حصل خطأ ❌", "", "error");
  }
};

  useEffect(() => {
    const offersRef = collection(db, "offers");

    const unsub = onSnapshot(offersRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOffers(data);
    });

    return () => unsub();
  }, []);
  const filteredOffers =
    filter === "الكل"
      ? offers
      : offers.filter((item) => item.category === filter);
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "متأكد؟",
      text: "مش هتعرف ترجّعه تاني!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "أيوه احذف",
      cancelButtonText: "إلغاء",
    });

    if (result.isConfirmed) {
      await deleteDoc(doc(db, "offers", id));
      Swal.fire("تم الحذف ✅", "", "success");
    }
  };


  return (
    <>
    <div className="min-h-screen bg-green-50 p-6">
      <h2 className="text-2xl font-bold text-green-700 mb-6">
        كل العروض
      </h2>

      {/* الفلتر */}
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-6 p-2 rounded-lg border"
      >
        <option value="الكل">الكل</option>
        <option value="المواد الغذائية">المواد الغذائية</option>
        <option value="الاجهزة الكهربائية">الأجهزة الكهربائية</option>
        <option value="ادوات المنزل">أدوات المنزل</option>
        <option value="اكسسوارات الموبايل">اكسسوارات الموبايل</option>
      </select>

      {/* العروض */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredOffers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white rounded-2xl shadow p-4"
          >
            <img
              src={offer.image}
              alt={offer.name}
              className="h-40 w-full object-cover rounded-xl"
            />

            <h3 className="mt-3 font-bold text-lg">
              {offer.name}
            </h3>

            <p className="text-sm text-gray-500">
              {offer.category}
            </p>
            <p className="text-sm text-gray-500">
                الكمية: {offer.quantity}
            </p>

            <div className="flex justify-between mt-2">
              <span className="line-through text-red-500">
                {offer.oldPrice} ج
              </span>
              <span className="font-bold text-green-600">
                {offer.newPrice} ج
              </span>
            </div>
               
           <div className="flex gap-2 mt-4">
  <button
    onClick={() => handleEdit(offer)}
    className="w-1/2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl cursor-pointer"
  >
    تعديل
  </button>

  <button
    onClick={() => handleDelete(offer.id)}
    className="w-1/2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl cursor-pointer"
  >
    حذف
  </button>
</div>

          </div>
        ))}
      </div>
    </div>
    {isEditOpen && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white w-full max-w-md rounded-2xl p-6">
      <h3 className="text-xl font-bold mb-4 text-green-700">
        تعديل العرض
      </h3>
      <label htmlFor="name">
        اسم العرض
      </label>
      <input
        className="w-full border p-2 rounded-lg mb-3"
        placeholder="اسم العرض"
        value={editData.name}
        onChange={(e) =>
          setEditData({ ...editData, name: e.target.value })
        }
      />
      <label htmlFor="oldPrice">
        السعر القديم
      </label>
      <input
        type="number"
        className="w-full border p-2 rounded-lg mb-3"
        placeholder="السعر القديم"
        value={editData.oldPrice}
        onChange={(e) =>
          setEditData({ ...editData, oldPrice: e.target.value })
        }
      />

      <label htmlFor="discountPercent">
        نسبة الخصم %
      </label>
      <input
        type="number"
        className="w-full border p-2 rounded-lg mb-3"
        placeholder="نسبة الخصم %"
        value={editData.discountPercent}
        onChange={(e) =>
          setEditData({ ...editData, discountPercent: e.target.value })
        }
      />
      <label htmlFor="category">
        الفئة
      </label>
      <select
        className="w-full border p-2 rounded-lg mb-3"
        value={editData.category}
        onChange={(e) =>
          setEditData({ ...editData, category: e.target.value })
        }
      >
        <option value="المواد الغذائية">المواد الغذائية</option>
        <option value="الاجهزة الكهربائية">الأجهزة الكهربائية</option>
        <option value="ادوات المنزل">أدوات المنزل</option>
        <option value="اكسسوارات الموبايل">اكسسوارات الموبايل</option>
      </select>
      <label htmlFor="quantity">
        الكمية
      </label>

      <input
        type="number"
        className="w-full border p-2 rounded-lg mb-4"
        placeholder="الكمية"
        value={editData.quantity}
        onChange={(e) =>
          setEditData({ ...editData, quantity: e.target.value })
        }
      />

      <div className="flex gap-3">
        <button
          onClick={handleUpdate}
          className="flex-1 bg-green-600 text-white py-2 rounded-xl"
        >
          حفظ
        </button>
        <button
          onClick={() => setIsEditOpen(false)}
          className="flex-1 bg-gray-300 py-2 rounded-xl"
        >
          إلغاء
        </button>
      </div>
    </div>
  </div>
)}

  </>);
};

export default OffersList;
