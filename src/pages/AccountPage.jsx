import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "react-router-dom";

const AccountPage = () => {
  // Bring in the contexts value
  const { register, isLoading, error } = useAuth();

  //   const navigate = useLocation();

  // the input values state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newsletter, setNewsLetter] = useState(false);

  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMsg("");

    if (!firstName.trim() || !lastName.trim()) {
      setFormError("Please enter your first and last name");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Password does not match");
    }

    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`;

      const res = await register(fullName, email.trim(), password);
      setSuccessMsg(res?.message || "Account Created");

      console.log("Created:", newsletter);

      //   navigate("/home");
    } catch (error) {
      console.log(error);
    }
  };

  
  return (
    <section className="pt-40 min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1>Create New Customer Account</h1>

        <form onSubmit={onSubmit} className="space-y-10">
          {/* // Personal */}
          <div>
            <h2>Personal information</h2>
            <div className="">
              <div>
                <label className="block text-lg mb-1">First Name</label>
                <input
                  type="text"
                  className="w-full border border-slate-200 px-3 py-2"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-lg mb-1">Last Name</label>
                <input
                  type="text"
                  className="w-full border border-slate-200 px-3 py-2"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              {/* // News Letter */}
              <label>
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={newsletter}
                  onChange={(e) => setNewsLetter(e.target.checked)}
                />

                <span>Sign Up For Newsletter</span>
              </label>
            </div>
          </div>
          {/* Email Password */}
          <div>
            <h2>Email &amp; Password</h2>

            <div>
              <div>
                <label>
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
                <label>
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
                <label>
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  className="w-full border rounded-md px-3 py-2"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {(formError || error) && (
              <p className="text-red-500 font-bold">{formError || error}</p>
            )}
            {successMsg && (
              <p className="text-green-500 font-bold">{successMsg}</p>
            )}

            <div className="mt-2 flex items-center justify-between">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-lime-500 text-white font-medium px-5 py-3"
              >
                {isLoading ? "Creating..." : "Create an account"}
              </button>

              <button
                type="button"
                className="text-gray-600"
                onClick={() => window.history.back()}
              >
                Back
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AccountPage;
