import React, { useState, useContext } from 'react';
import { CSSTransition } from 'react-transition-group';
import { FaGithub, FaSlack } from 'react-icons/fa';
import Button from '@mui/material/Button';

import Navbar from '../components/Navbar';
import { createTeamSheet, checkTeamExists } from '../api';
import { TeamContext } from '../context/TeamContext';

import '../index.css';

const Home: React.FC = () => {
  const [loginTeamName, setLoginTeamName] = useState('');
  const [showExamples, setShowExamples] = useState(false);
  const { setTeamName: setGlobalTeamName } = useContext(TeamContext);

  const handleLoginTeam = async () => {
    if (!loginTeamName) {
      alert('チーム名を入力してください');
      return;
    }

    const teamExists = await checkTeamExists(loginTeamName);
    if (teamExists) {
      setGlobalTeamName(loginTeamName);
      alert(`チーム「${loginTeamName}」にログインしました`);
    } else {
      const createTeam = window.confirm('チームがありません。作成しますか？');
      if (createTeam) {
        try {
          await createTeamSheet(loginTeamName);
          setGlobalTeamName(loginTeamName);
          alert(`チーム「${loginTeamName}」が作成され、ログインしました`);
        } catch (error) {
          alert('チームの作成に失敗しました');
          console.error(error);
        }
      }
    }
    setLoginTeamName('');
  };

  const toggleExamples = () => {
    setShowExamples(!showExamples);
  };

  return (
    <div className="container">
      <Navbar />
      <h1 className="title">Tashikani Counter</h1>
      <Instructions showExamples={showExamples} toggleExamples={toggleExamples} />
      <TeamLogin
        loginTeamName={loginTeamName}
        setLoginTeamName={setLoginTeamName}
        handleLoginTeam={handleLoginTeam}
      />
    </div>
  );
};

const Instructions: React.FC<{
  showExamples: boolean;
  toggleExamples: () => void;
}> = ({ showExamples, toggleExamples }) => (
  <div className="instructions">
    <h2>このアプリについて</h2>
    <div className="examples">
      <p>
        <strong>「たしかに」という言葉を禁止するゲーム</strong>
        を楽しむためのアプリです。
        <br />
        誰が誰に何回「たしかに」と言わせたかを簡単に記録し、管理できる機能を備えています。
        <br />
        記録はすぐに確認でき、ゲームの進行をスムーズにサポートします。
      </p>
    </div>
    <Button
      variant="contained"
      color="primary"
      onClick={toggleExamples}
      className="toggle-button"
    >
      {showExamples ? "使い方を隠す" : "詳細な使い方を見る"}
    </Button>
    <CSSTransition
      in={showExamples}
      timeout={300}
      classNames="fade"
      unmountOnExit
    >
      <div className="examples">
        <p>
          このアプリはユーザー間の攻撃情報を管理するためのものです。以下の手順で使用してください。
        </p>
        <ol>
          <li>チームログイン: チーム名を入力してログイン・登録します。</li>
          <li>ユーザー登録: 新しいユーザーを登録します。</li>
          <li>攻撃登録: ユーザー間の攻撃を登録します。</li>
          <li>攻撃履歴: 受けた攻撃の履歴を確認します。</li>
          <li>グラフ表示: ユーザー間の攻撃関係をグラフで表示します。</li>
        </ol>
        <p><strong>その他</strong>
          <br />
          developmentは使い方を試すためのチームです．実際に使用する際は新しいチームを作成してください．
          <br />
          ユーザーや攻撃データはクリックすることで削除可能です．
        </p>
        <p>
          <strong>また，webアプリなどの開発に興味ある方を募集中です．</strong>
          <br />
          まだほぼ人はいませんが，興味ある方はSlackに参加してもらえると喜びます．
        </p>
        <div className="github-icon">
          <a
            title="GitHub"
            href="https://github.com/soranjiro/tashikani-counter"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub size={30} />
{/*           </a>
          <a
            title="Slack"
            href="https://join.slack.com/t/webapp-wcy5131/shared_invite/zt-2runcy9c6-SXzslGxHDBsAS89hKOkOZQ"
            target="_blank"
            rel="noopener noreferrer"
            className="slack-icon"
          >
            <FaSlack size={30} />
          </a> */}
        </div>
      </div>
    </CSSTransition>
  </div>
);

const TeamLogin: React.FC<{
  loginTeamName: string;
  setLoginTeamName: React.Dispatch<React.SetStateAction<string>>;
  handleLoginTeam: () => void;
}> = ({ loginTeamName, setLoginTeamName, handleLoginTeam }) => (
  <div className="team-login">
    <h2>チームログイン</h2>
    <input
      type="text"
      value={loginTeamName}
      onChange={(e) => setLoginTeamName(e.target.value)}
      placeholder="チーム名"
    />
    <button type="button" onClick={handleLoginTeam}>
      ログイン
    </button>
  </div>
);

export default Home;
