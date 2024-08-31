import React, { useState } from 'react';
import '../assets/styles/CreatingPageStories.css';
import {useAuth} from "../utils/authContext";

const CreatingPageStories = () => {
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [fileId, setFileId] = useState('');
    const [fileIdGlobal, setFileIdGlobal] = useState('');

    const [statusPicture, setStatusPicture] = useState('');
    const {api , user} = useAuth();
    const handleFileSelect = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('profile_picture', file);
        try {
            const response = await api.post('/upload/picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setFileId(response.data.file);
            setFileIdGlobal(response.data.fileGlobal);
            setStatusPicture('success');
        } catch (error) {
            console.error('Upload error:', error.response ? error.response.data : error.message);
        }
    };

    const handleTitleChange = (e) => {
        if (e.target.value.length <= 50) {
            setTitle(e.target.value);
        }
    };

    const handleDescriptionChange = (e) => {
        if (e.target.value.length <= 250) {
            setDescription(e.target.value);
        }
    };

    const handleSumbit = (event) => {
        event.preventDefault();
        try{
            api.post('/stories/new-stories',{authorId: user.user_id,title: title, description: description,file: fileId, fileGlobal: fileIdGlobal})
                .then(response => console.log(response.data))
                .catch(error => console.error(error.message))
        } catch (e) {
            console.error('Send error:', e.response ? e.response.data : e.message);
        }
    }

    return (
        <div className="creating-page-stories-container">
            <h1>Create a New Story</h1>
            <p>{statusPicture}</p>
            <div className="creating-page-upload-section">
                <label htmlFor="image-upload" className="upload-label">
                    {image ? (
                        <img src={image} alt="Uploaded" className="creating-page-uploaded-image"/>
                    ) : (
                        <div className="creating-page-upload-placeholder">
                            <span>Upload a Photo</span>
                        </div>
                    )}
                </label>
                <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="creating-page-file-input"
                />
            </div>
            <div className="creating-page-description-section">
                <input
                    placeholder="Add a title..."
                    value={title}
                    onChange={handleTitleChange}
                    className="creating-page-description-input"
                />
            </div>
            <div className="creating-page-description-section">
                <textarea
                    placeholder="Add a description..."
                    value={description}
                    onChange={handleDescriptionChange}
                    className="creating-page-description-input"
                />
            </div>
            <button onClick={(e) => handleSumbit(e)} className="creating-page-submit-button"
                    disabled={!description}>
                Submit Story
            </button>
        </div>
    );
};

export default CreatingPageStories;
