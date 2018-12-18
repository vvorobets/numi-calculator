export const getExchangeRates = () => dispatch => {

    return fetch('http://www.floatrates.com/daily/usd.json', { // https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        }
    })
        .then(response => {
            console.log('fetched!');
            response.json();
        })
        .then(json => { 
            if (json === 'error') {
            } else {
            }
        })            
        .catch(error => {
            console.error(error);
            setTimeout(() => getExchangeRates(), 60000)
        })
}

