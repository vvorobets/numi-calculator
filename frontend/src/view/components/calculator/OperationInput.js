import React from 'react';
import PropTypes from 'prop-types';

// redux
import { connect } from 'react-redux';
import { calculate, handleError } from '../../../redux/calculator/actions';

import { handleInput } from '../../../redux/calculator/helpers/operations';
import { renderMarkdown } from './helpers/renderMarkdown';

const OperationInput = (props) => {
    const getInput = e => props.handleInput(e.target.value);

    const handlePaste = () => props.updateInput(props.calculator.currentInput.input + props.calculator.buffer); // ensure concatenation of two number values

    const handleCalculate = () => {
        if(!props.calculator.currentInput.input.trim().length) {
            return props.handleError('Cannot operate empty input');
        }
        return props.calculate(props.calculator.currentInput.input, props.calculator.currentInput.markdown, props.calculator.currentInput.output);
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
            <div className="operation-item__input-block">
                <div className="operation-item__input-background">
                    <div className="operation-item__input-backlights">
                        <span className="operation-item__markdown--header">{ props.calculator.currentInput.markdown ? 
                            renderMarkdown(props.calculator.currentInput.markdown)  : '' }</span>
                    </div>
                </div>
            <textarea
                onKeyPress={ handleOnKeyPress }
                onChange={ getInput }
                value={ props.calculator.currentInput.input }
                placeholder="Input here" 
                className="operation-item__textarea"
            ></textarea>
            </div>
            <button
                onClick={ handleCalculate }
                className="operation-item__button operation-item__button--copy"
            >=></button>
        </div>
    )
}

// TODO:
// textarea.addEventListener('scroll', handleScroll);
// function handleScroll() { input-background.scrollTop = textarea.scrollTop; input-background.scrollLeft = textarea.scrollLeft; }

OperationInput.propTypes = {
	calculator: PropTypes.shape({
		currentInput: PropTypes.shape({
            input: PropTypes.string,
            markdown: PropTypes.arrayOf(PropTypes.shape({
                type: PropTypes.string,
                value: PropTypes.string
            })),
            output: PropTypes.string
        }),
		buffer: PropTypes.string
	}),
    handleInput: PropTypes.func,
    calculate: PropTypes.func,
    handleError: PropTypes.func
};

const mapStateToProps = ({ calculator }) => ({
	calculator
});

const OperationInputConnected = connect(
    mapStateToProps,
    { handleInput, calculate, handleError }
)(OperationInput);

export default OperationInputConnected;