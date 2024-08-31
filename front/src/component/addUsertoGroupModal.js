import React, { useEffect, useState } from 'react';
import '../assets/styles/modalGroup.css';
import { useAuth } from "../utils/authContext";

const AddUserToGroupModal = ({ isOpen, onClose, chatId }) => {
    const { api, user } = useAuth();
    const [groupName, setGroupName] = useState('');
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [fileId, setFileId] = useState(null);
    const [friends, setFriends] = useState([]);
    const [existingGroupMembers, setExistingGroupMembers] = useState([]);

    // Fetch group details, friends list, and existing group members when modal opens
    useEffect(() => {
        if (isOpen) {
            // Fetch group details
            api.get(`/chats/${chatId}`)
                .then(response => {
                    setGroupName(response.data.name);
                    setFileId(response.data.picture);
                })
                .catch(error => console.error(error));

            // Fetch all friends
            api.get(`/user/friend-list/${user.user_id}`)
                .then(response => setFriends(response.data))
                .catch(error => console.error(error));

            // Fetch existing group members
            api.get(`/chats/${chatId}/members`)
                .then(response => setExistingGroupMembers(response.data))
                .catch(error => console.error(error));
        }
    }, [isOpen, api, user.user_id, chatId]);

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            console.error('No file selected');
            return;
        }

        const formData = new FormData();
        formData.append('profile_picture', file);

        try {
            const response = await api.post('/upload/picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setFileId(response.data.message);
        } catch (error) {
            console.error('Upload error:', error.response ? error.response.data : error.message);
        }
    };

    const handleFriendSelect = (friendId) => {
        setSelectedFriends(prevState =>
            prevState.includes(friendId)
                ? prevState.filter(id => id !== friendId)
                : [...prevState, friendId]
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Filter out friends who are already group members
        const existingUserIds = new Set(existingGroupMembers.map(member => member.user_id));
        const newFriendsToAdd = selectedFriends.filter(friendId => !existingUserIds.has(friendId));

        try {
            // Update group details
            const response = await api.post('/chats/update-group', {
                chatId, // ID of the chat group
                groupName,
                userIds: newFriendsToAdd, // Array of new friend IDs
                picture: fileId ? `${fileId}` : null
            });

            if (response.status === 200) {
                alert('Group updated successfully!');
                onClose(); // Close the modal after successful submission
            } else {
                alert('Failed to update the group.');
            }
        } catch (error) {
            console.error('Error updating the group:', error);
            alert('An error occurred while trying to update the group.');
        }
    };

    return (
        <div className={`modal ${isOpen ? 'open' : ''}`}>
            {isOpen && (
                <div className="modal-content">
                    <span className="close-button" onClick={onClose}>&times;</span>
                    <h2>Edit Group</h2>
                    <img
                        src={fileId ? `${fileId}` : 'default-image-url.jpg'}
                        alt={'group picture'}
                        style={{ borderRadius: '50%', justifyContent: 'center', width: "150px", height: '150px' }}
                    />
                    <p style={{ color: 'black' }}>{groupName}</p>
                    <form className={'form-group-parents'} onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Group Name:</label>
                            <input
                                type="text"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Group Image:</label>
                            <input type="file" onChange={handleFileSelect} accept="image/*" />
                        </div>
                        <div className="form-group">
                            <label>Select Friends:</label>
                            <div className="friend-list">
                                {friends.map(friend => {
                                    const isMember = existingGroupMembers.some(member => member.user_id === friend.user_id);
                                    return (
                                        <div key={friend.user_id} className="friend-item">
                                            <input
                                                type="checkbox"
                                                id={`friend-${friend.user_id}`}
                                                checked={selectedFriends.includes(friend.user_id)}
                                                onChange={() => handleFriendSelect(friend.user_id)}
                                                disabled={isMember} // Disable checkbox if the friend is already a member
                                            />
                                            <img src={friend.profile_picture} style={{ width: '25px', height: '25px' }} alt={friend.username} />
                                            <label htmlFor={`friend-${friend.user_id}`}>
                                                {friend.username} {isMember && '(Already in group)'}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <button type="submit">Update Group</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AddUserToGroupModal;
