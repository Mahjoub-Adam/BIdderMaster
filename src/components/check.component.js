import React, { Component } from 'react';
import { Button,Table } from 'reactstrap';
import { connect } from 'react-redux';
import { getUsers, editUsers, delUsers } from '../actions/checkActions';
import PropTypes from 'prop-types';
import { GoCheck,GoX } from "react-icons/go"; 
import { clearErrors} from '../actions/errorActions';
import Alert from './alert.component'  
class Check extends Component{
    static propTypes = {
        check: PropTypes.object.isRequired,
        isAdmin: PropTypes.string.isRequired,
        error : PropTypes.object.isRequired
    };
    componentDidMount() {
        this.props.getUsers();
    }
    componentWillUnmount(){
      this.props.clearErrors();
    }
    constructor(props){
      super(props);
      this.renderTableRows=this.renderTableRows.bind(this);
      this.AcceptFunction=this.AcceptFunction.bind(this);
      this.RejectFunction=this.RejectFunction.bind(this);
      this.state={
        change : false
      }
    }
    componentDidUpdate() {
      if(this.state.change){
        this.props.getUsers();
        this.props.clearErrors();
        this.setState({
          change: false
        });
      }
    }
    AcceptFunction(ID){
        this.setState({
         change: true
        });
        this.props.editUsers(ID);
    }

    RejectFunction(ID){
      this.setState({
        change: true
       });
      this.props.delUsers(ID);
    }
    renderTableRows(){
      const { checks } = this.props.check;
      return checks.map((user)=>{
        const {_id,username,name,surname,email,PhoneNumber,address,AFM}=user;
        return(
          <tr key={username}>
            <td key="username">{username}</td>
            <td key="email">{email}</td>
            <td key="name">{name}</td>
            <td key="surname">{surname}</td>
            <td key="PhoneNumber">{PhoneNumber}</td>
            <td key="address">{address}</td>
            <td key="AFM">{AFM}</td>
            <td key="buttons" style={{dispay:"flex",flexDirection: "row"}}>
              <Button color='dark' 
                style={{backgroundColor:"transparent",borderColor:"transparent",
                color:"green",width:"50%",float:"left"}}
                onClick={()=>this.AcceptFunction(_id)}><GoCheck/>
              </Button>  
              <Button color='dark' 
                style={{backgroundColor:"transparent",borderColor:"transparent",
                color:"red",width:"50%",float:"right"}}
                onClick={()=>this.RejectFunction(_id)}><GoX/>
              </Button>
            </td>
          </tr>
        );
      });
    }
    render(){
        if(this.props.isAdmin==="undefined") return ((null)); 
        return(
            <div>     
              {this.props.error.msg!==false ?
                <Alert variant="danger" msg={this.props.error.msg} myKey="" />
                :
                (null)
              }
              <Table striped bordered hover variant="dark" key="users">
                <thead>
                  <tr style={{overflow: "visible"}}>
                    <th>Username</th>
                    <th>E-mail</th>
                    <th>Name</th>
                    <th>Surname</th>
                    <th>Phone Number</th>
                    <th>Address</th>
                    <th>AFM</th>
                    <th>Actions</th>              
                  </tr>           
                </thead>
                <tbody>
                  {this.renderTableRows()}
                </tbody>          
              </Table>
            </div>
        )  
    }
}
const mapStateToProps = state => ({
  check: state.check,
  isAdmin: state.auth.isAdmin,
  error: state.error
});

export default connect(
  mapStateToProps,
  { getUsers,editUsers,delUsers,clearErrors }
)(Check);