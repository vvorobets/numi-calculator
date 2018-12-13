import React from 'react';

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

// const mapStateToProps = ({ }) => ({
	
// });

const OperationHistoryItemConnected = connect(
    () => ({}),
    { copyOne, deleteOne }
)(OperationHistoryItem);

export default OperationHistoryItemConnected;