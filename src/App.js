import React from 'react';
import randomColor from 'randomcolor';

import './App.css';
import { border } from '@chakra-ui/react';

const schema = `
type Query {
  packages: [Package!]!
  package(packageId: ID!): Package
  activities: [Activity!]!
  activity(activityId: ID!): Activity
  hotels: [Hotel!]!
  hotel(hotelId: ID!): Hotel
}

type Package {
  id: ID!
  name: String!
  activities: [Activity!]!
  price: Int
  hasActivity(id: ID!): Boolean!
  calculateSavings(id: ID!): Int
}


type Activity {
  id: ID!
  name: String!
  Schedule: String
  category: ActivityCategory!
  price: Int
}

type Hotel {
  id: ID!
  name: String!
  packages: [Package!]!
}

enum ActivityCategory {
  LEISURE
  ADVENTURE
  CULTURE
}
`;

function App() {
  const subGraphRef = React.useRef();
  const [subgraphs, setSubgraphs] = React.useState([]);
  const [selectedSubgraph, _setSelectedSubgraph] = React.useState(null);
  const [lines, setLines] = React.useState(
    schema.split('\n').map((line) => ({ text: line, assigned: null })),
  );

  const selectedSubgraphRef = React.useRef(selectedSubgraph);
  const setSelectedSubgraph = (data) => {
    selectedSubgraphRef.current = data();
    _setSelectedSubgraph(data);
  };

  const handleKeyDown = React.useCallback(
    (e) => {
      console.log('selectedSubgraphRef.current', selectedSubgraphRef.current);
      if (e.key === 'Backspace' && selectedSubgraphRef.current) {
        setSubgraphs((sg) => sg.filter((g) => g !== selectedSubgraph));
        window.removeEventListener('keydown', handleKeyDown);
      }
    },
    [selectedSubgraph],
  );

  React.useEffect(() => {
    console.log('effect selectedSubgraph', selectedSubgraph);
    if (selectedSubgraph) {
      window.addEventListener('keydown', handleKeyDown);
    } else {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, selectedSubgraph]);

  const toggleSubgraph = (subgraph) => {
    setSelectedSubgraph((curr) => (curr === subgraph ? null : subgraph));
  };

  const addSubgraph = () => {
    const name = subGraphRef.current.value;
    if (!name) return;
    var color = randomColor();
    setSubgraphs([...subgraphs, { name, color }]);
    subGraphRef.current.value = '';
  };

  const toggleAssignSubgraph = (idx) => {
    console.log(idx);

    setLines((l) => {
      const newL = JSON.parse(JSON.stringify(l));
      console.log(newL[idx]);
      newL[idx].assigned =
        newL[idx].assigned === null ? selectedSubgraph : null;
      return newL;
    });
  };

  const checkEnter = (e) => {
    if (e.key === 'Enter') {
      addSubgraph();
    }
  };

  return (
    <div style={{ display: 'flex', width: '80%', justifyContent: 'center' }}>
      <div
        style={{
          background: 'black',
          color: 'white',
          padding: '10px',
          borderRadius: 10,
        }}
      >
        {lines.map(({ text, assigned }, idx) => {
          return (
            <div
              style={{
                cursor: 'pointer',
                userSelect: 'none',
                color: assigned ? assigned.color : '',
              }}
              className='line'
              onClick={() => toggleAssignSubgraph(idx)}
            >
              {text.slice(0, 2) === '  ' && <span>&nbsp;&nbsp;</span>}
              {text}
              {text === '}' && <div>&nbsp;</div>}
            </div>
          );
        })}
      </div>
      <div
        style={{
          padding: '10px',
          borderRadius: 10,
        }}
      >
        {subgraphs.map((subgraph) => (
          <div
            onClick={() => toggleSubgraph(subgraph)}
            style={{
              position: 'relative',
              cursor: 'pointer',
              border:
                subgraph === selectedSubgraph && `1px solid ${subgraph.color}`,
              userSelect: 'none',
            }}
          >
            {subgraph.name}-subgraph
            <span
              style={{
                display: 'inline-block',
                position: 'absolute',
                top: 3,
                marginLeft: 5,
                width: '15px',
                height: '15px',
                borderRadius: '50%',
                backgroundColor: subgraph.color,
              }}
            >
              &nbsp;
            </span>
          </div>
        ))}
        <div>
          <input ref={subGraphRef} onKeyDown={checkEnter} />
          <button onClick={addSubgraph}>+ subgraph</button>
        </div>
      </div>
    </div>
  );
}

export default App;
