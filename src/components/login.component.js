import React,{Component} from 'react';
import {connect} from 'react-redux';
import {login} from '../actions/authActions.js'
import { clearFormErrors } from '../actions/formErrorActions';
import PropTypes from 'prop-types';
import {
  Button,
  Form,
  InputGroup,
  FormControl
} from 'react-bootstrap';
import Alert from './alert.component'
class Login extends Component {
     static propTypes = {
            formError: PropTypes.object.isRequired
        };
    constructor(props){
        super(props);
        this.onChangeUsername=this.onChangeUsername.bind(this);
        this.onChangePassword=this.onChangePassword.bind(this);
        this.onSubmit=this.onSubmit.bind(this);
        this.state= {
            username:'',
            password:'',
            isListed: true
        };
       
    }
    onChangeUsername(e){
        this.setState({
            username:e.target.value
        });
    }
    onChangePassword(e){
        this.setState({
            password:e.target.value
        });
    }
    onSubmit(e){
        e.preventDefault();
        const user={
            username:this.state.username,
            password:this.state.password
        }
        this.props.login(user);       
    }
    componentWillUnmount(){
       this.props.clearFormErrors();
    }
    render(){
        return (
            <div>
                {this.props.formError.msg!==""?
                  <Alert key="error" show={true} variant="danger"
                    msg={this.props.formError.msg} />
                    :(null)
                }
                <Form onSubmit={this.onSubmit}>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="usernameLabel">Username</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            required
                            placeholder={this.state.username}
                            value={this.state.username}
                            onChange={this.onChangeUsername}
                            aria-label="username"
                            aria-describedby="usernameLabel"
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="passwordLabel">Password</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            required
                            type="password"
                            placeholder={this.state.password}
                            value={this.state.password}
                            onChange={this.onChangePassword}
                            aria-label="password"
                            aria-describedby="passwordLabel"
                        />
                    </InputGroup>
                    <Button  color='dark' type="submit" style={{
                        backgroundColor:"green",borderColor:"green"}} block>
                        Login
                    </Button> 
                </Form>
            </div>
        )
    }
}
const mapStateToProps = state => ({
  formError: state.formError
});
export default connect(mapStateToProps,{login,clearFormErrors})(Login);