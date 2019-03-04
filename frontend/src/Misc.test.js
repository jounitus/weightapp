// @flow

import React from 'react';
import ReactDOM from 'react-dom';

import {formatDate, formatWeight} from './Misc'


it('formatWeight should format correctly', () => {

    expect(formatWeight(120)).toMatch("120 kg")

});

it('formatWeight should handle null', () => {

    expect(formatWeight(null)).toMatch("")

});

it('formatDate should format correctly', () => {

    expect(formatDate("2018-03-03")).toMatch("d: 2018-03-03")

});

it('formatDate should handle null', () => {

    expect(formatDate(null)).toMatch("")

});
