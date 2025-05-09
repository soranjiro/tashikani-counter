import express from 'express';
import bodyParser from 'body-parser';
import { AttackData } from './types';
import {
  getUsers,
  registerUser,
  deleteUser,
  getAttacks,
  registerAttack,
  deleteAttack,
  createTeamSheet,
  checkTeamExists
} from './functions';

// Expressアプリケーションの設定
const app = express();
app.use(bodyParser.json());

// ユーザーを取得するエンドポイント
app.post('/users', async (req, res) => {
  try {
    const { teamName } = req.body;
    const users = await getUsers(teamName);
    res.json(users);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

// ユーザーを登録するエンドポイント
app.post('/users/register', async (req, res) => {
  try {
    const { name, teamName } = req.body;
    await registerUser(name, teamName);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

// ユーザーを削除するエンドポイント
app.delete('/users', async (req, res) => {
  try {
    const { users, index, teamName } = req.body;
    await deleteUser(users, index, teamName);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

// 攻撃データを取得するエンドポイント
app.post('/attacks', async (req, res) => {
  try {
    const { teamName } = req.body;
    const attacks = await getAttacks(teamName);
    res.json(attacks);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

// 攻撃データを登録するエンドポイント
app.post('/attacks/register', async (req, res) => {
  try {
    const { attacker, victim, teamName } = req.body;
    await registerAttack(attacker, victim, teamName);
    res.status(201).json({ message: 'Attack registered successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

// 攻撃データを削除するエンドポイント
app.delete('/attacks', async (req, res) => {
  try {
    const { attackData, index, teamName } = req.body;
    await deleteAttack(attackData, index, teamName);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

// チームが存在するか確認するエンドポイント
app.get('/teams', async (req, res) => {
  try {
    const { teamName } = req.body;
    const exists = await checkTeamExists(teamName);
    res.json({ exists });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

// 新しいチームシートを作成するエンドポイント
app.post('/teams', async (req, res) => {
  try {
    const { teamName } = req.body;
    await createTeamSheet(teamName);
    res.status(201).json({ message: 'Team sheet created successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});



// サーバーの起動
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
