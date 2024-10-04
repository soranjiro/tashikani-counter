import React, { useEffect, useState, useContext } from 'react';

import { format, toZonedTime } from 'date-fns-tz';

import Navbar from '../components/Navbar';
import { AttackData } from '../api/types';
import { getAttacks, getUsers, deleteAttack } from '../api';
import { TeamContext } from '../context/TeamContext';

import '../css/ReceivedAttacks.css';

interface UserStats {
  username: string;
  attacksMade: number;
  attacksReceived: number;
}

const ReceivedAttacks: React.FC = () => {
  const [data, setData] = useState<AttackData[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [mostAttackedUsers, setMostAttackedUsers] = useState<string[]>([]);
  const { teamName } = useContext(TeamContext);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    calculateUserStats();
  }, [data, users]);

  const fetchData = async () => {
    try {
      const userList = await getUsers(teamName);
      if (userList) {
        setUsers(userList);
      } else {
        console.error('ユーザー情報の取得に失敗しました: userList is undefined');
      }

      const response = await getAttacks(teamName);
      if (response) {
        setData(response.data);
      } else {
        console.error('データの取得に失敗しました: response is undefined');
      }
    } catch (error) {
      console.error('データの取得に失敗しました:', error);
    }
  };

  const calculateUserStats = () => {
    const stats: UserStats[] = users.map(user => ({
      username: user,
      attacksMade: data.filter(attack => attack.attacker === user).length,
      attacksReceived: data.filter(attack => attack.victim === user).length,
    }));

    stats.sort((a, b) => {
      if (a.attacksReceived === b.attacksReceived) {
        return a.attacksMade - b.attacksMade;
      }
      return b.attacksReceived - a.attacksReceived;
    });

    setUserStats(stats);

    if (stats.length > 0 && stats[0].attacksReceived > 0) {
      const maxAttacksReceived = stats[0].attacksReceived;
      const minAttacksMade = Math.min(...stats.filter(user => user.attacksReceived === maxAttacksReceived).map(user => user.attacksMade));
      const mostAttacked = stats.filter(user => user.attacksReceived === maxAttacksReceived && user.attacksMade === minAttacksMade).map(user => user.username);
      setMostAttackedUsers(mostAttacked);
    } else {
      setMostAttackedUsers([]);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const timeZone = 'Asia/Tokyo';
    const zonedDate = toZonedTime(new Date(timestamp), timeZone);
    return format(zonedDate, 'yyyy-MM-dd HH:mm:ss', { timeZone });
  };

  const handleDelete = (data: AttackData[], index: number) => {
    const confirmDelete = window.confirm('この攻撃データを削除しますか？');
    if (confirmDelete) {
      deleteAttack(data, index + 1, teamName);
      setData(data.filter((_, i) => i !== index));
      alert('攻撃データを削除しました');
    }
  };

  return (
    <div className="container">
      <Navbar />
      <h2>ユーザーごとの攻撃回数</h2>
      <UserStatsTable userStats={userStats} mostAttackedUsers={mostAttackedUsers} />
      <h1>攻撃データベース</h1>
      <AttackDataTable data={data} handleDelete={handleDelete} formatTimestamp={formatTimestamp} />
    </div>
  );
};

const UserStatsTable: React.FC<{ userStats: UserStats[], mostAttackedUsers: string[] }> = ({ userStats, mostAttackedUsers }) => (
  <table>
    <thead>
      <tr>
        <th>ユーザー名</th>
        <th>攻撃を行った回数</th>
        <th>攻撃を受けた回数</th>
      </tr>
    </thead>
    <tbody>
      {userStats.map((user, index) => (
        <tr key={index} className={mostAttackedUsers.includes(user.username) ? 'most-attacked-row' : ''}>
          <td>{user.username}</td>
          <td>{user.attacksMade}</td>
          <td>{user.attacksReceived}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const AttackDataTable: React.FC<{ data: AttackData[], handleDelete: (data: AttackData[], index: number) => void, formatTimestamp: (timestamp: string) => string }> = ({ data, handleDelete, formatTimestamp }) => (
  <table>
    <thead>
      <tr>
        <th>タイムスタンプ</th>
        <th>攻撃者</th>
        <th>被攻撃者</th>
      </tr>
    </thead>
    <tbody>
      {data.map((row, index) => (
        <tr key={index} onClick={() => handleDelete(data, index)}>
          <td>{formatTimestamp(row.timestamp)}</td>
          <td>{row.attacker}</td>
          <td>{row.victim}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default ReceivedAttacks;
