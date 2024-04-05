/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

const Account = () => {
  const location = useLocation();
  const { userEmail } = location.state || {};
  const [postCount, setPostCount] = useState(0);
  const [username, setUsername] = useState('');
  const [usn, setUsn] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState(() => {
    const storedProfilePic = localStorage.getItem('profilePic');
    return storedProfilePic ? storedProfilePic : 'default.avif';
  });
  const token = localStorage.getItem('token');
  const userData = token ? jwtDecode(token) : null;

  const handleFileChange = (e) => {
    setProfilePicUrl(e.target.files[0]);
  };

  useEffect(() => {
    if (userEmail) {
      axios.get('http://localhost:5000/getUserDetails', {
        headers: {
          'Authorization': `Bearer ${userEmail}`
        }
      })
        .then(response => {
          setProfilePicUrl(response.data.profilePicUrl);
          setUsername(response.data.username);
          setUsn(response.data.usn);
        })
        .catch(error => {
          console.error('Error fetching user details:', error);
        });

        axios
        .get('http://localhost:5000/getposts')
        .then((response) => {
          const userPosts = response.data.filter((post) => post.author === userEmail);
          setPostCount(userPosts.length);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [userEmail]);

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('file', profilePicUrl);
    formData.append('usn', usn);
    axios
      .post('http://localhost:5000/uploadProfilePic', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const newProfilePic = response.data.profilePicUrl;
        setProfilePicUrl(newProfilePic);
        localStorage.setItem('profilePic', newProfilePic);
        toast.success('Profile picture updated successfully!');

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleRemovePhoto = () => {
    document.getElementById('confirm_remove_modal').showModal();
  };

  const confirmRemovePhoto = () => {
    axios
      .post('http://localhost:5000/removeProfilePhoto', { usn: usn }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setProfilePicUrl('default.avif');
        localStorage.removeItem('profilePic');
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  };


  return (
    <div className="flex justify-center items-center h-screen flex-col gap-3">
      <div className="p-4 relative">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={(profilePicUrl && `../backend/profilePic/${profilePicUrl}`) || '../backend/profilePic/default.avif'}
              alt="Upload"
            />
          </div>
        </div>
        <div className="text-center mt-4">
          <h1 className="text-xl font-bold text-white">{username}</h1>
          <p className="text-gray">{userEmail}</p>
        </div>
      </div>

      {userEmail && userData && userEmail === userData.email && (
        <button className="btn" onClick={() => document.getElementById('my_modal_3').showModal()}>
          Edit Profile
        </button>
      )}



      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg mb-4">Edit Profile</h3>
          <div className="space-y-4">
            {profilePicUrl !== 'default.avif' && (
              <button
                className="btn btn-error mx-5 text-white"
                onClick={() => {
                  handleRemovePhoto();
                  document.getElementById('my_modal_3').close();
                }}
              >
                Remove Photo
              </button>
            )}
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered file-input-accent w-full max-w-xs mx-5"
              onChange={handleFileChange}
            />
            <button className="btn btn-accent" onClick={handleUpload}>
              Upload
            </button>
          </div>
        </div>
      </dialog>

      <dialog id="confirm_remove_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Confirm Remove Photo</h3>
          <div className="space-y-4">
            <p>Are you sure you want to remove your profile photo?</p>
            <div className="flex justify-end space-x-3">
              <button className="btn" onClick={() => document.getElementById('confirm_remove_modal').close()}>
                Cancel
              </button>
              <button className="btn btn-error" onClick={() => {
                confirmRemovePhoto();
                document.getElementById('confirm_remove_modal').close();
              }}>
                Remove
              </button>
            </div>
          </div>
        </div>
      </dialog>

      <div className="stats shadow">
        <div className="stat place-items-center">
          <div className="stat-title">Threads</div>
          <div className="stat-value">{postCount}</div>
        </div>

        <div className="stat place-items-center">
          <div className="stat-title">Likes</div>
          <div className="stat-value text-secondary">Count</div>
        </div>

        <div className="stat place-items-center">
          <div className="stat-title">Liked</div>
          <div className="stat-value">Count</div>
        </div>
      </div>
    </div>
  );
}

export default Account;
