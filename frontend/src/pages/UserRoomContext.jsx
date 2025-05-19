import { createContext, useState, useContext, useEffect } from 'react';

const UserRoomContext = createContext(null);

export const UserRoomProvider = ({ children }) => {
  const [userRoom, setUserRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user's current room from backend
    fetch('/api/user/room')
      .then(res => res.json())
      .then(data => {
        setUserRoom(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching user room:', err);
        setLoading(false);
      });
  }, []);

  return (
    <UserRoomContext.Provider value={{ userRoom, setUserRoom, loading }}>
      {children}
    </UserRoomContext.Provider>
  );
};

export const useUserRoom = () => useContext(UserRoomContext);