declare module 'react-vis-network' {
  import { Component } from 'react';

  interface Node {
    id: string | number;
    label?: string;
    [key: string]: any;
  }

  interface Edge {
    from: string | number;
    to: string | number;
    [key: string]: any;
  }

  interface NetworkProps {
    data: {
      nodes: Node[];
      edges: Edge[];
    };
    options?: any;
  }

  export class Network extends Component<NetworkProps> {}
}
