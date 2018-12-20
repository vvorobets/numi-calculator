import React from 'react';
import PropTypes from 'prop-types';

// redux
import { connect } from 'react-redux';
import { addLine, deleteLine, handleError } from '../../../redux/calculator/actions';

import { handleInput } from '../../../redux/calculator/helpers/handleInput';
import { renderMarkdown } from './helpers/renderMarkdown';

const OperationItem = (props) => {

    const getInput = e => props.handleInput(props.index, e.target.value);

    const handleOnKeyPress = (e) => {
        if (e.key === 'Enter') {
            props.addLine();
        }
    }

    const deleteLine = () => { 
        props.deleteLine(props.index);
    };

    return (
        <div className="operation-item">
            <button 
                onClick={ deleteLine }
                className="operation-item__button operation-item__button--delete"
            >X</button>
            <div className="operation-item__input-block">
                <div className="operation-item__input-background">
                    <div className="operation-item__input-backlights">
                        <span className="operation-item__markdown--header">{ props.content.markdown ? 
                            renderMarkdown(props.content.markdown)  : '' }</span>
                    </div>
                </div>
            <textarea
                onKeyPress={ handleOnKeyPress }
                onChange={ getInput }
                value={ props.content.input }
                placeholder="Input here" 
                className="operation-item__textarea"
            ></textarea>
            </div>
            <strong> = </strong> 
            <span className="operation-item__view-span operation-item__view-span--output">{ props.content.output }</span>
        </div>
    )
}

// TODO:
// textarea.addEventListener('scroll', handleScroll);
// function handleScroll() { input-background.scrollTop = textarea.scrollTop; input-background.scrollLeft = textarea.scrollLeft; }

OperationItem.propTypes = {
	content: PropTypes.shape({
        input: PropTypes.string,
        markdown: PropTypes.arrayOf(PropTypes.shape({
            type: PropTypes.string,
            value: PropTypes.string
        })),
        output: PropTypes.string
    }),
    handleInput: PropTypes.func,
    handleError: PropTypes.func,
    addLine: PropTypes.func,
    deleteLine: PropTypes.func,
};

const mapStateToProps = ({ calculator }) => ({
	calculator
});

const OperationItemConnected = connect(
    mapStateToProps,
    { handleInput, handleError, addLine, deleteLine }
)(OperationItem);

export default OperationItemConnected;