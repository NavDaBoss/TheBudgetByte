import { useState } from "react";
import FileUpload from "./FileUpload"; // Adjust the path if necessary

// for use in another file
{/* <FileUploadContainer userId={currentUser.uid} />
    ) : (
    <p>Sign In to upload</p>  // Handle the case where currentUser is not yet available
    )} */}

interface FileUploadContainerProps {
  userId: string; // The ID of the user uploading the file
}

const FileUploadContainer: React.FC<FileUploadContainerProps> = ({ userId }) => {
  const [showUpload, setShowUpload] = useState(false); // State to track if the upload form should be shown

  const handleButtonClick = () => {
    setShowUpload(true); // Show the upload form when button is clicked
  };

  const closePopup = () => {
    setShowUpload(false);
  };

  return (
    <div>
      {!showUpload && (
        <button onClick={handleButtonClick}>Upload an Reciept</button>
      )}
      
      {showUpload && (
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%" }}>
          {/* Show the FileUpload component */}
          <FileUpload userId={userId} closePopup={closePopup}/>
        </div>
      )}
    </div>
  );
};

export default FileUploadContainer;
