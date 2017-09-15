import * as React from "react";
import { createElement } from "react-native-web";

type PropsType = {
  start: string,
  end: string,
  direction?: string,
  style: any,
  children?: React.Node
};
const Div = props => createElement("div", props);
// eslint-disable-next-line react/no-multi-comp
const BackgroundGradient = (props: PropsType) => (
  <Div
    style={[
      rawStyles,
      makeGradient(props.start, props.end, props.direction),
      props.style
    ]}
  >
    {props.children}
  </Div>
);

const rawStyles = {
  display: "flex",
  flexDirection: "column"
};

const makeGradient = (start, end, direction = "to bottom right") => ({
  backgroundColor: start,
  background: `linear-gradient(${direction}, ${start}, ${end})`
});

export default BackgroundGradient;
