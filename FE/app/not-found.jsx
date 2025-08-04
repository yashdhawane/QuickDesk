import Link from "next/link";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Sorry, this page is not found.</p>
        <div className="flex gap-4">
          <Link
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Go to Home
          </Link>
          <Link
            href="/ticket"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
          >
            Go to Ticket Page
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}