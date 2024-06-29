import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

const ImageUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [boldWords, setBoldWords] = useState([]);
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedFile) {
            setError('Please select a file');
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const response = await axios.post('http://localhost:3000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setUploadedImage(`data:image/jpeg;base64,${response.data.image}`);
            setExtractedText(response.data.text);
            setBoldWords(response.data.boldWords);
            setError('');
        } catch (err) {
            console.error('Error uploading image:', err);
            setError('Failed to upload image');
        }   
    };

    return (
        <div className='flex flex-col text-white justify-center items-center h-[100vh]'>
            <form onSubmit={handleSubmit} className='flex flex-col items-center'>
                <label className="cursor-pointer flex flex-col items-center">
                    <FontAwesomeIcon icon={faUpload} size="3x" />
                    <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                    <span className="mt-2 text-base leading-normal">Select an image</span>
                </label>
                <button type="submit" className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Upload
                </button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {uploadedImage && (
                <div className='text-white flex justify-center gap-[5vw] mt-[4vw] '>
                <div className='bg-gray-500 p-[3vw] rounded-3xl max-h-screen mb-[2vw]'>
                    <img className="max-h-screen" src={uploadedImage} alt="Uploaded" />
                </div>
                    <div className='w-[50vw] flex flex-col gap-[2vw]'>
                        <h1 className='text-[2.5vw]'>Extracted Text:</h1>
                        <p>{extractedText}</p>
                        <p className=''>Bold Words: {boldWords.join(', ')}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
