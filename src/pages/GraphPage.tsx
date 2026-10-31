import { useCallback, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  type NodeChange, // Added 'type' keyword
  type EdgeChange, // Added 'type' keyword
  type Node,       // Added to type our arrays
  type Edge,       // Added to type our arrays
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import TrustNode from '../components/graph/TrustNode';

const nodeTypes = {
  trustNode: TrustNode,
};

// 1. Explicitly typed as Node[]
const initialNodes: Node[] = [
  { id: '1', type: 'trustNode', position: { x: 250, y: 50 }, data: { label: 'Login & Authentication', state: 'proven', coverage: 95 } },
  { id: '2', type: 'trustNode', position: { x: 50, y: 200 }, data: { label: 'User Profile Manager', state: 'stale', coverage: 82 } },
  { id: '3', type: 'trustNode', position: { x: 450, y: 200 }, data: { label: 'Payment Checkout Logic', state: 'weak', coverage: 45 } },
  { id: '4', type: 'trustNode', position: { x: 250, y: 350 }, data: { label: 'Main Dashboard Shell', state: 'unproven', coverage: 0 } },
];

// 2. Explicitly typed as Edge[]
const initialEdges: Edge[] = [
  { 
    id: 'e1-2', source: '1', target: '2', animated: true, 
    style: { stroke: '#ef4444', strokeWidth: 2, filter: 'drop-shadow(0 0 6px #ef4444)' } 
  },
  { 
    id: 'e1-3', source: '1', target: '3', animated: true, 
    style: { stroke: '#f59e0b', strokeWidth: 2, filter: 'drop-shadow(0 0 6px #f59e0b)' } 
  },
  { 
    id: 'e2-4', source: '2', target: '4', animated: true, 
    style: { stroke: '#6b7280', strokeWidth: 2, filter: 'drop-shadow(0 0 4px #6b7280)' } 
  },
  { 
    id: 'e3-4', source: '3', target: '4', animated: true, 
    style: { stroke: '#6b7280', strokeWidth: 2, filter: 'drop-shadow(0 0 4px #6b7280)' } 
  },
];

export default function GraphPage() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-100">Trust Graph</h2>
          <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded font-bold tracking-wider">DEMO MODE</span>
        </div>
        <p className="text-sm text-gray-400">Dependency map showing agent-modified code</p>
      </div>
      
      <div className="flex-1 bg-dark-panel border border-dark-border rounded-lg overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          colorMode="dark"
        >
          <Background color="#1f2937" gap={16} />
          <Controls className="bg-dark-bg border-dark-border text-gray-300" />
        </ReactFlow>
      </div>
    </div>
  );
}