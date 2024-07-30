import React from 'react';

interface UserListProps {
  users: { id: string; name: string }[];
}

const UserList: React.FC<UserListProps> = ({ users }) => (
  <ul>
    {users.map((user) => (
      <li key={user.id}>{user.name}</li>
    ))}
  </ul>
);

export default UserList;
