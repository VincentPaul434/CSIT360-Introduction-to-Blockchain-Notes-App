import { Button } from "./ui/button";

type ErrorAlertProps = {
  message: string;
  onRetry: () => void;
};

export const ErrorAlert = ({ message, onRetry }: ErrorAlertProps) => {
  return (
    <div className="mb-6 rounded-[0.4rem] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      <p>{message}</p>
      <Button type="button" variant="ghost" className="mt-2 px-0" onClick={onRetry}>
        Retry loading notes
      </Button>
    </div>
  );
};
