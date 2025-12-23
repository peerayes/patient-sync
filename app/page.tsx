import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🏥 Patient Sync
          </h1>
          <p className="text-xl text-gray-600">
            Real-time Patient Registration System
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Patient Card */}
          <Link href="/patient">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all hover:scale-105 cursor-pointer border-2 border-transparent hover:border-blue-400">
              <div className="text-center">
                <div className="text-7xl mb-6">👤</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Patient
                </h2>
                <p className="text-gray-600 mb-6">ฉันเป็นผู้ป่วย</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    กรอกฟอร์มข้อมูลส่วนตัว
                    <br />
                    Fill out registration form
                  </p>
                </div>
                <div className="mt-6">
                  <span className="inline-flex items-center gap-2 text-blue-600 font-semibold">
                    เริ่มกรอกข้อมูล
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Staff Card */}
          <Link href="/staff">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all hover:scale-105 cursor-pointer border-2 border-transparent hover:border-green-400">
              <div className="text-center">
                <div className="text-7xl mb-6">👨‍⚕️</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Staff</h2>
                <p className="text-gray-600 mb-6">ฉันเป็นเจ้าหน้าที่</p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    ดูข้อมูลผู้ป่วยแบบ Real-time
                    <br />
                    View patient data in real-time
                  </p>
                </div>
                <div className="mt-6">
                  <span className="inline-flex items-center gap-2 text-green-600 font-semibold">
                    เข้าสู่ Dashboard
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
