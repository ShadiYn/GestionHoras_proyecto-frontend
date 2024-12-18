import { useEffect, useState } from "react";
import { userDetails, updateUserDetails, updatePassword } from "../api/api";
import { useNavigate } from "react-router-dom";
import "../app/Profile.css";
import Modal from "../components/Modal";

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalPassword, setModalPassword] = useState("");
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("authToken");
        console.log("Token:", token);
        if (token) {
          const userData = await userDetails(token);
          setUserInfo(userData);
          setFormData({
            ...userData,
            flexible: userData.flexible === "on" ? true : userData.flexible,
          });
        } else {
          console.log("No se encontro el token");
        }
      } catch (error) {
        console.error("Error al obtener los detalles del usuario:", error);
      }
    };

    fetchUserDetails();
  }, []);

  //TODO: Convertir en spinner.
  if (!userInfo) return <div>Loading...</div>;

  const handleChange = (e) => {
    const { name } = e.target;

    if (name === "flexible") {
      setFormData({
        ...formData,
        flexible: true, // Selecciona Flexible
      });
    } else if (name === "normal") {
      setFormData({
        ...formData,
        flexible: false, // Deselecciona Flexible
      });
    } else {
      setFormData({
        ...formData,
        [name]: e.target.value,
      });
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value, // Actualiza el valor del campo correspondiente
    }));
  };

  const handlePasswordSubmit = async () => {
    if (passwordData.password !== passwordData.confirmPassword) {
      setModalMessage("New passwords aren't simillar");
      return;
    }

    try {
      const payload = {
        username: userInfo.username, // Asegúrate de incluir el username
        password: passwordData.password,
      };

      const response = await updatePassword(payload); // Llamada al backend
      if (response) {
        setModalPassword(false); // Cierra el modal
        setModalMessage("Password updated correctly"); // Mensaje de éxito
      } else {
        setModalMessage("Error updating passowrd");
      }
    } catch (error) {
      alert("Couldn't update password, try later");
      console.error(error);
    }
  };

  const handleEdit = async () => {
    try {
      const payload = {
        ...formData,
        username: formData.username || userInfo.username, // Asegúrate de incluir el username
        password: formData.password || userInfo.password, // Asegúrate de incluir la password si es necesario
      };

      const response = await updateUserDetails(payload); // Envía los datos actualizados al backend
      setUserInfo({ ...userInfo, ...formData }); // Actualiza el estado local con los datos editados
      setIsEditing(false); // Sal del modo de edición
      setModalTitle("Success");
      setModalMessage("User updated succesfully.");
      setModal(true);
    } catch (error) {
      setModalTitle("Error", error);
      setModalMessage("Error updating the user.");
      setModal(true);
    }
  };

  const handleHomeButton = () => {
    navigate("/home");
  };

  const handleCalendarButton = () => {
    navigate("/calendar");
  };

  const handleCancel = () => {
    setFormData(userInfo); // Restablece los valores del formulario
    setIsEditing(false); // Sal del modo de edición
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-links">
          <button className="nav-btn" onClick={handleHomeButton}>
            Home
          </button>
          <button className="nav-btn" onClick={handleCalendarButton}>
            Calendar
          </button>
        </div>
        <p className="welcome">Welcome, {userInfo.name}</p>
      </nav>
    <div className="home-container">
      
      <div className="user-info-container">
        <div>
          <label>Name:</label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          ) : (
            userInfo.name
          )}
        </div>
        <div>
          <label>Username:</label>
          {isEditing ? (
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          ) : (
            userInfo.username
          )}
        </div>
        <div>
          <label>Last name:</label>
          {isEditing ? (
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          ) : (
            userInfo.lastName
          )}
        </div>
        <div>
          <label>Salary:</label>
          {isEditing ? (
            <input
              type="number"
              name="eurosPerHour"
              value={formData.eurosPerHour}
              onChange={handleChange}
            />
          ) : (
            `${userInfo.eurosPerHour} €`
          )}
        </div>
        <div>
          <label>Extra salary:</label>
          {isEditing ? (
            <input
              type="number"
              name="eurosPerExtraHours"
              value={formData.eurosPerExtraHours}
              onChange={handleChange}
            />
          ) : (
            `${userInfo.eurosPerExtraHours} €`
          )}
        </div>
        <div className="schedule-container">
          <label>
            Flexible
            <input
              type="checkbox"
              name="flexible"
              checked={formData.flexible}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </label>
          <label>
            Normal
            <input
              type="checkbox"
              name="normal"
              checked={!formData.flexible}
              onChange={(e) =>
                setFormData({ ...formData, flexible: !e.target.checked })
              }
              disabled={!isEditing}
            />
          </label>
        </div>
        <div>
          <label>Required total **** hours:</label>
          {isEditing ? (
            <input
              type="number"
              name="requiredHours"
              value={formData.requiredHours}
              onChange={handleChange}
            />
          ) : (
            `${userInfo.requiredHours} h`
          )}
        </div>
        {isEditing ? (
          <div>
            <button onClick={handleEdit}>Save Changes</button>
            <button onClick={handleCancel} className="cancel-button">
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)} className="button-group">
            Edit Profile
          </button>
        )}
        <Modal
          show={modal}
          title={modalTitle}
          message={modalMessage}
          onClose={() => setModal(false)}
          onConfirm={() => setModal(false)} // El mismo comportamiento para confirmar
        />

          <div>
            <button onClick={() => setModalPassword(true)}>
              Change Password
            </button>
            <Modal
              show={modalPassword}
              title="Change Password"
              onClose={() => setModalPassword(false)}
              onConfirm={handlePasswordSubmit}
            >
              <form>
                <div>
                  <label>New Password:</label>
                  <input
                    type="password"
                    name="password"
                    value={passwordData.password}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div>
                  <label>Confirm New Password:</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
              </form>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
