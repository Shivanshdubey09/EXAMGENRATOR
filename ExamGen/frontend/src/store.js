import { createStore } from 'redux';

const initialState = {
  questions: [],
  examInfo: {},
};

function examReducer(state = initialState, action) {
  switch (action.type) {

    case 'SET_DATA':
      return {
        ...state,
        questions: Array.isArray(action.payload?.questions)
          ? action.payload.questions
          : [],
        examInfo: action.payload?.examInfo || {},
      };
    case "ADD_QUESTION_TO_PAPER":
     return {
      ...state,
      questions: [...state.questions, action.payload],
     };
    case 'SWAP_QUESTION':
      if (!state.questions.length) return state;

      const updated = [...state.questions];
      updated[action.index] = action.newQuestion;

      return {
        ...state,
        questions: updated,
      };

    case 'CLEAR_DATA':
      return {
        questions: [],
        examInfo: {},
      };

    default:
      return state;
  }
}

export const store = createStore(
  examReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__()
);