import { KEYWORDS_LIST } from './keywordsLists';

export const checkVariableName = name => {
    if (/\d/.test(name)) return { type: 'error', value: 'Variable name should not start with number' };
    for(let letter of name) { // underscore '_' is allowed
        if(/W/.test(letter)) return { type: 'error', value: 'Variable name should not contain whitespaces or special characters'};
    }
    if (KEYWORDS_LIST.includes(name)) return { type: 'error', value: 'Keywords cannot be used as a variable' };
    else return { type: 'variableName', value: name };
}

