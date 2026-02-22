
import React, { useContext, useEffect, useState } from "react";
import "./ProfileUpdate.css";
import assets from "../../assets/assets";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import upload from "../../lib/upload";
import { AppContext } from "../../context/AppContext";

function ProfileUpdate() {
  const navigate = useNavigate();
  const { setUserData } = useContext(AppContext);

  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Load user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/");
        return;
      }

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.name || "");
        setBio(data.bio || "");
        setPrevImage(data.avatar || "");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // 🔹 Submit handler
  const handleSubmit = async (event) => {
    event.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    if (!prevImage && !image) {
      toast.error("Upload profile picture");
      return;
    }

    try {
      setLoading(true);

      const docRef = doc(db, "users", user.uid);

      let updateData = {
        name,
        bio,
      };

      if (image) {
        const imgUrl = await upload(image); // Cloudinary upload
        updateData.avatar = imgUrl;
      }

      await updateDoc(docRef, updateData);

      const snap = await getDoc(docRef);
      setUserData({ ...snap.data(), id: user.uid });


      toast.success("Profile Updated Successfully");
      navigate("/chat");

    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile">
      <div className="profile-container">
        <form onSubmit={handleSubmit}>
          <h3>Profile Details</h3>

          <label htmlFor="avatar">
            <input
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
              onChange={(e) => {
                const file = e.target.files[0];

                if (file && file.size > 2 * 1024 * 1024) {
                  toast.error("Image must be less than 2MB");
                  return;
                }

                setImage(file);
              }}
            />

            <img src={ image ? URL.createObjectURL(image) : prevImage ? prevImage : assets.avatar_icon} alt="avatar" />
            Upload profile image
          </label>

          <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />

          <textarea placeholder="Write profile bio" value={bio} onChange={(e) => setBio(e.target.value)} required />

          <button type="submit" disabled={loading}> {loading ? "Saving..." : "Save"} </button>
        </form>

        <img className="profile-pic" src={ image ? URL.createObjectURL(image) : prevImage ? prevImage : assets.logo_icon } alt="profile" />
      </div>
    </div>
  );
}

export default ProfileUpdate;
