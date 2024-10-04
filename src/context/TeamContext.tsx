import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface TeamContextProps {
  teamName: string;
  setTeamName: React.Dispatch<React.SetStateAction<string>>;
}

export const TeamContext = createContext<TeamContextProps>({
  teamName: '',
  setTeamName: () => {},
});

interface TeamProviderProps {
  children: ReactNode;
}

export const TeamProvider: React.FC<TeamProviderProps> = ({ children }) => {
  const [teamName, setTeamName] = useState(() => {
    // 初期化時にローカルストレージからチーム名を読み込む
    const savedTeamName = localStorage.getItem('teamName');
    return savedTeamName || 'development';
  });

  useEffect(() => {
    // チーム名が変更されたときにローカルストレージに保存する
    localStorage.setItem('teamName', teamName);
  }, [teamName]);

  return (
    <TeamContext.Provider value={{ teamName, setTeamName }}>
      {children}
    </TeamContext.Provider>
  );
};
