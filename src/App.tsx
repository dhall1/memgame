import React from 'react';
import './App.css';
import GameGrid from './GameGrid';

type AppProps = {
  startSize: number,
  endSize: number,
};

function App(props: AppProps): React.ReactElement {

  const [size, setSize] = React.useState(props.startSize);

  const incrementSize = () => {
    if (size === props.endSize) {
      console.log("Done");
    } else {
      setSize(size + 1);
    }
  };

  return (
    <div className="App">
      <GameGrid size={size} onLevelCompleted={incrementSize}/>
    </div>
  );
}

export default App;
