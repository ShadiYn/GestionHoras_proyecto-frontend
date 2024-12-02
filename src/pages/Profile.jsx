import { useUserContext } from "../providers/UserProvider";

const Profile = () => {
  const { user } = useUserContext();
  return <div>hola, {user?.name} </div>;
};
export default Profile;
