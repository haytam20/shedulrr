'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-[#F7B84B]/10">
      <div className="rounded-xl shadow-2xl p-8 md:p-12 max-w-2xl w-full text-center bg-white border border-gray-200">
        <div className="text-9xl font-bold mb-4 text-[#2A3142]">
          404
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-[#2A3142]">
          Oops! Page Not Found
        </h1>
        <p className="text-lg mb-8 text-gray-600">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 font-medium rounded-lg transition duration-300 bg-[#F7B84B] hover:bg-[#F06449] text-white"
          >
            Go Back
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 font-medium rounded-lg transition duration-300 border border-[#5F9EE9] text-[#5F9EE9] hover:bg-[#5F9EE9]/10"
          >
            Return Home
          </button>
        </div>
        
        <div className="mt-10 pt-6 border-t border-gray-200">
          <p className="text-gray-500">
            Need help? <Link href="/contact" className="text-[#F7B84B] hover:underline">Contact us</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;