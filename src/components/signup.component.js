import React,{Component} from 'react';
import { register } from '../actions/authActions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { clearErrors } from '../actions/errorActions';
import {
  Button,
  Form,
  InputGroup,
  FormControl
} from 'react-bootstrap';
import Alert from './alert.component'
class Signup extends Component {
    static propTypes = {
        isAuthenticated: PropTypes.string.isRequired,
        error: PropTypes.object.isRequired
    }; 
    constructor(props){
        super(props);
        this.onChangeUsername=this.onChangeUsername.bind(this);
        this.onChangePassword=this.onChangePassword.bind(this);
        this.onChangeVerifyPassword=this.onChangeVerifyPassword.bind(this);
        this.onChangeName=this.onChangeName.bind(this);
        this.onChangeSurname=this.onChangeSurname.bind(this);
        this.onChangeEmail=this.onChangeEmail.bind(this);
        this.onChangePhoneNumber=this.onChangePhoneNumber.bind(this);
        this.onChangeAddress=this.onChangeAddress.bind(this);
        this.onChangeAFM=this.onChangeAFM.bind(this);
        this.onSubmit=this.onSubmit.bind(this);
        this.onChangeCountry=this.onChangeCountry.bind(this);
        this.state= {
            username:'',
            password:'',
            verifyPassword:'',
            name:'',
            surname:'',
            email:'',
            PhoneNumber:'',
            address:'',
            socialNumber:'',
            msg:'',
            country:""
        }
    }
    componentWillUnmount(){
       this.props.clearErrors();
    }
    onChangeUsername(e){
        this.setState({
            username:e.target.value
        });
    }
    onChangeCountry(e){
        this.setState({
            country:e.target.value
        });
    }
    onChangePassword(e){
        this.setState({
            password:e.target.value
        });
    }
    onChangeVerifyPassword(e){
        this.setState({
            verifyPassword:e.target.value
        });
    }
    onChangeName(e){
        this.setState({
            name:e.target.value
        });
    }
    onChangeSurname(e){
        this.setState({
            surname:e.target.value
        });
    }
    onChangeEmail(e){
        this.setState({
            email:e.target.value
        });
    }
    onChangePhoneNumber(e){
        this.setState({
            PhoneNumber:e.target.value
        });
    }
    onChangeAddress(e){
        this.setState({
            address:e.target.value
        });
    }
    onChangeAFM(e){
        this.setState({
            socialNumber:e.target.value
        });
    }
    onSubmit(e){
        e.preventDefault();
        var error="";
        if(!/^[a-zA-Z0-9_]+$/.test(this.state.username))
            error+="Username not valid ! Only alphanumeric characters and '_' character are allowed !"
        else if(this.state.username[0]==="_" || !isNaN(this.state.username[0]))
            error+="Username name must start with a letter ! "
        else if((this.state.username.length<6)) 
            error+="Username must have at least 6 characters ! "
        if((this.state.password.length<8)) 
            error+="Passwords must have at least 8 characters ! "
        if(!/^[a-zA-Z]+$/.test(this.state.name))
            error+="Name not valid ! Only letters are allowed !"
        if(!/^[a-zA-Z]+$/.test(this.state.surname))
            error+="Surname not valid ! Only letters are allowed !"
        else if(this.state.password!==this.state.verifyPassword) 
            error+="Password are not the same !";
        if(!/^[a-zA-Z0-9 ]+$/.test(this.state.address))
            error+="Address not valid ! Only alphanumeric characters are allowed !"
        else if(this.state.username[0]==="_" || !isNaN(this.state.username[0]))
            error+="Address must start with a letter ! "
        if(isNaN(this.state.PhoneNumber)) 
            error+="Phone Number can only have digits !";
        else if(this.state.PhoneNumber.length!==10) 
            error+="Phone Number must be 10 digits !";
        if(isNaN(this.state.socialNumber)) 
            error+="Social Number can only have digits !";
        else if(this.state.socialNumber.length!==10) 
            error+="Social Number must be 10 digits !";
        if(!/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i.test(this.state.email))
            error+="Email not valid(Valid example : test@gmail.com) !";
        if(error!==""){
            this.setState({
                msg: error
            });
            return;
        }
        this.setState({
            msg: ""
        });
        e.preventDefault();
         const newUser = {
            username:this.state.username,
            password:this.state.password,
            verifyPassword:this.state.verifyPassword,
            name:this.state.name,
            surname:this.state.surname,
            email:this.state.email,
            PhoneNumber:this.state.PhoneNumber,
            address:this.state.address,
            AFM:this.state.socialNumber,
            country:this.state.country,
        };
        this.props.register(newUser);         
    }
    componentDidUpdate(prevProps){
        const { error, isAuthenticated, } = this.props;
        if (error !== prevProps.error) {
            if (error.id === 'REGISTER_FAIL') this.setState({ msg: error.msg })
            else this.setState({ msg: '' });
        }
        if(isAuthenticated==="true"){
            this.props.clearErrors();
            this.props.history.push("/");
        }
    }
    render(){
        if(this.props.isAuthenticated==="undefined") return((null));
        return (
                <div>
                    {this.props.isAuthenticated==="true" ? 
                        <Alert  variant="danger" myKey="alert"
                            msg={"You are already logged in !"} />
                    :
                    <div>
                        {this.state.msg!==""?
                            <Alert myKey="alert" variant="danger" 
                                msg={this.state.msg} />
                            :
                            (null)
                        }
                        <h4>Give your signup info </h4>
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
                            <InputGroup className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="verifyPasswordLabel">Verify Password</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    required
                                    type="Password"
                                    placeholder={this.state.verifyPassword}
                                    value={this.state.verifyPassword}
                                    onChange={this.onChangeVerifyPassword}
                                    aria-label="verifyPassword"
                                    aria-describedby="verifyPasswordLabel"
                                />
                            </InputGroup>
                            <InputGroup className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="nameLabel">Name</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    required
                                    placeholder={this.state.name}
                                    value={this.state.name}
                                    onChange={this.onChangeName}
                                    aria-label="name"
                                    aria-describedby="nameLabel"
                                />
                            </InputGroup>
                            <InputGroup className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="surnameLabel">Surname</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    required
                                    placeholder={this.state.surname}
                                    value={this.state.surname}
                                    onChange={this.onChangeSurname}
                                    aria-label="surname"
                                    aria-describedby="surnameLabel"
                                />
                            </InputGroup>
                            <InputGroup className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="emailLabel">E-mail</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    required
                                    placeholder={this.state.email}
                                    value={this.state.email}
                                    onChange={this.onChangeEmail}
                                    aria-label="email"
                                    aria-describedby="emailLabel"
                                />
                            </InputGroup>
                            <InputGroup className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="PhoneNumberLabel">Phone Number</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    required
                                    placeholder={this.state.PhoneNumber}
                                    value={this.state.PhoneNumber}
                                    onChange={this.onChangePhoneNumber}
                                    aria-label="PhoneNumber"
                                    aria-describedby="PhoneNumberLabel"
                                />
                            </InputGroup>
                            <InputGroup className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="addressLabel">Address</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    required
                                    placeholder={this.state.address}
                                    value={this.state.address}
                                    onChange={this.onChangeAddress}
                                    aria-label="address"
                                    aria-describedby="addressLabel"
                                />
                            </InputGroup>
                            <InputGroup className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="countryLabel">Country</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    required
                                    placeholder={this.state.country}
                                    value={this.state.country}
                                    onChange={this.onChangeCountry}
                                    aria-label="country"
                                    aria-describedby="countryLabel"
                                />
                            </InputGroup>
                            <InputGroup className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="socialNumberLabel">Social Number</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    required
                                    placeholder={this.state.socialNumber}
                                    value={this.state.socialNumber}
                                    onChange={this.onChangeAFM}
                                    aria-label="socialNumber"
                                    aria-describedby="socialNumberLabel"
                                />
                            </InputGroup>
                            <Button  color='dark' type="submit" style={{backgroundColor:"green",
                            borderColor:"green"}} block>
                            Sign Up
                            </Button>  
                        </Form>
                    </div>
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error
});

export default connect(
  mapStateToProps,
  { register,clearErrors }
)(Signup);