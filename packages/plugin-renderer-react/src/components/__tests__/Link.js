// @flow

/* eslint-disable react/no-multi-comp */

import * as React from "react";
import { renderJSX } from "jsx-test-helpers";

import Link from "../Link";

test("Link works with ``to``", () => {
  expect(renderJSX(<Link to="/b">{"c"}</Link>)).toMatchSnapshot();
});

test("Link onPress/onClick", () => {
  const onPress = jest.fn();
  renderJSX(
    <Link to="/b" onPress={onPress}>
      {"c"}
    </Link>,
    render => render.props.onPress({})
  );
  expect(onPress).toHaveBeenCalled();

  const onClick = jest.fn();
  renderJSX(
    <Link to="/b" onClick={onClick}>
      {"c"}
    </Link>,
    render => render.props.onClick({})
  );
  expect(onClick).toHaveBeenCalled();
});

test("Link works with ``href``", () => {
  expect(renderJSX(<Link href="/b">{"c"}</Link>)).toMatchSnapshot();
});

test("Link works with external ``href``", () => {
  expect(renderJSX(<Link href="http://b.com">{"c"}</Link>)).toMatchSnapshot();
});

test("Link works with external ``href``", () => {
  expect(renderJSX(<Link href="http://b.com">{"c"}</Link>)).toMatchSnapshot();
});

test("Link works with internal ``href``", () => {
  expect(
    renderJSX(<Link href="http://url.tld/internal">{"c"}</Link>)
  ).toMatchSnapshot();
  expect(renderJSX(<Link href="/internal">{"c"}</Link>)).toMatchSnapshot();
});

test("Link activeClassName?", () => {
  expect(
    renderJSX(
      <Link href="/internal" activeClassName="activeCx">
        {"c"}
      </Link>,
      {
        router: { isActive: () => true }
      }
    )
  ).toMatchSnapshot();
  expect(
    renderJSX(
      <Link href="/internal" activeClassName="activeCx">
        {"c"}
      </Link>,
      {
        router: { isActive: () => false }
      }
    )
  ).toMatchSnapshot();
});

/* eslint-disable react-native/no-inline-styles */
test("Link activeStyle?", () => {
  expect(
    renderJSX(
      <Link href="/internal" activeStyle={{ color: "blue" }}>
        {"c"}
      </Link>,
      {
        router: { isActive: () => true }
      }
    )
  ).toMatchSnapshot();
  expect(
    renderJSX(
      <Link href="/internal" activeStyle={{ color: "blue" }}>
        {"c"}
      </Link>,
      {
        router: { isActive: () => false }
      }
    )
  ).toMatchSnapshot();
});
/* eslint-enable react-native/no-inline-styles */
