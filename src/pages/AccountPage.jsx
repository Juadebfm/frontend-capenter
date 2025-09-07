import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AccountPage() {
  const { register, isLoading, error } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [newsletter, setNewsletter] = useState(false);

  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMsg("");

    if (!firstName.trim() || !lastName.trim()) {
      setFormError("Please enter your first and last name.");
      return;
    }
    if (password !== confirm) {
      setFormError("Passwords do not match.");
      return;
    }

    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      const res = await register(fullName, email.trim(), password);
      setSuccessMsg(res?.message || "Account created!");
      console.log("Newsletter opted in?", newsletter); // send to backend if needed
      //  navigate('/home') 
    } catch {
      // error already set in context
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-semibold mb-8">
          Create New Customer Account
        </h1>

        <form onSubmit={onSubmit} className="space-y-10">
          {/* Personal Information */}
          <section>
            <h2 className="text-lg font-medium mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">
                  First name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">
                  Last name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <label className="inline-flex items-center mt-2 md:col-span-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={newsletter}
                  onChange={(e) => setNewsletter(e.target.checked)}
                />
                <span>Sign Up for Newsletter</span>
              </label>
            </div>
          </section>

          {/* Email & Password */}
          <section>
            <h2 className="text-lg font-medium mb-4">Email &amp; Password</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className="w-full border rounded-md px-3 py-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  className="w-full border rounded-md px-3 py-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  className="w-full border rounded-md px-3 py-2"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </div>
            </div>
          </section>

          {(formError || error) && (
            <p className="text-red-600">{formError || error}</p>
          )}
          {successMsg && <p className="text-green-600">{successMsg}</p>}

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-lime-500 text-white font-medium px-5 py-2 rounded-md disabled:opacity-60"
            >
              {isLoading ? "Creating..." : "Create an Account"}
            </button>
            <button
              type="button"
              className="text-gray-600"
              onClick={() => window.history.back()}
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
