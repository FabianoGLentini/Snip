import React, { useState } from 'react';

type PdfUploadModalProps = {
  onClose: () => void;
};

const PdfUploadModal: React.FC<PdfUploadModalProps> = ({ onClose }) => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      alert('Please select a valid PDF file.');
      setPdfFile(null);
    }
  };

  const handleSubmit = () => {
    if (!pdfFile) {
      alert('Please select a PDF file before submitting.');
      return;
    }

    console.log('Submitted file:', pdfFile.name);

    // Optional: send file to server here
    onClose(); // Close modal
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-lg font-semibold mb-4">Upload PDF</h2>

        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="mb-3"
        />

        {pdfFile && (
          <p className="text-sm text-green-600 mb-2">Selected: {pdfFile.name}</p>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default PdfUploadModal;
