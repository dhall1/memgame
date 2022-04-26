import React from 'react';

import { shuffleArray } from './util';

enum GameState {
  SHOW_SOLUTION = 0,
  PLAYING = 1,
  DONE = 2,
};

type GameGridState = {
  size: number,
  hidden: Array<number>,
  selected: Array<boolean>,
  complete: boolean,
};

function getInitialGameGridState(size: number): GameGridState {
  let hidden = shuffleArray(Array.from(Array(size * size).keys())).slice(0, size);
  let selected = Array.from(Array(size * size)).fill(false);
  return {
    size,
    hidden,
    selected,
    complete: false,
  };
}

function gameGridStateReducer(state: GameGridState, action: any): GameGridState {
  let newState = {
    size: state.size,
    hidden: [...state.hidden],
    selected: [...state.selected],
    complete: state.complete,
  };

  switch (action.type) {
    case 'select':
      newState.selected[action.index] = true;
      newState.complete = newState.hidden.every(val => newState.selected[val]);
      return newState;
    case 'reset':
      return getInitialGameGridState(action.size);
  }
  return state;
};

type GameGridProps = {
  size: number,
  onLevelCompleted: () => void
};

export default function GameGrid(props: GameGridProps): React.ReactElement {

  const [gameState, setGameState] = React.useState(GameState.SHOW_SOLUTION);

  const firstUpdate = React.useRef(true);

  const [state, dispatch] = React.useReducer(
    gameGridStateReducer,
    getInitialGameGridState(props.size)
  );

  React.useEffect(() => {
    setTimeout(() => setGameState(GameState.PLAYING), 1500);
  }, []);

  // TODO: this will probably be buggy as the effect is called after rendering,
  // so there will be one render between the size prop changing and the rest
  // reacting, but I can't find a better way
  React.useEffect(() => {
    if (!firstUpdate.current) {
      console.log("Resizing");
      dispatch({ type: 'reset', size: props.size });
      setGameState(GameState.SHOW_SOLUTION);
      setTimeout(() => setGameState(GameState.PLAYING), 1500);
    } else {
      firstUpdate.current = false;
    }
  }, [props.size]);

  React.useEffect(() => {
    if (state.complete) {
      props.onLevelCompleted();
      setGameState(GameState.DONE);
    }
  }, [state.complete]);

  return (
    <div className="game-grid-container" style={{
      gridTemplateColumns: `repeat(${props.size}, 1fr)`,
      gridTemplateRows: `repeat(${props.size}, 1fr)`
    }}>
      {state.selected.map((isBoxSelected, index) => {
        let classNames = 'game-grid-container-item';
        
        if (gameState === GameState.SHOW_SOLUTION) {
          if (state.hidden.includes(index)) {
            classNames += ' desired';
          }
        } else {
          if (isBoxSelected) {
            if (state.hidden.includes(index)) {
              classNames += ' good';
            } else {
              classNames += ' bad';
            }
          }
        }
        return (
          <div className={classNames} key={index} onClick={e => {
            if (gameState !== GameState.PLAYING) {
              return;
            }
            if (!state.hidden.includes(index)) {
              setGameState(GameState.DONE);
            }
            dispatch({type: 'select', index });
          }}></div>
        );
      })}
    </div>
  );
}
