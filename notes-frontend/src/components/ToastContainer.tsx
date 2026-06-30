import { Toast } from "./Toast";

export const ToastContainer = ({ toasts }: any) => {
  return (
    <div className="fixed top-6 right-6 z-[200] flex flex-col gap-3">
      {toasts.map((t: any) => (
        <Toast key={t.id} message={t.message} type={t.type} />
      ))}
    </div>
  );
};