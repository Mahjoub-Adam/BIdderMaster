import React,{Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Auctions from "./auctions.component"
import Check from "./check.component"
class MainPage extends Component {
    static propTypes = {
        isAdmin: PropTypes.string.isRequired,
    };
    render(){
        if(this.props.isAdmin==="undefined") return ((null));
        return(
            this.props.isAdmin==="false" ? <Auctions displayType="All Auctions"/> :
            <Check/>
        )
    }
}
const mapStateToProps = state => ({
  isAdmin: state.auth.isAdmin,
});
export default connect(
  mapStateToProps
)(MainPage);