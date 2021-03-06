import React from 'react';
import axios from 'axios';
import { Button, Modal, ListGroup, ListGroupItem } from 'react-bootstrap';
import CryptoCurrencyNews from './cryptoCurrencyNews.jsx';
import SentimentSummary from './sentimentSummary.jsx';
import Autosuggest from 'react-autosuggest';
import CryptoModalGraph from './cryptoModalGraph.jsx';
import CryptoListGraph from './cryptoListGraph.jsx';
import $ from 'jquery';

const theme = {
  input: {
    width: '44em',
    height: '2.5em',
    marginTop: '1em',
    marginLeft: '1.3em',
    marginBottom: '1em',
  },
};

const styles = {
  border: {
    border: 'solid',
    borderWidth: '3px',
    borderColor: 'lightblue',
    width: '75%',
    padding: '7px',
    margin: '7px auto',
  },
};

class CryptoCurrency extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      cryptoCurrencyCode: '',
      cryptoCurrencyList: [],
      suggestions: [],
      showModal: false,
      cryptoData: {
        metaData: '',
        timeSeries: '',
      },
      cryptoNews: [],
      sentiments: {},
      savedCurrencyLists: [],
      renderGraph: false,
      filteredGraphData: {},
    };

    this.onAdd = this.onAdd.bind(this);
    this.onChange = this.onChange.bind(this);
    this.getSentiment = this.getSentiment.bind(this);
    this.newsSearch = this.newsSearch.bind(this);
    this.cryptoSearch = this.cryptoSearch.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.popOutSearch = this.popOutSearch.bind(this);
    this.close = this.close.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
    this.getSuggestionValue = this.getSuggestionValue.bind(this);
    this.renderSuggestion = this.renderSuggestion.bind(this);
    this.open = this.open.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.renderGraph = this.renderGraph.bind(this);
  }

  componentDidMount() {
    axios.get('/api/crypto/getCryptoCurrencyDatabase').then((response) => {
      // console.log('currency list response!!!!!!!!', response);
      this.setState({
        savedCurrencyLists: response.data,
      });
    }).catch((err) => {
      console.log(err);
    });

    axios.get('/api/crypto/getAllCryptoCurrencies').then((response) => {
      // console.log('all crypto currencies::: ', response.data);
      this.setState({
        cryptoCurrencyList: response.data,
      });
    });
  }

  onChange(event, { newValue, method }) {
    this.setState({
      search: newValue,
    });
  }

  onSuggestionsFetchRequested({ value }) {
    this.setState({
      suggestions: this.getSuggestions(value),
    });
  }

  getSentiment() {
    const { search } = this.state;
    axios.get(`/api/crypto/getSentiment?value=${search}`).then((response) => {
      this.setState({
        sentiments: response.data,
      });
    });
  }

  newsSearch() {
    const { search } = this.state;
    axios.get(`api/crypto/getNews?value=${search}`).then(response => {
      // console.log('news response::::', response);
      this.setState({
        cryptoNews: response.data,
      });
    });
  }

  cryptoSearch() {
    const { cryptoCurrencyCode } = this.state;
    axios
      .get(`/api/crypto/getCrypto?code=${cryptoCurrencyCode}`)
      .then((response) => {
        this.setState({
          cryptoData: {
            metaData: response.data.data['Meta Data'],
            timeSeries: response.data.data['Time Series (Digital Currency Intraday)'],
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  toggleModal() {
    if (!this.state.search) {
      alert('Search a bitcoin currency');
      return;
    }
    this.setState({
      showModal: !this.state.showModal,
    });
    this.cryptoSearch();
    this.newsSearch();
    this.getSentiment();
  }

  onAdd() {
    // const dates = Object.keys(this.state.cryptoData.timeSeries);
    // const recentDate = dates[0];
    // const lastDay = dates[1];
    const name = this.state.cryptoData.metaData['3. Digital Currency Name'];
    const symbol = this.state.cryptoData.metaData['2. Digital Currency Code'];
    const timeSeries = this.state.cryptoData.timeSeries;
    // console.log('timeSeries::::: ', timeSeries);
    const timeArray = Object.keys(timeSeries);
    const length = timeArray.length;
    const recentSeries = [];
    const lastInfo = timeSeries[timeArray[length-1]];

    for(let i = 0; i < 200; i++) {
      let time = timeArray[i];
      recentSeries.push( { date: time, price: timeSeries[timeArray[i]]['1a. price (USD)'] });
    }

    const currency = {
      name,
      symbol,
      recentSeries,
    }
    this.setState({
      savedCurrencyLists: [...this.state.savedCurrencyLists, currency],
    }, () => {
      // console.log('SAVED CURRENCY LISTS::::::::', name);
      // const nameLists = this.state.savedCurrencyLists;
      axios.post('/api/crypto/saveCurrency', { name, symbol, recentSeries })
        .then((response) => {
          // console.log('response for adding:::', response)
        })
        .catch((error) => {
          console.log(error);
        })
    });
    this.close();
  }
  open() {
    this.setState({
      showModal: true,
    });
  }

  close() {
    this.setState({
      showModal: false,
    });
  }

  popOutSearch() {
    return (
      <div className="modal">
        <Modal show={this.state.showModal} onHide={this.toggleModal}>
          <Modal.Header>
            <Modal.Title>
              {this.state.cryptoData.metaData['3. Digital Currency Name']}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CryptoModalGraph timeSeries={this.state.cryptoData.timeSeries} />
            <SentimentSummary sentiments={this.state.sentiments} />
            <CryptoCurrencyNews stories={this.state.cryptoNews} />
          </Modal.Body>
          <Modal.Footer>
            <button onClick={this.onAdd}> Add </button>
            <button onClick={this.close}> Cancel </button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  getSuggestions(value) {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0
      ? []
      : this.state.cryptoCurrencyList
        .filter(currency => currency.name.toLowerCase().slice(0, inputLength) === inputValue);
  }

  getSuggestionValue(suggestion) {
    this.setState({
      cryptoCurrencyCode: suggestion.code,
    });
    return suggestion.name;
  }

  renderSuggestion(suggestion) {
    return <div>{suggestion.name}</div>;
  }

  onSuggestionsClearRequested() {
    this.setState({
      suggestions: [],
    });
  }
  renderGraph(e) {
    if (!this.state.renderGraph) {
      $('#cryptoListGraph').toggle();
    }
    const currentCurrency = e.target.id;
    // console.log('target: ', currentCurrency);
    let currentData = this.state.savedCurrencyLists.filter((element) => {
      return element.symbol === currentCurrency;
    });
    this.setState({
      renderGraph: true,
      filteredGraphData: currentData[0],
    });
  }

  render() {
    console.log('cryptoDataTimeSeries:::', this.state.cryptoData.timeSeries)
    const inputProps = {
      placeholder: 'Type Bitcoin Currency Name',
      value: this.state.search,
      onChange: this.onChange,
      style: { width: '70%',
        height: '2.5em',
        marginTop: '1em',
        marginLeft: '7%',
        marginBottom: '1em',
        display: 'inline-block',
      }
    }
    const cryptoGraph = <CryptoListGraph id='cryptoListGraph' pickedCurrency={this.state.filteredGraphData} />
    // console.log('check filtered Data::::', this.state.renderGraph, this.state.filteredGraphData);
    return (
      <div style={styles.border} className="cryptoContainer">
        <h1 className="header cryptoHeader">Track the Price of Your Favorite Cryptocurrency</h1><br /><br />
        {cryptoGraph}
        <div className="crypto-grid">
          <Autosuggest
            className="autosuggest"
            theme={theme}
            suggestions={this.state.suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={this.getSuggestionValue}
            renderSuggestion={this.renderSuggestion}
            inputProps={inputProps}
          />
          <button style={{float: 'left'}} className="cryptoSearchBtn btn btn-primary" onClick={this.toggleModal}>Search</button>
        </div>
        <label id="cryptoListLabel">Crypto Currency Lists</label>
        <ListGroup className="listGroup">
          {this.state.savedCurrencyLists.map((currency) => {
            const priceDifference = currency.recentSeries[0].price - currency.recentSeries[1].price;
            const percentageDifference = priceDifference / currency.recentSeries[1].price * 100;
            const rounded = Math.round(percentageDifference * 100) / 100;
            return (
              <ListGroupItem className="groupItem" key={currency.symbol} header={currency.name} id={currency.symbol}>
                <button className="btn btn-primary cryptoChart" id={currency.symbol} onClick={this.renderGraph} >Show Chart</button>
                {currency.symbol}
                {"        " + rounded}
              </ListGroupItem>
            );
          })}
        </ListGroup>
        {this.popOutSearch()}
      </div>
    );
  }
}

export default CryptoCurrency;
