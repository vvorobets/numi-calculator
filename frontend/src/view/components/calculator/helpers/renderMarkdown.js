import React from 'react';

export const renderMarkdown = text => { // text is array
    return text.map( (item, i) => {
        switch(item.type) {
            case 'header':
                return <span className="operation-item__markdown--header" key={i}>{item.value.toUpperCase()} </span>;
            case 'comment':
                return  <span className="operation-item__markdown--comment" key={i}>{item.value} </span>;
            case 'label':
                return <span className="operation-item__markdown--label" key={i}>{item.value} </span>;
            case 'measureUnit':
                return <span className="operation-item__markdown--measureUnit" key={i}>{item.value} </span>;
            case 'operation':
                return <span className="operation-item__markdown--keyword" key={i}>{item.value} </span>;
            case 'variableName':
                return <span className="operation-item__markdown--keyword" key={i}>{item.value} </span>;
            case 'numberValue':
                return <span className="operation-item__markdown--numberValue" key={i}>{item.value} </span>;
            case 'word':
                return <span className="operation-item__markdown--numberValue" key={i}>{item.value} </span>;
            case 'error':
                return <span className="operation-item__markdown--error" key={i}>{item.value} </span>;
            default:
                return <span className="operation-item__markdown--error" key={i}>Some error has happened </span>;
        }
    })
}