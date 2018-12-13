import React from 'react';

// redux
import { connect } from 'react-redux';
import { updateInput, calculate } from '../../../redux/calculator/actions';

const Operation = (props) => {
    const handleInput = (e) => {
        return props.updateInput(e.target.value);
    };

    const handlePaste = () => {
        return props.updateInput(props.calculator.currentInput + props.calculator.buffer); // ensure concatenation of two number values
    }

    const handleCalculate = () => {
        return props.calculate(props.calculator.currentInput);
    }

    return (
        <div className="operation-item">
            <button 
                onClick={ handlePaste }
                className="operation-item__button operation-item__button--copy"
            >Paste</button>
            <input
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
    { updateInput, calculate }
)(Operation);

export default OperationConnected;