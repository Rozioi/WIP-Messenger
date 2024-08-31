import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/authContext';
import '../assets/styles/pageStories.css'; // Importing the styles

const PageStories = () => {
    const { storiesId } = useParams();
    const [story, setStory] = useState(null);
    const [backgroundImage, setBackgroundImage] = useState(null);
    const { api } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        api.get(`/stories/${storiesId}`)
            .then(response => {
                const storyData = response.data[0];
                setStory(storyData);
                setBackgroundImage(storyData.file); // Установите начальный фоновый образ
            })
            .catch(error => console.error(error.message));
    }, [storiesId, api]);

    const goBack = () => {
        navigate(-1); // Navigate back to the previous page
    };

    const handleImageError = (e) => {
        console.log("Error loading image");
        if (story?.file_global) {
            console.log(`Switching to backup image: ${story.file_global}`);
            setBackgroundImage(story.file_global);  // Заменяем фоновое изображение на резервное
        }
    };

    return (
        <div className="story-container">
            {story ? (
                <div className="story-content" style={{ backgroundImage: `url(${backgroundImage})` }}>
                    <div className="story-text">
                        <h1 className="story-title">{story.title}</h1>
                        <p className="story-description">{story.description}</p>
                    </div>
                    <button className="back-button" onClick={goBack}>Go Back</button>

                    {/* Скрытое изображение для проверки загрузки */}
                    <img
                        src={story.file}
                        alt="background-check"
                        onError={handleImageError}
                        style={{ display: 'none' }}
                    />
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
};

export default PageStories;
