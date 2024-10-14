import { AttackData } from './types';

// 環境変数の取得とチェック
const getEnvVariable = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const SHEET_ID = getEnvVariable('REACT_APP_SHEET_ID');
const REFRESH_TOKEN = getEnvVariable('REACT_APP_REFRESH_TOKEN');
const CLIENT_ID = getEnvVariable('REACT_APP_CLIENT_ID');
const CLIENT_SECRET = getEnvVariable('REACT_APP_CLIENT_SECRET');

// アクセストークンと有効期限をキャッシュするための変数
let cachedAccessToken: string | null = null;
let tokenExpiryTime: number | null = null;

// アクセストークンを取得する関数
const fetchAccessToken = async (): Promise<string> => {
  const endpoint = "https://www.googleapis.com/oauth2/v4/token";
  const params = new URLSearchParams({
    refresh_token: REFRESH_TOKEN,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: "refresh_token",
  });

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch access token');
  }

  const tokenData: { access_token: string | null, expires_in: number } = await response.json();

  if (tokenData.access_token === null) {
    throw new Error('Access token is null or undefined');
  }

  cachedAccessToken = tokenData.access_token;
  tokenExpiryTime = Date.now() + tokenData.expires_in * 1000;

  return cachedAccessToken;
};

// アクセストークンを取得する関数（キャッシュ対応）
const getAccessToken = async (): Promise<string> => {
  if (cachedAccessToken && tokenExpiryTime && Date.now() < tokenExpiryTime) {
    return cachedAccessToken;
  }
  return fetchAccessToken();
};

// Google Sheets APIからデータを取得する関数
const fetchDataFromSheet = async (range: string): Promise<any> => {
  const accessToken = await getAccessToken();
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch data from Google Sheets API');
  }

  return response.json();
};

// Google Sheets APIにデータを送信する関数
const sendDataToSheet = async (range: string, method: string, body: any): Promise<any> => {
  const accessToken = await getAccessToken();
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error('Failed to send data to Google Sheets API');
  }

  return response.json();
};

// ユーザーを取得する関数
export const getUsers = async (sheetName: string = 'development'): Promise<string[]> => {
  const jsonData = await fetchDataFromSheet(`${sheetName}!A:A`);
  if (jsonData && jsonData.values) {
    return jsonData.values
      .map((row: string[]) => row[0])
      .filter((user: string) => user && user.trim() !== '');
  }
  return [];
};

// ユーザーを登録する関数
export const registerUser = async (name: string, sheetName: string = 'development') => {
  const appendData = { "values": [[name]] };
  await sendDataToSheet(`${sheetName}!A1:A1:append?valueInputOption=USER_ENTERED`, 'POST', appendData);
};

// ユーザーを削除する関数
export const deleteUser = async (users: string[], index: number, sheetName: string = 'development') => {
  const startRow = index + 1;
  const endRow = users.length;
  const userData = await fetchDataFromSheet(`${sheetName}!A${startRow}:A${endRow}`);
  const userValues = userData.values;

  for (let i = index; i < endRow - 1; i++) {
    userValues[i - index] = userValues[i - index + 1];
  }
  userValues[endRow - index - 1] = [""];

  await sendDataToSheet(`${sheetName}!A${startRow}:A${endRow}?valueInputOption=RAW`, 'PUT', { values: userValues });

  const attackData = await fetchDataFromSheet(`${sheetName}!D:F`);
  const attackValues = attackData.values;
  const relatedAttackIndices = attackValues
    .map((row: string[], i: number) => (row[0] === users[index] || row[1] === users[index]) ? i : -1)
    .filter((i: number) => i !== -1);

  await Promise.all(relatedAttackIndices.map((attackIndex: number) => deleteAttack(attackValues, attackIndex)));
};

// 攻撃データを取得する関数
export const getAttacks = async (sheetName: string = 'development'): Promise<{ data: AttackData[] }> => {
  const jsonData = await fetchDataFromSheet(`${sheetName}!D:F`);
  const data: AttackData[] = jsonData.values
    .map((row: string[]) => ({
      attacker: row[0],
      victim: row[1],
      timestamp: row[2],
    }))
    .filter((attack: AttackData) => attack.attacker && attack.victim && attack.timestamp);
  return { data };
};

// 攻撃データを登録する関数
export const registerAttack = async (attacker: string, victim: string, sheetName: string = 'development') => {
  const timestamp = new Date().toISOString();
  const appendData = { "values": [[attacker, victim, timestamp]] };
  await sendDataToSheet(`${sheetName}!D1:F1:append?valueInputOption=USER_ENTERED`, 'POST', appendData);
};

// 攻撃データを削除する関数
export const deleteAttack = async (attackData: AttackData[], index: number, sheetName: string = 'development') => {
  const startRow = index + 1;
  const endRow = attackData.length;
  const data = await fetchDataFromSheet(`${sheetName}!D${startRow}:F${endRow}`);
  const values = data.values;

  for (let i = index; i < endRow - 1; i++) {
    values[i - index] = values[i - index + 1];
  }
  values[endRow - index - 1] = ["", "", ""];

  await sendDataToSheet(`${sheetName}!D${startRow}:F${endRow}?valueInputOption=RAW`, 'PUT', { values });
};

// 新しいチームシートを作成する関数
export const createTeamSheet = async (teamName: string) => {
  const accessToken = await getAccessToken();
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}:batchUpdate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [
        {
          addSheet: {
            properties: {
              title: teamName,
            },
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create new sheet');
  }

  const data = await response.json();
  console.log('Sheet created successfully:', data);
};

// チームが存在するか確認する関数
export const checkTeamExists = async (teamName: string): Promise<boolean> => {
  const accessToken = await getAccessToken();
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch sheet data');
  }

  const data = await response.json();
  return data.sheets.some((sheet: any) => sheet.properties.title === teamName);
};
