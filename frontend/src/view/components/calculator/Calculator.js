import React from 'react';

// redux
import { connect } from 'react-redux';
import { refresh } from '../../../redux/calculator/actions';

// React components
import OperationItem from './OperationItem';

const Calculator = (props) => {
    const historyArray = props.calculator.history.map((item, i) => { 
        return <OperationItem 
            key={ i }
            index={ i } // to get key from the props
            content={ item }
        /> 
    });
    
    return (
        <>
        <h3>Calculator App</h3>
        <button 
            className="operation-item__button operation-item__button--delete operation-item__button--clear-all"
            onClick={ props.refresh }
        >Clear All</button>
        <div className="calculator-layout">
            { historyArray }
            <p className="user-form__tip--error">{ props.calculator.errorMessage }</p>
        </div>
        </>
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