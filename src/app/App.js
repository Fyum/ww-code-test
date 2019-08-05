/** @jsx jsx */
import { jsx } from '@emotion/core';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import ViewContribution from './components/ViewContribution';

const App = ({ store }) =>
  <Provider store={store}>
    <ViewContribution />
  </Provider>;

App.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default App;
