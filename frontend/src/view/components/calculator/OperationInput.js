import React from 'react';

// redux
import { connect } from 'react-redux';
import { updateInput, calculate, handleError } from '../../../redux/calculator/actions';

const Operation = (props) => {
    const handleInput = (e) => {
        return props.updateInput(e.target.value);
    };

    const handlePaste = () => {
        return props.updateInput(props.calculator.currentInput + props.calculator.buffer); // ensure concatenation of two number values
    }

    const handleCalculate = () => {
        if(!props.calculator.currentInput.trim().length) {
            return props.handleError('Cannot operate empty input');
        }
        return props.calculate(props.calculator.currentInput);
    }

    const handleOnKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleCalculate();
        }
    }

    return (
        <div className="operation-item">
            <button 
                onClick={ handlePaste }
                className="operation-item__button operation-item__button--copy"
            >Paste</button>
            <input
                onKeyPress={ handleOnKeyPress }
                onChange={ handleInput }
                value={ props.calculator.currentInput }
                placeholder="Input here" 
                className="operation-item__input"
            />
            <button
                onClick={ handleCalculate }
                className="operation-item__button operation-item__button--copy"
            >=></button>
        </div>
    )
}

const mapStateToProps = ({ calculator }) => ({
	calculator
});

const OperationConnected = connect(
    mapStateToProps,
    { updateInput, calculate, handleError }
)(Operation);

export default OperationConnected;