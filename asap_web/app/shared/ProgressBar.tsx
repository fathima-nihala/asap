export default function ProgressBar() {
    return (
      <div className="flex items-center gap-2 w-full mt-8">
        {/* Progress Bar */}
        <div className="relative w-full h-2 bg-gray-200 rounded-full">
          <div
            className="absolute h-2 bg-yellow-400 rounded-full"
            style={{ width: "60%" }} 
          ></div>
        </div>
        {/* Percentage Text */}
        <span className="text-gray-600 font-semibold text-sm">60%</span>
      </div>
    );
  }
  