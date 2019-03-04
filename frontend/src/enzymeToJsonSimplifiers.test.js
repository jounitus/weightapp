import React from 'react';
import { shallow } from 'enzyme';

import {simplifyWrapper, listifyWrapper} from "./enzymeToJsonSimplifiers";


test('simplifyWrapper should handle simple components', () => {

    const wrapper = shallow(<div className="myClass" id="myDiv" />);

    expect(simplifyWrapper(wrapper)).toEqual({
        type: "div",
        props: { className: "myClass", id: "myDiv" },
        children: null
    });

});

test('simplifyWrapper should handle components and text nodes correctly', () => {

    const wrapper = shallow(<div>This is <strong className="extraBold">Extra Bold</strong> example text</div>);

    expect(simplifyWrapper(wrapper)).toEqual({
        type: "div",
        props: {},
        children: [
            "This is ",
            {children: ["Extra Bold"], props: {className: "extraBold"}, type: "strong"},
            " example text"
        ],
    });

});

test('listifyWrapper should handle components and text nodes correctly', () => {

    const wrapper = shallow(<div>This is <strong className="extraBold">Extra Bold</strong> example text</div>);

    expect(listifyWrapper(wrapper)).toEqual(
        [
            "div", {}, [
                "This is ",
                ["strong", {className: "extraBold"}, ["Extra Bold"]],
                " example text"
            ]
        ]);

});