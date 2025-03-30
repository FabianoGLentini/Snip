import React from "react";

type PdfUploadModalProps = {
  onClose: () => void;
};

const PdfUploadModal: React.FC<PdfUploadModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Upload a PDF</h2>
        <input type="file" accept="application/pdf" className="mb-4" />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Close
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default PdfUploadModal;
