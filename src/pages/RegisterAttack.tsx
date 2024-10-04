import React, { useEffect, useState, useContext } from 'react';

import Navbar from '../components/Navbar';
import { TeamContext } from '../context/TeamContext';
import { registerAttack, getUsers } from '../api';

const RegisterAttack: React.FC = () => {
  const [attacker, setAttacker] = useState('');
  const [victim, setVictim] = useState('');
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
      setUsers([]); // エラーが発生した場合も空の配列を設定
    }
  };

  const handleRegister = async () => {
    try {
      if (!attacker || !victim) {
        throw new Error('全てのフィールドを入力してください');
      }
      await registerAttack(attacker, victim, teamName);
      alert('攻撃が登録されました');
      setAttacker('');
      setVictim('');
    } catch (error) {
      if (error instanceof Error) {
        alert(`攻撃の登録に失敗しました: ${error.message}`);
      } else {
        alert('攻撃の登録に失敗しました: 不明なエラーが発生しました');
      }
    }
  };

  return (
    <div className="container">
      <Navbar />
      <h1>攻撃登録</h1>
      <form>
        <label htmlFor="attacker">攻撃者:</label>
        <select id="attacker" value={attacker} onChange={(e) => setAttacker(e.target.value)}>
          <option value="">攻撃者を選択</option>
          {users.map((user, index) => (
            <option key={index} value={user}>{user}</option>
          ))}
        </select>
        <label htmlFor="victim">被攻撃者:</label>
        <select id="victim" value={victim} onChange={(e) => setVictim(e.target.value)}>
          <option value="">被攻撃者を選択</option>
          {users.map((user, index) => (
            <option key={index} value={user}>{user}</option>
          ))}
        </select>
        <button type="button" onClick={handleRegister}>登録</button>
      </form>
    </div>
  );
};

export default RegisterAttack;
