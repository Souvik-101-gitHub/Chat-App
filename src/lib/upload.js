const upload = async (file) => {

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "chat-app"); // ✅ your preset name

  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dqwkynjlt/image/upload", // ✅ your cloud name
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!data.secure_url) {
      console.error("Cloudinary Error:", data);
      throw new Error("Image upload failed");
    }

    return data.secure_url;

  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

export default upload;
