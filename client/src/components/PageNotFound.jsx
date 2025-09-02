import React from "react";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <h1 className="text-9xl font-bold text-gray-800">OOPS!</h1>
      <p className="text-xl font-medium text-gray-500 mt-4">
        404 - The page can't be found.
      </p>
      {/* <button
        onClick={() => window.location.href = '/'}
        className="mt-6 px-6 py-2 bg-orange-500 text-white rounded-md shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
      >
        Go to Homepage
      </button> */}
    </div>
  );
};

export default NotFoundPage;
