import React from 'react';

// redux
import { connect } from 'react-redux';
import { refresh } from '../../../redux/calculator/actions';
import { getExchangeRates } from '../../../redux/calculator/helpers/getExchangeRates';

// React components
import OperationItem from './OperationItem';

const Calculator = (props) => {

    props.getExchangeRates();

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
            { props.calculator.history.length ? historyArray : <OperationItem key={ 0 } index={ 0 } content={{ input: '', markdown: [], output: '' }} /> }
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
    { refresh, getExchangeRates }
)(Calculator);

export default CalculatorConnected;