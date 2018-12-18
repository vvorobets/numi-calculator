import { setExchangeRates } from '../actions';

export const getExchangeRates = () => dispatch => {

    return fetch('http://www.floatrates.com/daily/usd.json', { // https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        }
    })
        .then(response => response.json())
        .then(json => { 
            let exchangeRates = {};
            for (let key in json) {
               exchangeRates[json[key].code] = json[key].inverseRate;
            }
            dispatch(setExchangeRates(exchangeRates));
        })            
        .catch(error => {
            console.error(error);
            setTimeout(() => getExchangeRates(), 15000)
        })
}

