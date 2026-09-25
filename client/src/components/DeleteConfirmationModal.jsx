import { useState } from "react";
import { FaTriangleExclamation } from "react-icons/fa6";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  const [confirmationText, setConfirmationText] = useState("");

  const requiredText = "DELETE";
  const isValid = confirmationText === requiredText;

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!isValid) return;

    onConfirm();
    setConfirmationText("");
  };

  const handleClose = () => {
    setConfirmationText("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        {/* Icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
          <FaTriangleExclamation size={20} />
        </div>

        {/* Content */}
        <div className="mt-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Delete repository?
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            This action cannot be undone. The repository and its associated
            conversation data will be deleted.
          </p>
        </div>

        {/* Validation */}
        <div className="mt-5">
          <label className="text-sm font-medium text-gray-700">
            Type <span className="font-semibold text-red-600">DELETE</span> to
            confirm
          </label>

          <input
            type="text"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder="DELETE"
            className={`mt-2 w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition ${
              confirmationText.length > 0 && !isValid
                ? "border-red-400 focus:ring-2 focus:ring-red-100"
                : isValid
                  ? "border-green-500 focus:ring-2 focus:ring-green-100"
                  : "border-gray-300 focus:border-hunter-green-600 focus:ring-2 focus:ring-hunter-green-100"
            }`}
          />

          {/* Validation message */}
          {confirmationText.length > 0 && !isValid && (
            <p className="mt-1.5 text-xs text-red-500">
              Please type DELETE exactly as shown.
            </p>
          )}

          {isValid && (
            <p className="mt-1.5 text-xs text-green-600">
              Confirmation verified.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!isValid}
            onClick={handleConfirm}
            className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
