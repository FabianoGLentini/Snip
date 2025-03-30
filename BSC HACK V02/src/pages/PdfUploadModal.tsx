import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, FormEvent, ChangeEvent } from 'react';

type PdfUploadModalProps = {
  onClose: () => void;
};

const PdfUploadModal: React.FC<PdfUploadModalProps> = ({ onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      alert('Please select a PDF file');
      return;
    }

    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('short[pdf]', file);

    try {
      const response = await fetch('http://localhost:3000/docs', {
        method: 'POST',
        body: formData,
        credentials: "include",
        headers: {
          'Content-type': 'application/pdf'
          // 'Content-Type' will be automatically set to 'multipart/form-data' with boundary
        },
        // headers are not needed when sending FormData,
        // the browser will set the correct Content-Type with boundary
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Upload successful:', result);
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('File upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Upload a PDF</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="pdf" style={{ display: 'block', marginBottom: '0.5rem' }}>
          PDF File
        </label>
        <input
          type="file"
          id="pdf"
          name="short[pdf]"
          accept=".pdf"
          onChange={handleFileChange}
        />
      </div>
      
      <button type="submit" disabled={isUploading || !file}>
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
      </div>
    </div>
  );
};

export default PdfUploadModal;