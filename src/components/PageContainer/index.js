import { connect } from "react-redux"
import * as pageActions from "../../redux/modules/pages"

import PageContainer from "./component"

export default connect(
  ({ pages }) => {
    return { pages }
  },
  (dispatch) => {
    return {
      getPage: (...args) => dispatch(pageActions.get(...args)),
      setPageNotFound: (...args) => dispatch(pageActions.setNotFound(...args)),
    }
  },
)(PageContainer)
