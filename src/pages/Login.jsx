import { useForm } from "react-hook-form";
import { Login_auth } from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    } = useForm();
    
    
    
    
    
    const onSubmit = async (data) => {
   

    try {
      console.log("DATA:", data);
  
      const user = await Login_auth(data.email, data.password);
  
      console.log("USER:", user);
  
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/dashboard");
    } catch (err) {
      console.log("ERROR:", err);
      Swal.clickConfirm(  "invalid email or password" );
    }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center mb-10 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <h1 className="text-5xl font-bold text-slate-900 mb-2">لوحة التحكم</h1>
            <p className="text-slate-600">سجل الدخول للمتابعة</p>
          </div>

         
        

          <form  className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                type="email"
                
                {...register("email", { required: "الإيميل مطلوب" })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition border-slate-300"
                placeholder="example@email.com"
              />
             {errors.email && (
               <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                كلمة المرور
              </label>
              <input
                id="password"
                type="password"
                {...register("password", { required: "كلمة السر مطلوبة" })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition border-slate-300"
                placeholder="••••••••"
              />
             {errors.password && (
<p className="text-red-500 text-sm mt-1">
{errors.password.message}
</p>
)}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "جاري الدخول..." : "تسجيل الدخول"}
           
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

