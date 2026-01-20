
import React, { useMemo, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { MdDashboardCustomize } from "react-icons/md";
import Navbar from "../components/Navbar";
import { FaUpload } from "react-icons/fa";
const Dashboard = () => {
  const [quantity, setQuantity] = useState(1);
  const [imageFile, setImageFile] = useState(null);
const [imagePreview, setImagePreview] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [formState, setFormState] = useState({
    name: "",
    category: "المواد الغذائية",
    price: "",
     quantity: Number(quantity),
       createdAt: serverTimestamp(),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const productsRef = useMemo(() => collection(db, "products"), []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  

  const uploadImageToCloudinary = async () => {
  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("upload_preset", "product");
  formData.append("cloud_name", "dfpzpu2uh");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dfpzpu2uh/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  return data.secure_url;
};
 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!formState.name || !formState.price || !imageFile || !quantity) return;

  try {
    setIsSubmitting(true);

    // 1️⃣ رفع الصورة
    const imageURL = await uploadImageToCloudinary();

    // 2️⃣ حفظ المنتج
    await addDoc(productsRef, {
      name: formState.name,
      category: formState.category,
      price: Number(formState.price),
      quantity: Number(quantity),
      image: imageURL,
      createdAt: serverTimestamp(),
    });

    alert("تم إضافة المنتج ✅");

    setFormState({
      name: "",
      category: "المواد الغذائية",
      price: "",
    });
    setImageFile(null);
    setImagePreview("");
  } catch (err) {
    console.error(err);
    alert("حصل خطأ ❌");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
 <>
<Navbar />
<div className="min-h-screen bg-linear-to-br from-green-50 to-green-100 p-6">
{toastMessage && (
  <div className="mb-6 rounded-xl border border-green-200 bg-white px-4 py-3 text-green-700 shadow-sm">
    {toastMessage}
  </div>
)}





<div className="rounded-2xl shadow-md flex justify-center items-center min-h-screen ">
<div className="p-6">

<div className="overflow-x-auto">



    <form
    className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl"
    onSubmit={handleSubmit}
  >


{/* Product Name */}
<div className="flex flex-col gap-2">
<label className="text-sm font-medium text-green-800">اسم المنتج</label>
<input
type="text"
placeholder="مثال: سكر"
name="name"
value={formState.name}
onChange={handleChange}
className="border border-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
/>
</div>


{/* Category */}
<div className="flex flex-col gap-2">
<label className="text-sm font-medium text-green-800">القسم</label>
<select
  name="category"
  value={formState.category}
  onChange={handleChange}
  className="border border-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
>
  <option value="المواد الغذائية">المواد الغذائية</option>
  <option value="الاجهزة الكهربائية"> الاجهزة الكهربائية</option>
  <option value="ادوات المنزل"> ادوات المنزل</option>
  <option value="اكسسوارات الموبايل">   اكسسوارات الموبايل</option>
  
</select>
</div>


{/* Price */}
<div className="flex flex-col gap-2">
<label className="text-sm font-medium text-green-800">السعر</label>
<input
type="number"
placeholder="مثال: 25"
name="price"
value={formState.price}
onChange={handleChange}
className="border border-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
/>
</div>

{/* Quantity */}
<div className="flex flex-col gap-2">
  <label className="text-sm font-medium text-green-800">
    الكمية المتاحة
  </label>
  <input
    type="number"
    min="0"
    placeholder="مثال: 10"
    value={quantity}
    onChange={(e) => setQuantity(Number(e.target.value))}
    className="border border-green-200 rounded-lg px-4 py-2
    focus:outline-none focus:ring-2 focus:ring-green-400"
  />
</div>


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





{/* Submit */}
<div className="md:col-span-2">
<button
type="submit"
className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-70 disabled:cursor-not-allowed"
disabled={isSubmitting}
>
{isSubmitting ? "جار الإضافة..." : "إضافة المنتج"}
</button>
</div>


</form>
  </div>

</div>
</div>
</div>


 </>
  );
};



export default Dashboard;

