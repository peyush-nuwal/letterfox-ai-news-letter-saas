import { Edit, SlidersHorizontal, CreditCard } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen px-4 py-8 bg-gray-100 sm:px-6 lg:px-8">
      {/* header  */}
      <div className="mt-20 ">
        <h1 className="text-4xl font-bold text-center text-slate-800">
          Your NewsLetters Dashboard
        </h1>
        <p className="mt-2 overflow-hidden text-center text-gray-600">
          Manage your personalized newsletter preferences
        </p>
      </div>
      {/* content  */}
      <div>
        {/* current preferences */}
        <div className="w-full max-w-3xl p-8 mx-auto my-8 bg-white rounded-xl">
          <h2 className="text-2xl font-semibold ">Current preferences</h2>
          <div className="my-8">
            {true ? (
              <div>
                {/* Categories  */}
                <div className="my-8">
                  <h4 className="text-xl font-medium ">Categories</h4>
                  <div className="flex flex-wrap gap-2 my-2">
                    {["science", "frontend", "ai"].map((category, idx) => (
                      <span
                        key={idx}
                        className="px-6 py-1 text-lg rounded-full bg-primary/20 text-primary"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
                {/* frequency  */}
                <div className="my-8">
                  <h4 className="text-xl font-medium">Frequency</h4>
                  <h5 className="text-lg text-gray-700">Daily</h5>
                </div>

                {/* Email  */}
                <div className="my-8">
                  <h4 className="text-xl font-medium">Email</h4>
                  <h5 className="text-lg text-gray-700">User124@gmail.com</h5>
                </div>
                {/* subscription status  */}
                <div className="my-8">
                  <h4 className="text-xl font-medium">Status</h4>
                  <h5 className="flex items-center text-lg font-medium text-gray-800">
                    <span
                      className={`h-2.5 w-2.5 rounded-full mr-2 ${
                        true ? "bg-green-500 animate-pulse" : "bg-red-500"
                      }`}
                    ></span>
                    {true ? "Active" : "Inactive"}
                  </h5>
                </div>
                {/* Email  */}
                <div className="my-8">
                  <h4 className="text-xl font-medium">Created At</h4>
                  <h5 className="text-lg text-gray-700">22/2/2025</h5>
                </div>
              </div>
            ) : (
              <p className="mb-4 text-center text-gray-600">
                No preferences set yet
              </p>
            )}
          </div>
          <button className="block ml-auto w-fit btn btn-primary">
            {" "}
            <Link href="/select" className="">
              Set Up Newsletter
            </Link>
          </button>
        </div>
        {/* Actions  */}
        <div className="w-full max-w-3xl p-8 mx-auto my-8 bg-white rounded-xl">
          <h2 className="text-2xl font-semibold ">Actions</h2>

          <div className="space-y-2 my-5">
            <button className="w-full py-3 btn btn-primary flex items-center justify-center gap-3">
              <Edit /> Manage Preferences
            </button>
            <button className="w-full  py-3  btn bg-red-100 border border-red-600 text-red-600   flex items-center justify-center gap-3 hover:scale-[101%] active:scale-[99%] ">
              <SlidersHorizontal /> Pause Newsletter
            </button>
            <button className="w-full  py-3  btn border   flex items-center justify-center gap-3 hover:scale-[101%] active:scale-[99%] ">
              <CreditCard /> manage Subscription
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
