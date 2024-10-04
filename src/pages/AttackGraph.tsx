import React, { useEffect, useState, useRef, useContext } from 'react';

import { DataSet, Network } from 'vis-network/standalone';

import Navbar from '../components/Navbar';
import { getAttacks, getUsers } from '../api';
import { TeamContext } from '../context/TeamContext';

import '../css/AttackGraph.css';
interface EdgeData {
  from: string;
  to: string;
  value: number;
}

const AttackGraph: React.FC = () => {
  const [nodes, setNodes] = useState<{ id: string, label: string, color?: { background: string, border: string } }[]>([]);
  const [edges, setEdges] = useState<EdgeData[]>([]);
  const networkContainer = useRef<HTMLDivElement>(null);
  const { teamName } = useContext(TeamContext);

  const fetchData = async () => {
    const userList = await getUsers(teamName);
    const attackData = await getAttacks(teamName);

    if (userList) {
      const nodeData = userList.map(user => ({ id: user, label: user }));
      setNodes(nodeData);

      if (attackData) {
        const { edgeData, updatedNodes } = processAttackData(attackData.data, nodeData);
        setEdges(edgeData);
        setNodes(updatedNodes);
      }
    }
  };

  const processAttackData = (attackData: any[], nodeData: any[]) => {
    const edgeMap: { [key: string]: number } = {};
    const victimCount: { [key: string]: number } = {};

    attackData.forEach(attack => {
      const key = `${attack.attacker}-${attack.victim}`;
      edgeMap[key] = (edgeMap[key] || 0) + 1;
      victimCount[attack.victim] = (victimCount[attack.victim] || 0) + 1;
    });

    const edgeData = Object.keys(edgeMap).map(key => {
      const [from, to] = key.split('-');
      return { from, to, value: edgeMap[key] };
    });

    const maxAttacks = Math.max(...Object.values(victimCount));
    const mostAttackedUsers = Object.keys(victimCount).filter(user => victimCount[user] === maxAttacks);

    const updatedNodes = nodeData.map(node => {
      if (mostAttackedUsers.includes(node.id) && victimCount[node.id] > 0) {
        return { ...node, color: { background: 'red', border: 'red' } };
      }
      return node;
    });

    return { edgeData, updatedNodes };
  };

  const initializeNetwork = () => {
    if (networkContainer.current && nodes.length > 0) {
      const data = {
        nodes: new DataSet(nodes),
        edges: new DataSet(edges.map(edge => ({
          from: edge.from,
          to: edge.to,
          width: edge.value,
          arrows: 'to',
        }))),
      };

      const options = {
        nodes: {
          shape: 'dot',
          size: 16,
          font: {
            size: 14,
            color: 'white',
          },
        },
        edges: {
          color: { inherit: true },
          smooth: true,
        },
        physics: {
          stabilization: false,
        },
      };

      new Network(networkContainer.current, data, options);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    initializeNetwork();
  }, [nodes, edges]);

  return (
    <div className="container graph-container">
      <Navbar />
      <h1 className="graph-title">攻撃グラフ</h1>
      <div className="graph-network" ref={networkContainer}></div>
    </div>
  );
};

export default AttackGraph;
