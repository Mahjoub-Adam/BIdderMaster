import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import {
  Navbar,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu 
} 
from 'reactstrap';
import { Row,Col } from 'reactstrap';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {GoRuby,GoSignOut,GoSignIn,GoPrimitiveDot } from "react-icons/go";
import {IoMdPersonAdd,IoMdPerson} from "react-icons/io";
import Login from "./login.component";
import Stars from "./stars.component";
class MyNavBar extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.string.isRequired, 
    isAdmin: PropTypes.string.isRequired,
    user : PropTypes.string.isRequired,
    rating : PropTypes.string.isRequired,
    newMessages: PropTypes.string.isRequired
  };
  render() {
    if(this.props.isAuthenticated==="undefined") return ((null));
    if(this.props.isAuthenticated==="false"){
      return (    
        <Navbar color="light" light expand="md">
            <Link to="/"  className="navbar-brand">
              <GoRuby/> BidderMaster
            </Link>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <Link to="/users/signup"  className="nav-link">
                     <IoMdPersonAdd/> Signup
                  </Link>
                </NavItem>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    <GoSignIn/> Login
                  </DropdownToggle>
                  <DropdownMenu style={{width:"250px"}} right>
                      <Login/>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>
        </Navbar>
      );
    }
    else {
      if(this.props.isAdmin==="true"){
        return (
          <Navbar color="light" light expand="md">
            <Link to="/"  className="navbar-brand">
              <GoRuby/> BidderMaster
            </Link>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <Link to="/users/categories"  className="nav-link">
                     Catetogies
                  </Link>
                </NavItem>
                <NavItem>
                  <Link to="/users/downloads"  className="nav-link">
                     Downloads
                  </Link>
                </NavItem>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    <IoMdPerson/> {this.props.user}
                  </DropdownToggle>
                  <DropdownMenu  right>
                    <Link to="/users/logout"  className="nav-link">
                      <GoSignOut/> Logout
                    </Link>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>
        </Navbar> 
        );
      }
      return (    
        <Navbar color="light" light expand="md">
            <Link to="/"  className="navbar-brand">
              <GoRuby/> BidderMaster
            </Link>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <Link to="/users/myAuctions"  className="nav-link">
                    My Auctions
                  </Link>
                </NavItem>
                <NavItem>
                  <Link to="/users/myBids"  className="nav-link">
                    My Bids
                  </Link>
                </NavItem>
                <NavItem>
                  <Link to="/users/myRatings"  className="nav-link">
                    My Ratings
                  </Link>
                </NavItem>
                <NavItem>
                  <Link to="/users/myMessages"  className="nav-link">
                    <span >My Messages</span>
                    {this.props.newMessages==="true"?
                      <span ><GoPrimitiveDot color="red"/></span>
                      :
                      (null)
                    }
                  </Link>
                </NavItem>
                <Col>
                  <Row>
                    <UncontrolledDropdown nav inNavbar>
                      <DropdownToggle nav caret>
                        <IoMdPerson/> {this.props.user}
                      </DropdownToggle>
                      <DropdownMenu  right>
                        <Link to="/users/logout"  className="nav-link">
                          <GoSignOut/> Logout
                        </Link>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </Row>
                  <Row>
                    {String(this.props.rating)==="Not Rated"?(null)
                      :<Stars stars={this.props.rating} editing={false}/>}
                  </Row>
                </Col>
              </Nav>
        </Navbar>   
      );
    }
  }
}
const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isAdmin: state.auth.isAdmin,
  user: state.auth.user,
  rating : state.auth.rating,
  newMessages : state.auth.newMessages
});
export default connect(mapStateToProps)(MyNavBar);