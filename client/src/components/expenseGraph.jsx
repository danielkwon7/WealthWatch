import React from 'react';
import {Pie} from 'react-chartjs-2';

export default class ExpenseGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryValues: {},
    };
    this.accumulateExpenses = this.accumulateExpenses.bind(this);
  }

  componentWillReceiveProps() {
    this.accumulateExpenses(this.props.oneExpenses, this.props.recExpenses);
  }


  accumulateExpenses(oneEx, recEx) {
    const result = {};
    for (let i = 0; i < oneEx.length; i++) {
      const {category, amount} = oneEx[i];
      if (!result[category]) {
        result[category] = amount;
      } else {
        result[category] += amount;
      }
    }
    for (let i = 0; i < recEx.length; i++) {
      const {category, amount} = recEx[i];
      if (!result[category]) {
        result[category] = amount;
      } else {
        result[category] += amount;
      }
    }
    this.setState({ categoryValues: {...this.state.categoryValues, ...result} });
  }

  renderExpensePie() {
    var data = {
      datasets: [{
        label: 'Your Expenses by Category',
        data: Array.from(Object.values(this.state.categoryValues)),
        backgroundColor: [
          'rgba(100,181,246 ,1)',
          'rgba(77,182,172 ,1)',
          '#FFEB3B',
          'rgba(255,183,77 ,1)',
          'rgba(229,115,115 ,1)'
        ],
      }],
      labels:
        ['Entertainment(%)', 'Food(%)', 'Rent(%)', 'Utilities(%)', 'Others(%)']
      ,
    }
    var ctx = document.getElementById('expensePie');
    var expensePie = new Chart(ctx, {
      type: 'pie',
      data: data,
      options: {
            animatable: true,
            segmentShowStroke : true,
            segmentStrokeColor : "#fff",
            segmentStrokeWidth : 2,
            percentageInnerCutout : 0,
            animationSteps : 100,
            animationEasing : "easeOutBounce",
            animateRotate : true,

      },
    })
  }



  render() {
    console.log('Category Values: ', this.state.categoryValues);
    return (
      <div>
        <canvas id="expensePie" render={this.renderExpensePie}/>
        {/*<Pie
          data: data,
          options: {
            animatable: true,
            segmentShowStroke : true,
            segmentStrokeColor : "#fff",
            segmentStrokeWidth : 2,
            percentageInnerCutout : 0,
            animationSteps : 100,
            animationEasing : "easeOutBounce",
            animateRotate : true,
        />*/}
        <Pie render={this.renderExpensePie} />
        Hello
      </div>
    );
  }
}
