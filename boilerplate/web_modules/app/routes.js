import React, { Component } from "react"
import { Route } from "react-router"

import LayoutContainer from "../LayoutContainer"
import StatinamicPageContainer from "statinamic/lib/PageContainer"

import Page from "../layouts/Page"
import PageError from "../layouts/PageError"

class PageContainer extends Component {
  render() {
    const { props } = this
    return (
      <StatinamicPageContainer
        { ...props }
        layouts={ {
          Page,
          PageError,
        } }
      />
    )
  }
}

export default (
  <Route component={ LayoutContainer }>
    <Route path="*" component={ PageContainer } />
  </Route>
)
