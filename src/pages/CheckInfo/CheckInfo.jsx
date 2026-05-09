import axios from "axios";
import React, { useEffect, useState } from "react";
import useAxiosPublic from "../../Hooks/useAxiosPublic";

const CheckInfo = () => {
  const [password, setPassword] = useState("");
  const [activeUser, setActiveUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [userInfo, setUserInfo] = useState([]);
  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    axiosPublic
      .get("/userInfo")
      .then((res) => setUserInfo(res.data))
      .catch((err) => console.error(err));
  }, [axiosPublic]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const found = userInfo.find((u) => u.password === password);

    if (found) {
      setActiveUser(found);
    } else {
      alert("Invalid Password");
      setPassword("");
    }
  };

  const handleLogout = () => {
    setActiveUser(null);
    setSelectedFile(null);
    setPassword("");
  };

  const documents = activeUser
    ? [
        { label: "LMI Document", path: activeUser.lmiUrl },
        { label: "Job Letter", path: activeUser.jobLetterUrl },
        { label: "Work Permit", path: activeUser.workPermitUrl },
        { label: "Application", path: activeUser.applicationUrl },
      ]
    : [];

  return (
    <section className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-5xl">

        {!activeUser ? (
          <div className="p-12 max-w-md mx-auto text-center">

            {/* ✅ LOGO + TITLE (FIXED) */}
            <div className="mb-6">
              <img
                src="/aulogo.gif"
                alt="RTS Company"
                className="w-52 mx-auto mb-3 object-contain"
              />

              <h1 className="text-3xl font-bold text-slate-800 tracking-wide">
                RTS Company Limited
              </h1>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                type="password"
                placeholder="Enter Password"
                className="w-full p-4 border rounded-xl mb-4"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition">
                Unlock Files
              </button>
            </form>
          </div>
        ) : (
          <div className="p-8">

            {/* Header */}
            <div className="flex justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold">{activeUser.name}</h1>
                <p>
                  Status:{" "}
                  <span
                    className={
                      activeUser.status === "approve"
                        ? "text-green-500"
                        : "text-yellow-500"
                    }
                  >
                    {activeUser.status}
                  </span>
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </div>

            {/* Documents */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {documents.map((doc, index) => (
                <div
                  key={index}
                  className="group relative bg-slate-50 border border-slate-100 p-6 rounded-2xl hover:bg-white hover:shadow-xl hover:border-blue-200 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 text-red-500 group-hover:scale-110 transition-transform">
                    📄
                  </div>

                  <h3 className="font-bold text-slate-700 mb-1">{doc.label}</h3>

                  <p className="text-xs text-slate-400 mb-6 uppercase">
                    Official PDF Document
                  </p>

                  {doc.path ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedFile(doc.path)}
                        className="flex-1 bg-white border border-slate-200 text-slate-600 py-2 rounded-lg text-sm font-bold hover:bg-blue-600 hover:text-white hover:border-blue-600 transition"
                      >
                        View
                      </button>

                      <a
                        href={doc.path}
                        download
                        className="px-3 py-2 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 transition"
                      >
                        ⬇
                      </a>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">Not Uploaded</p>
                  )}
                </div>
              ))}
            </div>

            {/* PDF Viewer */}
            {selectedFile && (
              <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-50 p-4 md:p-10 flex flex-col">

                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full font-bold transition"
                  >
                    Close Preview
                  </button>
                </div>

                <div className="flex-grow bg-white rounded-2xl overflow-hidden h-[80vh]">
                  <iframe
                    src={selectedFile}
                    className="w-full h-full"
                    title="PDF Preview"
                  />
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
};

export default CheckInfo;