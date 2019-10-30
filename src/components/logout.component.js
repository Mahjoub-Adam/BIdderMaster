import {Component} from 'react';
import { connect } from 'react-redux';
import { logout } from '../actions/authActions';
import { clearErrors} from '../actions/errorActions';
import { clearFormErrors} from '../actions/formErrorActions';
export class Logout extends Component {
  componentDidMount(){
    this.props.logout();
    this.props.history.push('/');
  }
  render(){
    return(null);
  }
}

export default connect(
  null,
  { logout,clearFormErrors,clearErrors }
)(Logout);