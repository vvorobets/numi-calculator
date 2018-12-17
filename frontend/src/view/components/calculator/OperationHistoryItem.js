import React from 'react';
import PropTypes from 'prop-types';

// redux
import { connect } from 'react-redux';
import { copyOne, deleteOne } from '../../../redux/calculator/actions';

const OperationHistoryItem = (props) => {
    const copyResult = () => { props.copyOne(props.output) };

    const deleteOne = () => { props.deleteOne(props.index) };

    return (
        <div className="operation-item">
            <button 
                onClick={ deleteOne }
                className="operation-item__button operation-item__button--delete"
            >X</button>
            <span className="operation-item__view-span operation-item__view-span--input">{ props.input }</span>
            <strong> = </strong> 
            <span className="operation-item__view-span operation-item__view-span--output">{ props.output }</span>
            <button
                className="operation-item__button operation-item__button--copy"
                onClick={ copyResult }
            >Copy</button>
        </div>
    )
}

OperationHistoryItem.propTypes = {
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
    copyOne: PropTypes.func,
    deleteOne: PropTypes.func,
};

// const mapStateToProps = ({ }) => ({
	
// });

const OperationHistoryItemConnected = connect(
    () => ({}),
    { copyOne, deleteOne }
)(OperationHistoryItem);

export default OperationHistoryItemConnected;