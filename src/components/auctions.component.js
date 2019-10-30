import React, { Component } from 'react';
import { Container, ListGroup,ListGroupItem, Button,Table} 
from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import Image from 'react-bootstrap/Image'
import { Row, Col } from 'reactstrap';
import { getCategories } from '../actions/categoriesActions';
import PropTypes from 'prop-types';
import AuctionModal from './auctionModal.component';
import SearchCollapse from './searchCollapse.component';
import { searchAllAuctions,searchMyAuctions,searchMyBids,searchMyRatings,searchDownloads} 
from '../actions/auctionsActions';
import { clearErrors} from '../actions/errorActions';
import Alert from './alert.component'
class Auctions extends Component {
    static propTypes = {
      auctions: PropTypes.object.isRequired,
      categories: PropTypes.object.isRequired,
      isAuthenticated: PropTypes.string.isRequired,
      isAdmin: PropTypes.string.isRequired,
      user :  PropTypes.string.isRequired,
      isListed: PropTypes.bool.isRequired,
      error : PropTypes.object.isRequired,
      ratings:PropTypes.object.isRequired
    };
    constructor(props){
      super(props);
      this.renderCategories=this.renderCategories.bind(this);
      this.searchChange=this.searchChange.bind(this);
      this.onChange=this.onChange.bind(this);
      this.state= {
            displayType:this.props.displayType,
            change: false,
            search:false,
            msg : "You can only browse all auctions' section in the main page !",
            value:"Current"
        };
    }
    componentDidMount() {
      this.props.getCategories();
      const {categories}=this.props.categories;
      const search={
        name:"",
        categories: categories.map((x)=>{return x.name}),
        min:0,
        max:Number.MAX_VALUE,
        description:"",
        location:{
          lon:-0.481747846041145, 
          lat:51.3233379650232
        },
        Km:Number.MAX_VALUE
      };
      if(this.state.displayType==="All Auctions")
        this.props.searchAllAuctions(search);
      else if(this.state.displayType==="My Auctions")
        this.props.searchMyAuctions({...search,...{new_old:"Current"}});
      else if(this.state.displayType==="My Bids")
        this.props.searchMyBids({...search,...{new_old:"Current"}});
      else if(this.state.displayType==="My Ratings")
        this.props.searchMyRatings(search);
      else if(this.state.displayType==="downloads")
          this.props.searchDownloads(search);
    
    }
    componentWillUnmount(){
      this.props.clearErrors();
    }
    componentDidUpdate(prevProps,prevState) {
      const {categories}=this.props.categories;  
      if(prevProps.user!==this.props.user ||
        prevState.value!==this.state.value){
        this.props.clearErrors(); 
        const search={
          name:"",
          categories: categories.map((x)=>{return x.name}),
          min:0,
          max:Number.MAX_VALUE,
          description:"",
          location:{
            lon:-0.481747846041145, 
            lat:51.3233379650232
          },
          Km:Number.MAX_VALUE,
        };
        if(this.state.displayType==="All Auctions")
          this.props.searchAllAuctions(search);
        else if(this.state.displayType==="My Auctions")
          this.props.searchMyAuctions({...search,...{cur_old:this.state.value}});
        else if(this.state.displayType==="My Bids")
          this.props.searchMyBids({...search,...{cur_old:this.state.value}});
        else if(this.state.displayType==="My Ratings")
          this.props.searchMyRatings(search);
        else if(this.state.displayType==="downloads")
          this.props.searchDownloads(search);
      }
      if(this.state.change===true) 
        this.setState({
          change : false
        });      
    }
    searchChange(search,change,value){
      this.setState({
        search : search,
        change : change,
        value :value
      });
    }
    onChange(e){
      this.setState({
        value:e.target.value
      })
    }
    renderCategories(categories){
      var all="";
      categories.map((category)=>{
          all+=","+category;
          return "";
          });
      return all.substr(1);
    }
    render() {
      const { auctions } = this.props.auctions;
      const {ratings}=this.props.ratings;
      const emptyAuction={
        id:"", 
        name:"", 
        categories:[],
        buy_price:2, 
        first_bid:1, 
        country:"", 
        address:"",
        coords:[],
        description:"",
        images:[]
      };
      if(this.props.isAuthenticated==="undefined") return ((null));
      const ba=this.state.displayType==="My Auctions"?"Auctions":"Bids";
      const width=this.state.displayType==="My Auctions"? "70%":"100%";
      return (
        <div> 
          {this.props.isAdmin==="true" && this.props.displayType!=="downloads"?
              <Alert  variant="danger" myKey=""
                msg={"Admin you are not supposed to be here ... !"} />
            :
            this.props.isAdmin!=="true" && this.props.displayType==="downloads"?
              <Alert  variant="danger" myKey=""
                msg={"Only admin has the right to this page !"} />
            :
            this.props.isAuthenticated==="false" &&
            this.props.displayType!=="All Auctions" ?
              <Alert variant="danger" myKey="" msg={"You are not signed in ! "}/>
            :
            this.props.isListed===false  &&
            this.props.displayType!=="All Auctions" && this.props.displayType!=="downloads"?
              <Alert  variant="danger" msg={"You are not yet accepted by the admin of our page ! "} myKey="" />
            :
            <Container>
              {this.props.isAuthenticated==="false" && 
              this.props.displayType==="All Auctions" ? 
                <Alert myKey="alert" variant="warning" msg={"You are not signed in ! "} />
                :
                this.props.isListed===false && 
                this.props.displayType==="All Auctions" ? 
                  <Alert myKey="warning" variant="warning" msg={" You are not yet accepted by the admin of our page ! "} />
                :(null)
              }
              {this.props.error.msg!==false?
                <Alert myKey="error" variant="danger" 
                  msg={this.props.error.msg} />
                :
                (null)
              }
              {this.state.displayType==="My Bids" ||
                this.state.displayType==="My Auctions"?
                <select value={this.state.value} onChange={this.onChange} style={{width:"100%",
                  textAlign:"center",backgroundColor:"transparent"}}>
                  <option value="Current">{`Current ${ba}`}</option>
                  <option value="Old">{`Old ${ba}`}</option>
                </select>
                :
                (null)
              }
              <div style={{dispay:"flex",flexDirection: "row"}}>
                {this.state.displayType==="My Auctions" ?
                  <AuctionModal change={this.searchChange}
                    button="New Auction" auction={emptyAuction} show="add"
                  />
                  :
                  (null)
                }
                {this.state.displayType!=="new"?
                <SearchCollapse displayType={this.state.displayType}
                  change={this.searchChange} width={width} value={this.state.value}
                />:(null)}        
              </div>
              
              {this.state.search?
                <div style={{dispay:"flex",flexDirection: "row"}}>
                  <Button color='dark' 
                    style={{backgroundColor:"red",borderColor:"red",width:"20%",
                    float:"left"}} onClick={()=>this.searchChange(false,true,this.state.value)}> Clear Results
                  </Button>
                  <h2 style={{textAlign:"center",flex:"right"}}>Search Results : </h2>
                </div>
                :
                (null)
              }
              <ListGroup>
                <TransitionGroup style={{dispay:"flex",flexDirection: "row"}} className='auction-list'>
                  {auctions.map((auction) => (
                    String(auction.ends)==="undefined" && this.state.displayType==="All Auctions" ?
                      (null)
                    :
                    <CSSTransition style={{float:"left",width:"50%"}}key={auction._id} timeout={500} classNames='fade'>
                      <ListGroupItem key={auction._id} style={{textAlign: "center"}} >
                        <Row > 
                          <Col  sm={3}
                            key={"col"+auction.images[0]}>
                            <Image style={{width:"100%",height:"90%"}} 
                              src={auction.images[0]} rounded/>
                          </Col>
                          <Col sm={9} >
                            <Table striped bordered hover variant="dark" 
                              style={{width:"100%",height:"90%"}} >
                              <thead>
                                <tr style={{overflow: "visible"}}>
                                  <th>Name</th>
                                  <th>{auction.name}</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr style={{overflow: "visible"}}>
                                  <td>Categories</td>
                                  <td>{this.renderCategories(auction.categories)}</td>
                                </tr>
                                <tr style={{overflow: "visible"}}>
                                  <td>Description</td>
                                  <td>{auction.description}</td>
                                </tr>
                              </tbody>
                            </Table>
                          </Col>
                        </Row>
                        <AuctionModal button="..." auction={auction} 
                          change={this.searchChange} user={this.props.user}
                          show={this.state.displayType}
                          message=""
                          rating={ratings.filter((x)=>
                            x.auction_id===auction._id)}/>   
                      </ListGroupItem>
                    </CSSTransition>                    
                  ))}
                </TransitionGroup>
              </ListGroup>
            </Container>
          }
        </div>
      );
    }
  }
  const mapStateToProps = state => ({
    auctions : state.auctions,
    categories : state.categories,
    isAuthenticated: state.auth.isAuthenticated,
    isAdmin:state.auth.isAdmin,
    user:state.auth.user,
    isListed:state.auth.isListed,
    error: state.error,
    ratings: state.ratings
  });
  
  export default connect(
    mapStateToProps,
    { searchAllAuctions,searchMyAuctions,getCategories,
    clearErrors,searchMyBids,searchMyRatings,searchDownloads}
  )(Auctions);