import {Calculator} from "../calculator.jsx";

import React from "react/addons";
let TestUtils = React.addons.TestUtils;

describe('Calculator', () => {

  it('initialises correctly', () => {
      let calculator = TestUtils.renderIntoDocument(React.createElement(Calculator));
      let buttons = TestUtils.scryRenderedDOMComponentsWithTag(calculator, 'button');
      expect(buttons.length).toEqual(12);
      
      let operand = TestUtils.findRenderedDOMComponentWithClass(calculator, 'adder-operand');
      expect(operand.props.children).toEqual(0); 

      let total = TestUtils.findRenderedDOMComponentWithClass(calculator, 'adder-total');
      expect(total.props.children).toEqual(0); 
  });

  it('handles digit clicks', () => {
      let calculator = TestUtils.renderIntoDocument(React.createElement(Calculator));

      let digits = TestUtils.scryRenderedDOMComponentsWithClass(calculator, 'adder-button-digit');
      let digit = digits[0];
      
      TestUtils.Simulate.click(digit);
      
      let operand = TestUtils.findRenderedDOMComponentWithClass(calculator, 'adder-operand');
      expect(operand.props.children).toEqual(digit.props.children); 
  });

  it('handles add button click', () => {
      let calculator = TestUtils.renderIntoDocument(React.createElement(Calculator));

      let digits = TestUtils.scryRenderedDOMComponentsWithClass(calculator, 'adder-button-digit');
      let digit = digits[0];
      
      TestUtils.Simulate.click(digit);

      let operand = TestUtils.findRenderedDOMComponentWithClass(calculator, 'adder-operand');
      expect(operand.props.children).toEqual(digit.props.children); 

      let add = TestUtils.findRenderedDOMComponentWithClass(calculator, 'adder-button-add');
      TestUtils.Simulate.click(add);
      
      let total = TestUtils.findRenderedDOMComponentWithClass(calculator, 'adder-total');
      expect(total.props.children).toEqual(digit.props.children);       
      expect(operand.props.children).toEqual(0); 
  });

  it('handles clear button click', () => {
      let calculator = TestUtils.renderIntoDocument(React.createElement(Calculator));

      let digits = TestUtils.scryRenderedDOMComponentsWithClass(calculator, 'adder-button-digit');
      let digit = digits[0];
      
      TestUtils.Simulate.click(digit);

      let clear = TestUtils.findRenderedDOMComponentWithClass(calculator, 'adder-button-clear');
      TestUtils.Simulate.click(clear);
      
      let operand = TestUtils.findRenderedDOMComponentWithClass(calculator, 'adder-operand');
      expect(operand.props.children).toEqual(0); 

      let total = TestUtils.findRenderedDOMComponentWithClass(calculator, 'adder-total');
      expect(total.props.children).toEqual(0);       
  });

});
