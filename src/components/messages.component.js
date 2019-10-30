import React,{Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import Alert from './alert.component'
import AuctionModal from './auctionModal.component';
import Auctions from './auctions.component';
import { clearErrors} from '../actions/errorActions';
import {searchMessages } from '../actions/messagesActions';
import {searchMessageAuctions} from '../actions/auctionsActions';
class Messages extends Component {
    static propTypes = {
        isAdmin: PropTypes.string.isRequired,
        isAuthenticated: PropTypes.string.isRequired,
        isListed: PropTypes.bool.isRequired,
        messages : PropTypes.object.isRequired,
        user :  PropTypes.string.isRequired,
        auctions : PropTypes.object.isRequired,
        ratings :PropTypes.object.isRequired,
        error :PropTypes.object.isRequired
    };
    constructor(props){
        super(props);
        this.onSelect=this.onSelect.bind(this);
        this.renderTableRows=this.renderTableRows.bind(this);
        this.state={
            key :"inbox"
        };
    }
    onSelect(key){
        this.setState({
            key:key
        });
    }
    componentDidMount(){
        this.props.searchMessages({search:"inbox"})
    }
    componentDidUpdate(prevProps,prevState){
        if(prevProps.user!==this.props.user ||
            (this.state.key!=="new" && prevState.key!==this.state.key)){
            this.props.searchMessages({search:this.state.key})
            this.props.clearErrors()
        }
        else if(this.state.key==="new" && prevState.key!==this.state.key){
            this.props.searchMessageAuctions();
            this.props.clearErrors()
        }
    }
    componentWillUnmount(){
      this.props.clearErrors();
    }
    renderTableRows(){
      const { messages } = this.props.messages;
      const { ratings } = this.props.ratings;
      return messages.map((msg)=>{
        const {_id,auctionId,sender,receiver,message,seen}=msg;
        const {auctions} = this.props.auctions;
        const auction=auctions.filter((auction)=>auction._id===auctionId);
        if(auction.length!==0)
        return(
          <tr  key={_id} style={{width:"20%",overflow: "visible"}}>
            <td style={{width:"20%"}} key="sender">{sender}</td>
            <td style={{width:"20%"}} key="receiver">{receiver}</td>
            <td style={{width:"20%"}} key="message">{message}</td>
            <td style={{width:"20%"}}>
                <AuctionModal button="Show Message" auction={auction[0]} 
                    user={this.props.user} show={this.state.key} message={message}
                    msgID={_id} seen={seen} 
                    rating={ratings.filter((x)=>x.auction_id===auction[0]._id)}
                />
            </td>
          </tr>
        );else return (null); 
      });
    }
    render(){
        if(this.props.isAdmin==="undefined") return ((null));
        var messages=null;
        if(this.state.key!=="new")
            messages=(
                <Table striped bordered hover variant="dark" key="categories" size="sm">
                        <thead>
                            <tr style={{overflow: "visible"}}>
                                <th>Sender</th>
                                <th>Receiver</th>
                                <th>Message</th>
                                <th>Show</th>              
                            </tr>           
                        </thead>
                    <tbody>
                        {this.renderTableRows()}
                    </tbody>   
                </Table>
            );
        return (
            this.props.isAdmin==="true" ?
              <Alert  variant="danger" myKey=""
                msg={"Admin you are not supposed to be here ... !"} />
            :
            this.props.isAuthenticated==="false" ?
                <Alert variant="danger" myKey="" msg={"You are not signed in ! "}/>
            :
            this.props.isListed===false ?
                <Alert  variant="danger" msg={"You are not yet accepted by the admin of our page ! "} myKey="" />
            :
            [(this.state.key!=="new" && this.props.error.msg!==false?
                <Alert myKey="error" variant="danger" 
                  msg={this.props.error.msg} />:(null)
            ),
            (<Tabs key="tabs" style={{textAlign:"center"}} onSelect={this.onSelect}
                activeKey={this.state.key}>
                <Tab eventKey="inbox" title="Inbox">
                    {messages}
                </Tab>
                <Tab eventKey="sent" title="Sent">
                    {messages}
                </Tab>
                <Tab eventKey="new" title="New Message">
                    <Auctions displayType="new"/>
                </Tab>
            </Tabs>)]
        );
    }
}
const mapStateToProps = state => ({
  isAdmin: state.auth.isAdmin,
  isAuthenticated : state.auth.isAuthenticated,
  isListed :state.auth.isListed,
  messages : state.messages,
  user : state.auth.user,
  auctions : state.auctions,
  ratings : state.ratings,
  error : state.error
});
export default connect(
  mapStateToProps,
  {searchMessages,clearErrors,searchMessageAuctions}
)(Messages);