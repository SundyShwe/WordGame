export enum GUESS_RESULT {
    Correct = "Correct",
    Incorrect = "Incorrect",
}

export interface ITry {  //History
    word: string;
    result: GUESS_RESULT;
    timestamp: number;
}

export interface IState {  //LocalStorage
    complexity: number;
    win_count: number;
    loss_count: number;
    logs: ITry[];
}

export const INITIAL_STATE = {
    complexity: 5,
    win_count: 0,
    loss_count: 0,
    logs: [] as ITry[],
};

export interface IResponse {
    "success": boolean,
    "data": {
        "valid": boolean
    }
}