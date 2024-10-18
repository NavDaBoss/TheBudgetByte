// components/FileUpload.tsx
import { useState } from "react";
import { storage, db } from "../firebase/firebaseConfig"; // Adjust the path if necessary
import { ref, uploadBytes } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

interface FileUploadProps {
  userId: string; // The ID of the user uploading the file
  closePopup: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ userId, closePopup }) => {
  const [file, setFile] = useState<File | null>(null); // State for the selected file
  const [preview, setPreview] = useState<string | null>(null); // State for image preview

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]; // Get the selected file
    if (selectedFile) {
      // Check if the selected file is an image
      if (selectedFile.type.startsWith("image/")) {
        setFile(selectedFile);
        // Create a preview URL for the image
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
          setPreview(fileReader.result as string);
        };
        fileReader.readAsDataURL(selectedFile);
      } else {
        alert("Please select an image file.");
        setFile(null);
        setPreview(null);
      }
    }
  };


  // fix this stuff
  const handleUpload = async () => {
    if (!file) return;

    // Create a storage reference
    const storageRef = ref(storage, `userReciepts/${userId}/${file.name}`);

    try {
      // Upload the file
      await uploadBytes(storageRef, file);

      // Store file info in Firestore
      await setDoc(doc(db, "users", userId), {
        fileName: file.name,
        fileUrl: `https://firebasestorage.googleapis.com/v0/b/${storageRef.bucket}/o/${encodeURIComponent(file.name)}?alt=media`,
      }, { merge: true }); // Use merge to keep existing user data

      alert("File uploaded successfully!");
      setFile(null); // Reset the file after upload
      setPreview(null); // Reset the preview
      closePopup();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("File upload failed.");
    }
  };

  const handleCancel = () => {
    setFile(null);
    setPreview(null);
    closePopup();
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Image Preview" style={{ width: "200px", height: "auto", marginTop: "10px" }} />}
      <button onClick={handleUpload} disabled={!file}>Upload Image</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
};

export default FileUpload;
