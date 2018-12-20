import React from 'react';
import PropTypes from 'prop-types';

// redux
import { connect } from 'react-redux';
import { refresh, handleError } from '../../../redux/calculator/actions';
import { handleInput } from '../../../redux/calculator/helpers/handleInput';

const Calculator = (props) => {

    const getInput = e => {
        if (e.target.value) props.handleInput(e.target.value);
    }
    
    return (
        <>
        <h3>Calculator App</h3>
        <div className="calculator-layout">
            <textarea
                onChange={ getInput }
                value={ props.calculator.input }
                rows='5' cols='20'
                placeholder="Input here" 
                className="calculator__textarea calculator__textarea--input"
            ></textarea>
            <textarea
                rows='5' cols='20'
                className="calculator__textarea calculator__textarea--output"
            >{ props.calculator.output }</textarea>
            <p>TOTAL: </p>
            <p className="user-form__tip--error">{ props.calculator.errorMessage }</p>
        </div>
        <button 
            className="operation-item__button operation-item__button--refresh"
            onClick={ props.refresh }
        >Clear All</button>
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
    { handleInput, handleError, refresh }
)(Calculator);

export default CalculatorConnected;