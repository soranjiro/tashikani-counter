import React, { useState, useEffect, useContext } from 'react';

import Navbar from '../components/Navbar';
import { TeamContext } from '../context/TeamContext';
import { registerUser, getUsers, deleteUser } from '../api';

import '../css/RegisterUser.css';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState<string[]>([]);
  const { teamName } = useContext(TeamContext);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const userList = await getUsers(teamName);
      setUsers(userList || []);
    } catch (error) {
      console.error('ユーザーリストの取得に失敗しました:', error);
    }
  };

  const handleRegister = async () => {
    try {
      if (!username) {
        throw new Error('ユーザー名を入力してください');
      }
      if (users.includes(username)) {
        throw new Error('このユーザー名はすでに登録されています');
      }
      await registerUser(username, teamName);
      alert('ユーザー登録が完了しました');
      setUsers([...users, username]);
      setUsername('');
    } catch (error) {
      if (error instanceof Error) {
        alert(`ユーザー登録に失敗しました: ${error.message}`);
      } else {
        alert('ユーザー登録に失敗しました: 不明なエラーが発生しました');
      }
    }
  };

  const handleDelete = async (userToDelete: string, index: number) => {
    const confirmDelete = window.confirm(`${userToDelete} を削除しますか？`);
    if (confirmDelete) {
      try {
        await deleteUser(users, index, teamName);
        setUsers(users.filter(user => user !== userToDelete));
        alert(`${userToDelete} を削除しました`);
      } catch (error) {
        console.error('ユーザーの削除に失敗しました:', error);
        alert('ユーザーの削除に失敗しました');
      }
    }
  };

  return (
    <div className="container">
      <Navbar />
      <h1>ユーザー登録</h1>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="ユーザー名"
      />
      <button type="button" onClick={handleRegister}>登録</button>
      <h2>既存のユーザー</h2>
      <div className="user-list">
        {users.map((user, index) => (
          <div key={index} className="user-card" onClick={() => handleDelete(user, index)}>
            {user}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Register;
