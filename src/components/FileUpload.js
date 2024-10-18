// src/components/FileUpload.js
import React, { useState } from 'react';
import { storage, db } from '../firebase'; // Import storage and db
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';

const FileUpload = ({ taskId }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) return;

    setUploading(true);
    const fileRef = ref(storage, `tasks/${taskId}/${file.name}`); // Create a reference for the file in Firebase Storage
    try {
      await uploadBytes(fileRef, file); // Upload file to Firebase Storage
      const fileURL = await getDownloadURL(fileRef); // Get the file URL

      // Update the task document in Firestore with the file URL
      await updateDoc(doc(db, 'tasks', taskId), {
        attachment: fileURL,
      });

      setFileUrl(fileURL); // Store the file URL for displaying it in the UI
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('File upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-4">
      <input type="file" onChange={handleFileChange} />
      <button className="btn btn-primary mt-2" onClick={handleFileUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload File'}
      </button>
      {fileUrl && (
        <p>
          File uploaded: <a href={fileUrl} target="_blank" rel="noopener noreferrer">View File</a>
        </p>
      )}
    </div>
  );
};

export default FileUpload;
