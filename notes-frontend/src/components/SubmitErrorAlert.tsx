type SubmitErrorAlertProps = {
  message: string;
};

export const SubmitErrorAlert = ({ message }: SubmitErrorAlertProps) => {
  return (
    <div className="mb-6 rounded-[0.15rem] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {message}
    </div>
  );
};
