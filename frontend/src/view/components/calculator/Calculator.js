import React from 'react';

// redux
import { connect } from 'react-redux';
import { refresh } from '../../../redux/calculator/actions';

// React components
import OperationInput from './OperationInput';
import OperationHistoryItem from './OperationHistoryItem';

const Calculator = (props) => {
    const historyArray = props.calculator.history.map((item, i) => { 
        return <OperationHistoryItem 
            key={ i }
            index={ i } // to get key from the props
            input={ item.input }
            output={ item.output }
        /> 
    });
    
    return (
        <React.Fragment>
        <h3>Calculator App</h3>
        <button 
            className="operation-item__button operation-item__button--delete operation-item__button--clear-all"
            onClick={ props.refresh }
        >Clear All</button>
        <div className="calculator-layout">
            { historyArray }
            <OperationInput />
        </div>
        </React.Fragment>
    )
}

const mapStateToProps = ({ user, calculator }) => ({
	user, calculator
});

const CalculatorConnected = connect(
    mapStateToProps,
    { refresh }
)(Calculator);

export default CalculatorConnected;