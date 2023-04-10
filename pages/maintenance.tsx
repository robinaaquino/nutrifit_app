export default function maintenance() {
  return (
    <>
      <div className="absolute flex items-center justify-center h-screen w-screen bg-purple-600 text-black">
        <div className="flex flex-col items-center justify-center max-w-2xl">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-20 h-20 text-yellow-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <h1 className="mb-3 text-3xl font-bold text-center text-purple-100">
            We’ll be back soon!
          </h1>
          <p className="text-center text-gray-100">
            Sorry for the inconvenience. We’re performing some maintenance at
            the moment. we’ll be back up shortly!
          </p>
        </div>
      </div>
    </>
  );
}
