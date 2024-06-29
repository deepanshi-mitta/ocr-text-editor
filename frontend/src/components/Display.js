// In src/components/Display.js
import React, { useEffect, useState } from 'react';
import api from '../api';

const Display = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            const response = await api.get('/images', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setImages(response.data);
        };
        fetchImages();
    }, []);

    return (
        <div>
            {images.map((image) => (
                <div key={image._id}>
                    <img src={`data:image/jpeg;base64,${image.image}`} alt="uploaded" />
                    <p>{image.text}</p>
                    <p><strong>Bold Words:</strong> {image.boldWords.join(', ')}</p>
                </div>
            ))}
        </div>
    );
};

export default Display;
