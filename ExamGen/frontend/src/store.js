import { createStore } from 'redux';

const initialState = {
    questions: [],
    examInfo: {}
};

function examReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_DATA':
            // Fix: Use action.payload instead of action.questions/action.info
            return { 
                ...state, 
                questions: action.payload.questions, 
                examInfo: action.payload.info 
            };
        case 'SWAP_QUESTION':
            const updated = [...state.questions];
            updated[action.index] = action.newQuestion;
            return { ...state, questions: updated };
        default:
            return state;
    }
}

export const store = createStore(examReducer);