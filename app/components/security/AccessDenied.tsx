type AccessDeniedProps = {
  title?: string;
  message?: string;
};

export default function AccessDenied({
  title = "Access Denied",
  message = "You do not have permission to access this module.",
}: AccessDeniedProps) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="max-w-xl rounded-xl border border-red-200 bg-red-50 p-8 text-center shadow">
        <h2 className="text-3xl font-bold text-red-700">
          {title}
        </h2>

        <p className="mt-4 text-gray-700">
          {message}
        </p>

        <div className="mt-6 rounded-lg bg-white p-4">
          <p className="text-sm text-gray-500">
            If you believe this is incorrect, please contact your GPA
            administrator or factory system administrator.
          </p>
        </div>
      </div>
    </div>
  );
}