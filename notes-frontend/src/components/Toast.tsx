import { CheckCircle, XCircle } from "lucide-react";

type ToastProps = {
  message: string;
  type?: "success" | "error";
};

export const Toast = ({ message, type = "success" }: ToastProps) => {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg
      ${
        type === "success"
          ? "bg-green-50 border-green-200 text-green-700"
          : "bg-red-50 border-red-200 text-red-700"
      }`}
    >
      {type === "success" ? (
        <CheckCircle className="h-5 w-5" />
      ) : (
        <XCircle className="h-5 w-5" />
      )}
      <p className="text-sm">{message}</p>
    </div>
  );
};