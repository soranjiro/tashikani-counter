import { AttackData } from './types';

// 環境変数の取得とチェック
const getEnvVariable = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const API_BASE_URL = getEnvVariable('API_BASE_URL');


// ユーザーを取得する関数
export const getUsers = async (teamName: string): Promise<string[]> => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ teamName }),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
};

// ユーザーを登録する関数
export const registerUser = async (name: string, teamName: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, teamName }),
  });
  if (!response.ok) {
    throw new Error('Failed to register user');
  }
};

// ユーザーを削除する関数
export const deleteUser = async (users: string[], index: number, teamName: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ users, index, teamName }),
  });
  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
};

// 攻撃データを取得する関数
export const getAttacks = async (teamName: string): Promise<{ data: AttackData[] }> => {
  const response = await fetch(`${API_BASE_URL}/attacks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ teamName }),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch attacks');
  }
  return response.json();
};

// 攻撃データを登録する関数
export const registerAttack = async (attacker: string, victim: string, teamName: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/attacks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ attacker, victim, teamName }),
  });
  if (!response.ok) {
    throw new Error('Failed to register attack');
  }
};

// 攻撃データを削除する関数
export const deleteAttack = async (attackData: AttackData[], index: number, teamName: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/attacks`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ attackData, index, teamName }),
  });
  if (!response.ok) {
    throw new Error('Failed to delete attack');
  }
};

// チームが存在するか確認する関数
export const checkTeamExists = async (teamName: string): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/teams`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ teamName }),
  });
  if (!response.ok) {
    throw new Error('Failed to check if team exists');
  }
  const data = await response.json();
  return data.exists;
};


// 新しいチームシートを作成する関数
export const createTeamSheet = async (teamName: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/teams`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ teamName }),
  });
  if (!response.ok) {
    throw new Error('Failed to create team sheet');
  }
};
