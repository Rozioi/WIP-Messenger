import React, { useEffect, useState } from 'react';
import '../assets/styles/MyStoriesPage.css';
import { useAuth } from "../utils/authContext";
import { useNavigate } from "react-router-dom";

const MyStoriesPage = () => {
    const [stories, setStories] = useState([]);
    const navigate = useNavigate();
    const { api, user } = useAuth();

    useEffect(() => {
        api.get(`/stories/stories/${user.user_id}`)
            .then(response => setStories(response.data))
            .catch(error => console.error(error.message));
    }, [api, user.user_id]);

    const openStory = (storyId) => {
        navigate(`/stories/${storyId}`);
    };

    const handleImageError = (e, story) => {
        console.log(`err`);
        if (story.file_global && e.target.src !== story.file_global) {
            console.log(`Switching to backup image: ${story.file_global}`); // Лог для проверки
            e.target.src = story.file_global;  // Заменяем изображение на резервное
        }
    };

    return (
        <div className="my-stories-container">
            <h1 style={{ color: 'white', textAlign: 'center' }}>My Stories</h1>
            <div className="stories-list">
                {stories.map((story) => (
                    <div key={story.id} className="story-card" onClick={() => openStory(story.id)}>
                        <img
                            src={story.file}
                            alt={story.title}
                            className="story-image"
                            onError={(e) => handleImageError(e, story)}  // Добавляем обработчик ошибки
                        />
                        <div className="story-content">
                            <h2 className="story-title">{story.title}</h2>
                            <p className="story-description">{story.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyStoriesPage;
