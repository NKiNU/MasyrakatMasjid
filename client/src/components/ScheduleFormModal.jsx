import ScheduleForm from "./ScheduleForm";

function ScheduleFormModal({ onClose, onAdd }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          ×
        </button>
        <ScheduleForm onAdd={onAdd} />
      </div>
    </div>
  );
}

export default ScheduleFormModal;
