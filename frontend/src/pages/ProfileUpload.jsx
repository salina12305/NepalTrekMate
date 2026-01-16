
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Upload, File, Trash2 } from 'lucide-react';
import axios from 'axios';

export default function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate(); 
 
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDelete = () => {
    setSelectedFile(null);
  };

  const handleSave = async () => {
    const userId = localStorage.getItem('tempUserId'); 
    
    if (!userId) {
        alert("User session not found. Please register again.");
        return;
    }
    if (!selectedFile) {
        alert("Please select a file first.");
        return;
    }

    const formData = new FormData();
    formData.append('profileImage', selectedFile);
    formData.append('userId', userId);

    try {
        const res = await axios.post("http://localhost:3000/api/user/upload-profile", formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (res.status === 200 || res.status === 201) {
            alert("Upload Successful!");
            
            // 3. Navigation Logic
            localStorage.removeItem('tempUserId');
            navigate('/login');
        }
    } catch (err) {
        console.error("Upload Error Details:", err.response?.data);
        alert(err.response?.data?.message || "Internal Server Error.");
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <div
          className={`border-4 border-dashed rounded-xl p-16 text-center transition-colors ${isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-blue-300 bg-blue-50/30'
            }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="fileInput"
            className="hidden"
            onChange={handleFileSelect}
         />
          <label
            htmlFor="fileInput"
            className="cursor-pointer flex flex-col items-center">
            <div className="bg-blue-600 text-white rounded-full p-6 mb-4">
              <Upload size={48} />
            </div>
            <p className="text-xl font-semibold text-gray-800"> Browse Files to upload </p>
          </label>
        </div>

        <div className="mt-6 bg-blue-50 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <File className="text-blue-600" size={24} />
            <span className="text-gray-700 font-medium">
              {selectedFile ? selectedFile.name : 'No selected File'}
            </span>
          </div>
          {selectedFile && (
            <button
              onClick={handleDelete}
              className="text-gray-600 hover:text-red-600 transition-colors"
              aria-label="Delete file" >

              <Trash2 size={20} />
            </button>
          )}
        </div>

        <div className="mt-6 flex gap-4 justify-end">
          <button
            onClick={handleCancel}
            className="px-6 py-2 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors" >

            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedFile}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${selectedFile
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}