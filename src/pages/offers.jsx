import React, { useMemo, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";

const offers = () => {
  const [quantity, setQuantity] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
const [formState, setFormState] = useState({
  name: "",
  category: "المواد الغذائية",
  oldPrice: "",
  discountPercent: "",
});

const calculateNewPrice = () => {
  const oldPrice = Number(formState.oldPrice);
  const discount = Number(formState.discountPercent);

  if (!oldPrice || !discount) return 0;

  return oldPrice - (oldPrice * discount) / 100;
};
  const [isSubmitting, setIsSubmitting] = useState(false);

  const offersRef = useMemo(() => collection(db, "offers"), []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const uploadImageToCloudinary = async () => {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "product");
    formData.append("cloud_name", "dfpzpu2uh");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dfpzpu2uh/image/upload",
      { method: "POST", body: formData }
    );

    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formState.name ||
      !formState.oldPrice ||
      !formState.discountPercent ||
      !imageFile
    )
      return;

    try {
      setIsSubmitting(true);

      const imageURL = await uploadImageToCloudinary();
await addDoc(offersRef, {
  name: formState.name,
  category: formState.category,
  oldPrice: Number(formState.oldPrice),
  newPrice: calculateNewPrice(),
  discountPercent: Number(formState.discountPercent),
  quantity: Number(quantity),
  image: imageURL,
  isActive: true,
  createdAt: serverTimestamp(),
});
     Swal.clickConfirm("تم إضافة العرض ✅");

      


      setFormState({
  name: "",
  category: "المواد الغذائية",
  oldPrice: "",
  discountPercent: "",
});

      setQuantity(1);
      setImageFile(null);
      setImagePreview("");
    } catch (err) {
      console.error(err);
      Swal.clickConfirm("حصل خطأ ❌");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
     
      <div className="min-h-screen bg-green-50 p-6 flex justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow-md grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full"
        >
          <h2 className="md:col-span-2 text-2xl font-bold text-green-700">
            إضافة عرض جديد
          </h2>

          <input
            name="name"
            placeholder="اسم العرض"
            value={formState.name}
            onChange={handleChange}
            className="border p-2 rounded-lg"
          />

          <select
            name="category"
            value={formState.category}
            onChange={handleChange}
            className="border p-2 rounded-lg"
          >
            <option value="المواد الغذائية">المواد الغذائية</option>
            <option value="الاجهزة الكهربائية">الأجهزة الكهربائية</option>
            <option value="ادوات المنزل">أدوات المنزل</option>
            <option value="اكسسوارات الموبايل">   اكسسوارات الموبايل</option>

          </select>

          <input
            name="oldPrice"
            type="number"
            placeholder="السعر القديم"
            value={formState.oldPrice}
            onChange={handleChange}
            className="border p-2 rounded-lg"
          />

        

          <input
        name="discountPercent"
        type="number"
        placeholder="نسبة الخصم %"
        value={formState.discountPercent}
        onChange={handleChange}
        className="border p-2 rounded-lg"
/>

          <input
            type="number"
            value={quantity}
            min="0"
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="الكمية"
            className="border p-2 rounded-lg"
          />

{/* Image */}
<label
  className="block cursor-pointer
             rounded-2xl border-2 border-dashed border-green-400/40
             bg-green-800
             p-6 text-center
             hover:border-green-400 hover:bg-green-400/5
             transition"
>
  {/* input نفسه */}
  <input
    type="file"
    accept="image/*"
    className="hidden"
    onChange={(e) => {
      const file = e.target.files[0];
      if (!file) return;
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }}
  />

  {/* المحتوى */}
  {!imagePreview ? (
    <>
      <p className="text-green-400 text-lg font-semibold mb-1">
        رفع صورة المنتج
      </p>
      <p className="text-sm text-black">
        اضغط لاختيار صورة
      </p>
    </>
  ) : (
    <div className="relative">
      <img
        src={imagePreview}
        alt="preview"
        className="mx-auto h-40 w-full object-cover rounded-xl"
      />
      <div
        className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100
                   transition flex items-center justify-center rounded-xl"
      >
        <span className="text-white text-sm">
          تغيير الصورة
        </span>
      </div>
    </div>
  )}
</label>

          <button
            disabled={isSubmitting}
            className="md:col-span-2 bg-green-600 text-white py-3 rounded-xl"
          >
            {isSubmitting ? "جار الإضافة..." : "إضافة العرض"}
          </button>
        </form>
      </div>
    </>
  );
};

export default offers;
