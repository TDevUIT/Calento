export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
        
        <p className="text-sm text-gray-600 font-medium">Loading Calento...</p>
      </div>
    </div>
  );
}
