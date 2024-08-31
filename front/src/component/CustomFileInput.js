import React, { useState } from 'react';
import { IoCloudUploadOutline, IoCloudUploadSharp } from 'react-icons/io5';
import '../assets/styles/CustomFileInput.css'; // Импортируем стили

const CustomFileInput = ({ onFileSelect,uploadProgress}) => {
    const [fileName, setFileName] = useState('');
    const [selectedFile, setSelectedFile] = useState(false);


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            onFileSelect(file);
            setSelectedFile(true);
        }
    };

    return (
        <div className="custom-file-input">
            <label htmlFor="file-upload" className="file-upload-label">
                <div className="upload-icon">
                    {selectedFile ? <IoCloudUploadSharp size={24} /> :  <IoCloudUploadOutline size={24}/>}
                </div>
                {uploadProgress > 0 && (
                    <div className="upload-progress">
                        <div style={{ width: `${uploadProgress}%` }} className="progress-bar"></div>
                        <span>{uploadProgress}%</span>
                    </div>
                )}
            </label>
            <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-upload-input"
            />

        </div>
    );
};

export default CustomFileInput;
