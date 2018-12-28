import React from 'react';
import PropTypes from 'prop-types';

// redux
import { connect } from 'react-redux';
import { refresh, handleError, saveNote } from '../../../redux/calculator/actions';
import { handleInput } from '../../../redux/calculator/helpers/handleInput';
import { handleSave } from '../../../redux/calculator/fetchHelpers/handleSave';

const Calculator = (props) => {

    const getInput = e => {
        props.handleInput(e.target.value);
    }

    const copyAll = e => {
        if (e.target.selectionStart === 0 && e.target.selectionEnd === e.target.value.length) {
            let inputRows = props.calculator.input.split('\n'),
                outputRows = props.calculator.output.split('\n');
            if (!inputRows) return false;
            else {
                if (inputRows.length > 0) {
                    let res = '';
                    for (let i = 0; i < inputRows.length; i++) {
                        if (inputRows[i]) res += `${inputRows[i]} = ${outputRows[i]}\n`;
                    }
                    if (res) navigator.clipboard.writeText(res);
                }
            }
        }
    }

    const copyOne = e => {
        navigator.clipboard.writeText(e.target.innerHTML);
        alert (`Copied: ${e.target.innerHTML}`);
    }

    const backlight = props.calculator.output.split('\n').map((item, i) => {
        return <div key={i} className="calculator__textarea-backlight-item" onClick={copyOne}>{ item }</div>
    })

    const getNoteName = e => {
        e.preventDefault();
        props.handleSave({ [e.target.noteName.value]: props.calculator.input })
    }
    
    return (
        <>
        <h3>Calculator App</h3>
        <div className="calculator-layout">
            <div className="calculator__textarea-background calculator__textarea-background--input">
            <textarea
                onChange={ getInput }
                onCopy={ copyAll }
                value={ props.calculator.input }
                rows='5' cols='20'
                placeholder="Input here" 
                className="calculator__textarea calculator__textarea--input"
            ></textarea>
            </div>
            <div className="calculator__textarea-background calculator__textarea-background--output">
            <div className="calculator__textarea-backlight">
                { backlight }
            </div>
            <textarea
                rows='5' cols='20'
                className="calculator__textarea calculator__textarea--output"
                value={ props.calculator.output }
            ></textarea>
            </div>
            <p>TOTAL: </p>
            <p className="user-form__tip--error">{ props.calculator.errorMessage }</p>
        </div>
        <div className="calculator__controls">
            <form 
                onSubmit={ getNoteName }
                className="small-form"
            >
                Save as:
                <input 
                    type="text" name="noteName"
                    className="small-form__input"
                />
                <input 
                    type="submit" value="Save" 
                    className="small-form__button"
                />
            </form> 
            <select 
                className="calculator__select"
            >
                <option>Paste</option>
            </select>
            <button 
                className="calculator__button calculator__button--refresh"
                onClick={ props.refresh }
            >Clear All</button>
        </div>
        </>
    )
}

Calculator.propTypes = {
    user: PropTypes.shape({
        username: PropTypes.string
    }),
	calculator: PropTypes.shape({
        input: PropTypes.string,
        output: PropTypes.string,
        errorMessage: PropTypes.string,
    }),
    refresh: PropTypes.func,
    handleInput: PropTypes.func,
    handleError: PropTypes.func
};

const mapStateToProps = ({ user, calculator }) => ({
	user, calculator
});

const CalculatorConnected = connect(
    mapStateToProps,
    { handleInput, refresh, handleError, handleSave }
)(Calculator);

export default CalculatorConnected;