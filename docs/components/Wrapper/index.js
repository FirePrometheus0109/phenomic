import React from "react";
import { StyleSheet, View } from "react-primitives";
import Head from "react-helmet";

const Wrapper = (props: Object) => (
  <View style={styles.wrapper}>
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    {props.children}
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F2F5F8"
  }
});

export default Wrapper;
