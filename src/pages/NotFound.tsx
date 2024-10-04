import React from 'react';
import '../css/NotFound.css';

const NotFound: React.FC = () => {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404 - ページが見つかりません</h1>
      <p className="not-found-message">指定されたURLのページは存在しません。</p>
      <a href="/" className="not-found-link">ホームに戻る</a>
    </div>
  );
};

export default NotFound;
