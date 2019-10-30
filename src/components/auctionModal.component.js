import React, { Component } from 'react';
import Dropzone from 'react-dropzone'
import Location from './location.component';
import Map from './map.component';
import Image from 'react-bootstrap/Image'
import { Row, Col } from 'reactstrap';
import {TiArrowBack } from "react-icons/ti";
import {IoIosMore} from "react-icons/io";
import Alert from './alert.component';
import Stars from './stars.component';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Table,
  FormGroup
} from 'reactstrap';
import {FormControl,InputGroup} from 'react-bootstrap'
import { deleteAuction,downloadAuction,updateAuction,addAuction,startAuction,makeAbid,rate} 
from '../actions/auctionsActions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { clearFormErrors } from '../actions/formErrorActions';
import {addMessage,setSeen } from '../actions/messagesActions';
const imageMaxSize = 1024*1024;
const fileTypes = 'image/x-png, image/png, image/jpg,image/jpeg';
const fileTypesArray = fileTypes.split(",").map((x) => {return x.trim()})
class AuctionModal extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.string,
    isListed: PropTypes.bool.isRequired,
    categories: PropTypes.object.isRequired,
    formError: PropTypes.object.isRequired
  };
  constructor(props){
      super(props);
      this.onChangeName=this.onChangeName.bind(this);
      this.onChangeBuy_price=this.onChangeBuy_price.bind(this);
      this.onChangeFirst_bid=this.onChangeFirst_bid.bind(this);
      this.onChangeCountry=this.onChangeCountry.bind(this);
      this.onChangeLocation=this.onChangeLocation.bind(this);
      this.onChangeDescription=this.onChangeDescription.bind(this);
      this.onChangeTimer=this.onChangeTimer.bind(this);
      this.onSubmit=this.onSubmit.bind(this);
      this.Change=this.Change.bind(this);
      this.Delete=this.Delete.bind(this);
      this.Yes=this.Yes.bind(this);
      this.No=this.No.bind(this);
      this.startAuction=this.startAuction.bind(this);
      this.countDown = this.countDown.bind(this);
      this.goBack = this.goBack.bind(this);
      this.renderCategoriesOptions=this.renderCategoriesOptions.bind(this);
      this.categorySelect=this.categorySelect.bind(this);
      this.renderCategories=this.renderCategories.bind(this);
      this.renderChangeCategories=this.renderChangeCategories.bind(this);
      this.renderSelectOptions=this.renderSelectOptions.bind(this);
      this.onChangeBid=this.onChangeBid.bind(this);
      this.onChangeRating=this.onChangeRating.bind(this);
      this.onDrop = this.onDrop.bind(this);
      this.renderImgs=this.renderImgs.bind(this);
      this.changeCheck=this.changeCheck.bind(this);
      this.changeRefresh=this.changeRefresh.bind(this);
      this.onChangeMessage=this.onChangeMessage.bind(this);
      this.state = {
        modal: false,
        id:this.props.auction._id,
        name:this.props.auction.name,
        buy_price:String(this.props.auction.buy_price),
        first_bid:String(this.props.auction.first_bid),
        country:this.props.auction.country,
        location:{
          address:this.props.auction.address,
          lat:this.props.auction.coords[1],
          lon:this.props.auction.coords[0]
        },
        number_of_bids : this.props.auction.number_of_bids,
        description:this.props.auction.description,
        amount:String(this.props.auction.amount),
        started:this.props.auction.started,
        ends:this.props.auction.ends,
        show :this.props.show,
        original:this.props.show,
        button:this.props.button,
        changeName:this.props.auction.name,
        changeBuy_price:String(this.props.auction.buy_price),
        changeFirst_bid:String(this.props.auction.first_bid),
        changeCountry:this.props.auction.country,
        changeLocation:{
          address:this.props.auction.address,
          lat:this.props.auction.coords[1],
          lon:this.props.auction.coords[0]
        },
        changeDescription:this.props.auction.description,
        timer:1,
        parents:this.renderParents(),
        changeParents:this.renderParents(),
        option:this.renderCategoriesOptions(),
        changeOption:this.renderCategoriesOptions(),
        viewport: {
          width: 400,
          height: 400,
          latitude: 37.7577,
          longitude: -122.4376,
          zoom: 8
        },
        imgs: this.props.auction.images.map((img)=>{return {src:img};}),
        changeImgs:this.props.auction.images.map((img)=>{return {src:img};}),
        del:[],
        refresh:false,
        formError:this.props.formError.msg,
        check:this.props.show==="add"?false:true,
        msg : "You can only browse all auctions' section in the main page !",
        bid:String(this.props.auction.amount)==="undefined"?
          this.props.auction.first_bid:this.props.auction.amount+1,
        changeBid:String(this.props.auction.amount)==="undefined"?
          this.props.auction.first_bid:this.props.auction.amount+1,
        rating :String(this.props.rating)==="undefined"
                || this.props.rating.length===0?
                "NONE":(
                this.props.user===this.props.rating[0].seller.username?
                this.props.rating[0].bidder.rating==="Not Rated"? 3 :
                this.props.rating[0].bidder.rating
                : 
                this.props.rating[0].seller.rating==="Not Rated"? 31 :
                this.props.rating[0].seller.rating),
        changeRating :String(this.props.rating)==="undefined"
                || this.props.rating.length===0?
                "NONE":(
                this.props.user===this.props.rating[0].seller.username?
                this.props.rating[0].bidder.rating==="Not Rated"? 3 :
                this.props.rating[0].bidder.rating
                : 
                this.props.rating[0].seller.rating==="Not Rated"? 3 :
                this.props.rating[0].seller.rating),
        message:this.props.message,
        changeMessage:""
      };
  }
  componentDidMount(){
    if(String(this.state.ends)!=="undefined"){ 
      var intervalID=setInterval(this.countDown, 1000);
      this.setState({
        intervalID:intervalID
      });
    }
  }
  countDown(){
    var ms=new Date(this.state.ends).getTime()-Date.now();
    this.setState({
      ended: ms<0,
      days : Math.floor(ms / (1000 * 60 * 60 * 24)),
      hours : Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes : Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60)),
      seconds : Math.floor((ms % (1000 * 60)) / 1000)
    });
  }
  componentWillUnmount() {
    clearInterval(this.state.intervalID);
    this.props.clearFormErrors();
  }
  componentWillReceiveProps(props) {
    this.setState({
      id:props.auction._id,
      name:props.auction.name,
      buy_price:String(props.auction.buy_price),
      first_bid:String(props.auction.first_bid),
      country:props.auction.country,
      location:{
          address:props.auction.address,
          lat:props.auction.coords[1],
          lon:props.auction.coords[0]
      },
      number_of_bids : props.auction.number_of_bids,
      description:props.auction.description,
      amount:String(props.auction.amount),
      started:props.auction.started,
      ends:props.auction.ends,
      button:props.button,
      auction:props.auction,
      show:props.show,
      original:props.show,
      changeName:props.auction.name,
      changeBuy_price:String(props.auction.buy_price),
      changeFirst_bid:String(props.auction.first_bid),
      changeCountry:props.auction.country,
      changeLocation:{
          address:props.auction.address,
          lat:props.auction.coords[1],
          lon:props.auction.coords[0]
      },
      changeDescription:props.auction.description,
      timer: 1,
      parents:this.renderParents(),
      changeParents:this.renderParents(),
      option:this.renderCategoriesOptions(),
      changeOption:this.renderCategoriesOptions(),
      imgs: props.auction.images.map((img)=>{return {src:img};}),
      changeImgs:props.auction.images.map((img)=>{return {src:img};}),
      del:[],
      formError:props.formError.msg,
      check:props.show==="add"?false:true,
      bid:String(props.auction.amount)==="undefined"?
        props.auction.first_bid:props.auction.amount+1,
      changeBid:String(props.auction.amount)==="undefined"?
        props.auction.first_bid:props.auction.amount+1,
      rating :String(props.rating)==="undefined"
                || props.rating.length===0?
                "NONE":(
                props.user===props.rating[0].seller.username?
                props.rating[0].bidder.rating==="Not Rated"? 3 :
                props.rating[0].bidder.rating
                : 
                props.rating[0].seller.rating==="Not Rated"? 3 :
                props.rating[0].seller.rating),
        changeRating :String(props.rating)==="undefined"
                || props.rating.length===0?
                "NONE":(
                props.user===props.rating[0].seller.username?
                props.rating[0].bidder.rating==="Not Rated"? 3 :
                props.rating[0].bidder.rating
                : 
                props.rating[0].seller.rating==="Not Rated"? 3 :
                props.rating[0].seller.rating),
        message:props.message,
        changeMessage:""
    });
    if(String(this.state.ends)==="undefined" && 
      String(props.auction.ends)!=="undefined"){ 
      var intervalID=setInterval(this.countDown, 1000);
      this.setState({
        intervalID:intervalID
      });
    }
  }
  componentDidUpdate() {
    if(new Date(this.state.ends).getTime()-Date.now()<0){
      clearInterval(this.state.intervalID);
    }
  }
  verifyFile = (file,x) => { 
    if (file){
      const current = file;
      const currentType = current.type;
      const currentSize = current.size;
      if(currentSize > imageMaxSize) {
        this.setState({
          formError:this.state.formError+
          currentSize + " bytes is too large(file number "+x+")!"
        });
        return false;
      }
      if (!fileTypesArray.includes(currentType)){
        this.setState({
          formError:this.state.formError+
          "Only image files are allowed(file number "+x+")"
        });   
        return false;
      }
      return true;
    }
  }
  removeImg=(image)=>{
    if(String(image.name)==="undefined") this.setState({
      del: this.state.del.concat([image])
    });
    this.setState({
      changeImgs: this.state.changeImgs.filter(img => img.src !== image.src)
    });
  }
  renderImgs(button){
    const {changeImgs}=this.state;
    const style={
      width:  "100%",
      height:" 100%",
      backgroundPosition: "50% 50%",
      backgroundRepeat:   "no-repeat",
      backgroundSize:     "cover",
    }
    var x=0;
    return changeImgs.map((img)=>{
      return (
        <Col style={{width:"100px",height:"100px"}} key={"col"+(x++)}>
          <Image src={img.src} style={style} rounded/>
          {button?
            <Button color='green'  onClick={()=>this.removeImg(img)}
              style={{backgroundColor:"transparent",borderColor:"transparent",
              position: 'absolute',color:'red', top: -5, right: 5}}>
              ⨂
            </Button>
            :
            (null)
          }
        </Col>         
      );
    })
    
  }
  onDrop(accepted,rejected) {
    this.setState({
      formError:""
    });
    var x=1;
    if (rejected){
      for(const current of rejected) this.verifyFile(current,x++);
    }
    if (accepted){
      if(accepted.length+this.state.changeImgs.length > 5){
        alert("Only 5 images per auction are allowed!");
        return;
      }
      for(const current of accepted){      
        const isVerified = this.verifyFile(current,x++);
        if (isVerified){
          const reader = new FileReader();          
          reader.addEventListener("load", ()=>{
            const res = reader.result;
            current['src']=res;
            this.setState({
              changeImgs:this.state.changeImgs.concat(current)
            });      
          },false);
          reader.readAsDataURL(current);
        }
      }
    }
  }
  changeRefresh(){
    this.setState({
      refresh:false
    });
  }
  changeCheck(val){
    this.setState({
      check:val
    });
  }
  onChangeMessage(e){
    this.setState({
      changeMessage:e.target.value
    });
  }
  onChangeName(e){
    this.setState({
      changeName:e.target.value
    });
  }
  onChangeBuy_price(e){
    this.setState({
      changeBuy_price:e.target.value
    });
  }
  onChangeFirst_bid(e){
    this.setState({
      changeFirst_bid:e.target.value
    });
  }
  onChangeCountry(e){
    this.setState({
      changeCountry:e.target.value
    });
  }
  onChangeLocation(location,country){;
    this.setState({
      changeLocation:location,
      changeCountry:country
    });
  }
  onChangeDescription(e){
    this.setState({
      changeDescription:e.target.value
    });
  }
  onChangeTimer(e){
    this.setState({
      timer:e.target.value
    });
  }
  onChangeBid(e){
    this.setState({
      changeBid:e.target.value
    });
  }
   onChangeRating(value){
    this.setState({
      changeRating:value
    });
  }
  renderParents(){
    const categories=this.props.auction.categories;
    if(categories.length===0) return [];
    return categories.map(c=>{return c;})
  }
  toggle = () => {
    if(this.state.modal===false && this.state.show==="inbox" && this.props.seen===false)
      this.props.setSeen({id:this.props.msgID})
    this.setState({
      show:this.state.original,
      modal:!this.state.modal,
      formError : "",
      refresh : true,
      changeBid:this.state.bid,
      changeRating:this.state.rating,
      changeMessage:""
    });  
    if(this.state.show==="update" || this.state.show==="UPDATE"){
      this.setState({
        changeName:this.state.name,
        changeBuy_price:this.state.buy_price,
        changeFirst_bid:this.state.first_bid,
        changeCountry:this.state.country,
        changeLocation:this.state.location,
        changeDescription:this.state.description,
        changeOption:this.state.option,
        changeParents:this.state.parents,
        changeImgs:this.state.imgs,
        del:this.state.del
      });
    }
    if(this.state.modal && this.state.show==="My Auctions") 
      this.props.clearFormErrors(); 
   
  };
  renderCategoriesOptions(){
      const categories=this.props.auction.categories;
      if(categories.length===0) return null;
      return categories.map((category)=>{
        return(
          { label: category, value: category }
        );
      });
  }
  onSubmit = e => {
    e.preventDefault();
    var error="";
    if(!this.state.check)
      error+="Address was not checked before submitted ! ";
    if(this.state.changeOption===null) 
      error+="One or more categories must be submitted!";
    if(this.state.changeImgs.length===0)
      error+="One or more images must be submitted!";
    if(error!==""){
      this.setState({
        formError: error
      });
      return;
    }
    this.setState({
      show: this.state.show==="All Auctions" || this.state.show==="My Bids"?
      "BID":this.state.show==="My Ratings"?"RATE":this.state.show.toUpperCase(),
      formError: ""
    });
  };
  Change = e => {
    e.preventDefault();
    this.setState({
      show:"update",
      formError:""
    });
  };
  Delete = e => {
    e.preventDefault();
    this.setState({
      show:"DELETE",
      formError:""
    });
  };
  Yes = e => {
    e.preventDefault();
    if(this.state.show==="DELETE") {
      this.props.deleteAuction(this.state.id);
      this.toggle();
    }
    else {
      const auction={
        id:this.state.id,
        name:this.state.changeName, 
        categories:this.state.changeOption.map((c)=>{return c.value;}), 
        buy_price:this.state.changeBuy_price, 
        first_bid:this.state.changeFirst_bid, 
        country:this.state.changeCountry, 
        location:{
          address:this.state.changeLocation.address,
          coords:[
              this.state.changeLocation.lon,
              this.state.changeLocation.lat
          ]
        }, 
        description:this.state.changeDescription,
        parents:this.state.changeParents,
        imgs:this.state.changeImgs,
        del:this.state.del
      };
      const body={id:this.state.id,timer :this.state.timer};
      if(this.state.show==="UPDATE") this.props.updateAuction(auction);
      else if(this.state.show==="ADD") {
        this.props.addAuction(auction);
        this.toggle();  
      }  
      else if(this.state.show==="START") this.props.startAuction(body);
      else if(this.state.show==="DOWNLOADS") 
        this.props.downloadAuction({id:this.state.id});
      else if(this.state.show==="BID"){
        const bid={
          auctionId:this.state.id,
          offer :this.state.changeBid
        }
        this.props.makeAbid(bid);
      }
      else if(this.state.show==="RATE"){
        const rating={
          auction_id:this.state.id,
          id2:this.props.user===this.props.rating[0].seller.username?
          this.props.auction.last_bid.bidder:this.props.auction.seller,
          rating :this.state.changeRating
        }
        console.log(this.props.auction)
        this.props.rate(rating);
        this.toggle();
      }
      else if(this.state.show==="INBOX" || this.state.show==="NEW"){
        const message={
          auctionId:this.state.id,
          receiver:this.props.user===this.props.rating[0].seller.username?
          this.props.auction.last_bid.bidder:this.props.auction.seller,
          message :this.state.changeMessage
        }
        this.props.addMessage(message);
        this.toggle();
      }
    }
    
    this.props.clearFormErrors();
    if(this.state.show==="ADD")this.props.change(false,true,'Current');     
  };
 goBack(){
  var previous="";
  if(this.state.show==="ADD" || this.state.show==="START" || 
   this.state.show==="UPDATE" || this.state.show==="BID"|| 
   this.state.show==="RATE" ||  this.state.show==="NEW" ||
   this.state.show==="INBOX" || this.state.show==="DOWNLOADS") 
      previous=this.state.show.toLowerCase();
  else previous="My Auctions";
  if(previous==="bid" || previous==="rate" ||
    previous==="inbox" || previous==="new"|| previous==="downloads") 
    previous=this.state.original;
  this.setState({
    show:previous,
    formError : "",
    refresh : true
  });
  if(previous==="My Auctions"|| previous==="My Bids")
    this.setState({
      changeName:this.state.name,
      changeBuy_price:this.state.buy_price,
      changeFirst_bid:this.state.first_bid,
      changeCountry:this.state.country,
      changeLocation:this.state.location,
      changeDescription:this.state.description,
      changeOption:this.state.option,
      changeParents:this.state.parents,
      changeImgs:this.state.imgs,
      del:[]
    });
  }
  No = e => {
    e.preventDefault();
    this.setState({
      show:this.state.show==="DELETE"? "My Auctions"
      :(this.state.show==="BID" || this.state.show==="RATE")?
      this.state.original:this.state.show.toLowerCase()
    });
  };
  startAuction = e => {
    e.preventDefault();
    this.setState({
      show:"start",
      formError:""
    });
  };
  renderCategories(){
      const options=this.state.option;
      var all="";
      if(options===null) return "";
      options.map((option)=>{
          all+=","+option.value;
          return "";
          });
      return all.substr(1);
  }
  renderChangeCategories(){
      const options=this.state.changeOption;
      var all="";
      if(options===null) return "";
      options.map((option)=>{
          all+=","+option.value;
          return "";
          });
      return all.substr(1);
  }
  renderSelectOptions(){
        var { categories } = this.props.categories;
        categories=categories.sort((a,b)=>{return a.parents.length-b.parents.length});
        const cat=categories.filter(({parents})=>
        ((parents===[] && this.state.changeParents===[]) || 
        (this.state.changeParents!==[] && this.state.changeParents.includes(name))  ||
        (this.state.changeParents!==[] && parents!==[] &&
        parents[parents.length-1]===
        this.state.changeParents[this.state.changeParents.length-1]))
        );
      return cat.map((category)=>{return({label:category.name,value:category.name})});
  }
  categorySelect=option=>{
      var name =this.state.changeOption===null?null: 
      option===null?this.state.changeOption:this.state.changeOption.filter(x => !option.includes(x)); 
      name= name===null|| name.length===0?null:name.map(x=>{return x.value});
      const {categories}=this.props.categories;
      if(name)name=name[0];
      if(name!==null && option!==null)option=option.filter(x=>categories.filter( c=>!c.parents.includes(name)&& x.value===c.name).length!==0)
      const values=option===null ?[]:option.map(opt=>opt.value)
      this.setState({
        changeOption : option,
        changeParents: values
      });
      
  }
  render() {
    const categories=this.renderCategories();
    const changeCategories=this.renderChangeCategories();
    const myAuctions=(
      <div>
        <Table size="sm" responsive striped bordered hover variant="dark" key={this.state.id+1}>
          <thead>
            <tr style={{overflow: "visible"}}>
              <td>Categories</td>
              <td >Description</td>
            </tr>
          </thead>
          <tbody>
            <tr style={{overflow: "visible"}}>
              <td>{categories}</td>
              <td>{this.state.description}</td>
            </tr>
          </tbody>
        </Table>
        {String(this.state.ends)!=="undefined" ?
        <Table size="sm" responsive striped bordered hover variant="dark" key={this.state.id}>
          <thead>
            <tr style={{overflow: "visible"}}>
              <td>Country</td>
              <td >Address</td>
              <td >Number of Bids</td>
              <td>Seller</td>
              <td >Seller's Rating</td>
              <td>Last Bidder</td>
              <td >Last Bidder's Rating</td>
              <td>First Bid</td>
              <td >Buy Price</td>
              <td >Last Bid</td>
            </tr>
          </thead>
          <tbody>
            <tr style={{overflow: "visible"}}>
              <td>{this.state.country}</td>
              <td>{this.state.location.address}</td>
              <td>{this.state.number_of_bids}</td>
              <td>{String(this.props.rating)==="undefined"
                || this.props.rating.length===0?
                "NONE" : this.props.rating[0].seller.username}</td>
              <td>{String(this.props.rating)==="undefined"
                || this.props.rating.length===0?
                "NONE" : this.props.rating[0].seller.rating!=="Not Rated"
                ? <Stars stars={this.props.rating[0].seller.rating} editing={false}/>:
                this.props.rating[0].seller.rating}</td>
              <td>{String(this.props.rating)==="undefined"
                || this.props.rating.length===0?
                "NONE" : this.props.rating[0].bidder.username}</td>
              <td>{String(this.props.rating)==="undefined"
                || this.props.rating.length===0?
                "NONE" : this.props.rating[0].bidder.rating!=="Not Rated"
                && this.props.rating[0].bidder.rating!=="No Bidder"
                ? <Stars stars={this.props.rating[0].bidder.rating} editing={false}/>:
                this.props.rating[0].bidder.rating}</td>
              <td>{this.state.first_bid}</td>
                <td>{this.state.buy_price}</td>
                <td>{String(this.state.amount)==="undefined"
                  ?"No Bid":this.state.amount}
              </td>
            </tr>
          </tbody>
        </Table>
        :
        <Table size="sm" responsive striped bordered hover variant="dark" key={this.state.id}>
          <thead>
            <tr style={{overflow: "visible"}}>
              <td>Country</td>
              <td >Address</td>
              <td>First Bid</td>
              <td >Buy Price</td>
            </tr>
          </thead>
          <tbody>
            <tr style={{overflow: "visible"}}>
              <td>{this.state.country}</td>
              <td>{this.state.location.address}</td>
              <td>{this.state.first_bid}</td>
              <td>{this.state.buy_price}</td>
            </tr>
          </tbody>
        </Table>
        }
      </div>
    );
    const buttons=(
    <Row key="row">
      <Col>
        <Map  coords={this.state.location}/>
      </Col>
      <Col key={this.state.id}>   
        <Button color='dark' style={{backgroundColor:"green",
          borderColor:"green",color:"black",height:"33%"}} 
          onClick={this.startAuction} block> Start Auction
        </Button>  
        <Button color='dark'style={{backgroundColor:"yellow",
          borderColor:"yellow",color:"black",height:"33%"}} 
          onClick={this.Change} block> Edit Auction
        </Button>
        <Button color='dark' style={{backgroundColor:"red",
          borderColor:"red",color:"black",height:"33%"}} 
          onClick={this.Delete} block> Delete Auction 
        </Button>  
      </Col>    
    </Row>
    );
    const goBack=(
      this.state.show==="update" || this.state.show==="start" || 
      this.state.show==="DELETE" || this.state.show==="START" ||
      this.state.show==="UPDATE" || this.state.show==="ADD" ||
      this.state.show==="BID" || this.state.show==="RATE" ||
       this.state.show==="INBOX" || this.state.show==="DOWNLOADS"
       || this.state.show==="NEW"?
        <Button size="lg" style={{position:"absolute",top:0,left:0,color:"grey"
        ,textAlign:"left",backgroundColor:"white",borderColor:"white",
        height:"30"}} onClick={this.goBack}><TiArrowBack/>
        </Button>
      :
        (null)
    );
    const verification=(
        <Row key="row">
        {this.state.show!=="INBOX" && this.state.show!=="NEW"
          && this.state.show!=="DOWNLOADS"?
          <Col>
            <Map  coords={this.state.changeLocation}/>
          </Col>
          :
          (null)
        }
          <Col key={this.state.id}> 
            {this.state.show==="INBOX" || this.state.show==="NEW"?
              <h3>"Are you sure you want to SEND this message?"</h3>
            :
            this.state.show==="DOWNLOADS" ?
              <h3>"Are you sure you want to DOWNLOAD this auction?"</h3>
            :
            <h3>Are you sure you want to {this.state.show} {
              this.state.show==="RATE"?
              (this.props.user===this.props.rating[0].seller.username?
              "your bidder for " : "your seller for ")+
              this.state.changeRating+" stars":"this auction"}
              {this.state.show==="START"?" for " +this.state.timer +
              (this.state.timer===1?" hour":" hours"):
              this.state.show==="BID"?" for "+this.state.changeBid+"€"
              :(null)}?</h3>
            }
            <Button color='dark'style={{width:"50%",backgroundColor:"green",
              borderColor:"green",color:"black"}} onClick={this.Yes}>
              YES
            </Button>
            <Button color='dark' style={{width:"50%",backgroundColor:"red",
              borderColor:"red",color:"black"}} onClick={this.No}>
              NO
            </Button>
          </Col>    
        </Row>
    );
    const options=this.renderSelectOptions();
    const location=this.state.changeLocation;
    const add_updateAuctionForm=(
      <Form onSubmit={this.onSubmit} key="form">
        <FormGroup>
          <Dropzone   onDrop={this.onDrop}  
            accept={fileTypes} multiple maxSize={imageMaxSize}>
            {({
                getRootProps,
                getInputProps
              }) => {
                return (
                  <div {...getRootProps()}>
                    <input {...getInputProps()}  />
                    <p> {"Drop image here or click to upload "}</p>
                  </div>
                );
              }}
          </Dropzone>
        </FormGroup>
        <FormGroup style={{display: "flex",alignItems: "center"}}>
          <Row >
            {this.renderImgs(true)}
          </Row>
        </FormGroup>      
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="nameLabel">Name</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            required
            placeholder={this.state.changeName}
            value={this.state.changeName}
            onChange={this.onChangeName}
            aria-label="name"
            aria-describedby="nameLabel"
          />
        </InputGroup>
        <FormGroup>
          <Select options={ options } placeholder="Select Categories" 
          style={{borderColor:"#00a2ed"}} required id="categories"
          value={this.state.changeOption}
          isMulti onChange={this.categorySelect}/>
        </FormGroup>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="buy_priceLabel">Buy Price</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            required
            min={Number(this.state.changeFirst_bid)+1}
            type="number"
            placeholder={this.state.changeBuy_price}
            value={this.state.changeBuy_price}
            onChange={this.onChangeBuy_price}
            aria-label="buy_price"
            aria-describedby="buy_priceLabel"
          />
          <InputGroup.Append>
            <InputGroup.Text>€</InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="first_bidLabel">First Bid</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            required
            min={1}
            max={Number(this.state.changeBuy_price)-1}
            type="number"
            placeholder={this.state.changeFirst_bid}
            value={this.state.changeFirst_bid}
            onChange={this.onChangeFirst_bid}
            aria-label="first_bid"
            aria-describedby="first_bidLabel"
          />
          <InputGroup.Append>
            <InputGroup.Text>€</InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="countryLabel">Country</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            required
            disabled
            placeholder={this.state.changeCountry}
            value={this.state.changeCountry}
            onChange={this.onChangeCountry}
            aria-label="country"
            aria-describedby="countryLabel"
          />
        </InputGroup>
        <Location location={location} change={this.changeCheck} 
          country={this.state.changeCountry} required={true}
          onChangeLocation={this.onChangeLocation} 
          refresh={this.state.refresh}  changeRefresh={this.changeRefresh}/>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="desctriptionLabel">Description</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            required
            as="textarea"
            placeholder={this.state.changeDescription}
            value={this.state.changeDescription}
            onChange={this.onChangeDescription}
            aria-label="description"
            aria-describedby="desctriptionLabel"
          />
        </InputGroup>
        <Button  color='dark' type="submit" style={{backgroundColor:"green",
          borderColor:"green",color:"black"}} block>
          {this.state.show.toUpperCase()} Auction
        </Button>  
      </Form>
    );
    const addAuction=(
      <Table striped bordered hover variant="dark" key="2">
        <thead>
          <tr style={{overflow: "visible"}}>
            <th>Name</th>
            <th>{this.state.changeName}</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{overflow: "visible"}}>
            <td>Categories</td>
            <td>{changeCategories}</td>
          </tr>
          <tr style={{overflow: "visible"}}>
            <td>Buy Price</td>
            <td>{this.state.changeBuy_price}</td>
          </tr>
          <tr style={{overflow: "visible"}}>
            <td>First Bid</td>
            <td>{this.state.changeFirst_bid}</td>
          </tr>
          <tr style={{overflow: "visible"}}>
            <td>Country</td>
            <td>{this.state.changeCountry}</td>
          </tr>
          <tr style={{overflow: "visible"}}>
            <td>Address</td>
            <td>{this.state.changeLocation?
              this.state.changeLocation.address:""}</td>
          </tr>
          <tr style={{overflow: "visible"}}>
            <td>Description</td>
            <td>{this.state.changeDescription}</td>
          </tr>
        </tbody>
      </Table>
    );
    const updateAuction=(
      <Table  responsive striped bordered hover variant="dark" key="2">
        <thead>
          <tr style={{overflow: "visible"}}>
            <th>Name</th>
            <th>{this.state.name} ➡ {this.state.changeName}</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{overflow: "visible"}}>
            <td>Categories</td>
            <td>{categories} ➡ {changeCategories}</td>
          </tr>
          <tr style={{overflow: "visible"}}>
            <td>Buy Price</td>
            <td>{this.state.buy_price} ➡ {this.state.changeBuy_price}</td>
          </tr>
          <tr style={{overflow: "visible"}}>
            <td>First Bid</td>
            <td>{this.state.first_bid} ➡ {this.state.changeFirst_bid}</td>
          </tr>
          <tr style={{overflow: "visible"}}>
            <td>Country</td>
            <td>{this.state.country} ➡ {this.state.changecountry}</td>
          </tr>
          <tr style={{overflow: "visible"}}>
            <td>Address</td>
            <td>{this.state.location.address} ➡ {this.state.changeLocation?
              this.state.changeLocation.address:""}</td>
          </tr>
          <tr style={{overflow: "visible"}}>
            <td>Description</td>
            <td>{this.state.description} ➡ {this.state.changeDescription}</td>
          </tr>
        </tbody>
      </Table>
    );
    const setEnd=(
      <div key={this.state.id}>
        {myAuctions}
        <Row key="row">
          <Col>
            <Map  coords={this.state.location}/>
          </Col>
          <Col key={this.state.id}>   
            <Form onSubmit={this.onSubmit}>
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="timerLabel">Hours</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  required
                  type="number"
                  min="1"
                  max="168"
                  placeholder={this.state.timer}
                  aria-label="timer"
                  value={this.state.timer}
                  onChange={this.onChangeTimer}
                  aria-describedby="timerLabel"
                />
                <InputGroup.Append>
                <Button color='green' type="submit" 
                  style={{backgroundColor:"green",borderColor:"green",color:"black"}} block>
                  {this.state.show.toUpperCase()} Auction
                </Button>
                </InputGroup.Append>
              </InputGroup>
            </Form> 
          </Col>    
        </Row>
        
      </div>
    );
    var countDown=(null);
    if(this.state.ends!=null){
      if(!this.state.ended){
        const start=new Date(this.state.started);
        countDown=( 
          <Col key={this.state.id}>   
             <Table size="sm" striped bordered hover variant="dark" key={this.state.id}>
                <tbody>
                  <tr style={{overflow: "visible"}}>
                    <td>Started at</td>
                    <td>Ends in</td>
                  </tr>
                  <tr style={{overflow: "visible"}}>
                    <td>{String(start)}</td>
                    <td>{this.state.days} days : {this.state.hours} hours :{' '}
                    {this.state.minutes} minutes : {this.state.seconds}  seconds</td>
                  </tr>
                </tbody>
              </Table>
              {(this.state.show==="My Bids" || this.state.show==="All Auctions")
                && new Date(this.state.ends).getTime()-Date.now()>0
                && this.props.isListed===true  ?
                <Form key="form" onSubmit={this.onSubmit}>
                  <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="timerLabel">Offer </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      required
                      type="number"
                      min={this.state.amount==="undefined"?this.state.changeFirst_bid
                        :Number(this.state.amount)+1}
                      max={this.state.buy_price}
                      placeholder={this.state.changeBid}
                      aria-label="timer"
                      value={this.state.changeBid}
                      onChange={this.onChangeBid}
                      aria-describedby="timerLabel"
                    />
                    <InputGroup.Append>
                      <Button color='green' type="submit" 
                        style={{backgroundColor:"green",borderColor:"green",color:"black"}} block>
                        Bid
                      </Button>
                    </InputGroup.Append>
                  </InputGroup>
                </Form>
              :
              (null)
              }
          </Col>          
        );
      }
    };
    const setBid=(
        <div key={this.state.id}>
        {myAuctions}
        <Row key="row">
          <Col>
            <Map  coords={this.state.location}/>
          </Col>
        {(this.state.show==="All Auctions" || this.state.show==="My Bids") ?
            countDown
          :
          (null)
        }
        </Row>
      </div>
    );
    const setRating=(
        <div key={this.state.id}>
        {myAuctions}
        {this.state.show==="My Ratings"?
        <Row key="row">
          <Col>
            <Map  coords={this.state.location}/>
          </Col>
          {String(this.props.rating)!=="undefined" &&
            this.props.rating.length!==0  ?
          <Col>     
            <Form key="form" onSubmit={this.onSubmit}>
              <Row>
                <Col> 
                  <Stars change={this.onChangeRating}
                    stars={this.state.changeRating} editing={true}/>
                </Col> 
                <Col> 
                  <Button color='green' type="submit" 
                    style={{backgroundColor:"green",borderColor:"green",
                    color:"black"}} block> Rate your {
                      this.props.user===this.props.rating[0].seller.username?
                      "bidder!" : "seller!"
                    }
                  </Button>
                </Col>
              </Row> 
            </Form>
          </Col>
          :(null)
          }
        </Row>
        :(null)
        }
      </div>
    );
    const message=(
        <div key={this.state.id}>
        {myAuctions}
        <Row key="row">
          <Col>
            <Map  coords={this.state.location}/>
          </Col>
          {String(this.props.message)!=="undefined" ?
          <Col>     
            <Form key="form" onSubmit={this.onSubmit}>
              <Row >
                <Col> 
                  {this.state.original==="inbox" || this.state.original==="sent"?
                  <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="messageLabel">Message</InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl
                        as="textarea"
                        disabled
                        placeholder={this.state.message}
                        value={this.state.message}
                        aria-label="message"
                        aria-describedby="messageLabel"
                      />
                    </InputGroup>
                    :
                    (null)
                    }

                    {this.state.original==="inbox" || this.state.original==="new"
                      ?
                      <InputGroup className="mb-3" key="input">
                        <InputGroup.Prepend>
                          <InputGroup.Text id="responseLabel">
                            {this.state.orignal==="inbox"?"Response"
                            :"Message"}</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                          as="textarea"
                          required
                          onChange={this.onChangeMessage}
                          disabled={this.state.show==="new"||this.state.show==="inbox"?false:true}
                          placeholder={this.state.changeMessage}
                          value={this.state.changeMessage}
                          aria-label="response"
                          aria-describedby="responseLabel"
                        />
                      </InputGroup>
                      :
                      (null)
                    }
                    {this.state.show==="new"||this.state.show==="inbox"?
                        <Button color='green' type="submit" key="button"
                          style={{backgroundColor:"green",borderColor:"green",
                          color:"black"}} block> Respond
                        </Button>
                      :
                      this.state.show==="NEW" || this.state.show==="INBOX" ?
                      (verification)
                      :
                      (null)
                    }
                </Col>  
              </Row> 
            </Form>
          </Col>
          :(null)
          }
        </Row>
      </div>
    );
    const downloads=(
      <div key={this.state.id}>
        {myAuctions}
        <Row key="row">
          <Col>
            <Map  coords={this.state.location}/>
          </Col>
          <Col>     
            <Form key="form" onSubmit={this.onSubmit}>
              <Row >
                <Col>
                {this.state.show==="downloads" ?
                  <Button color='green' type="submit" key="button"
                      style={{backgroundColor:"green",borderColor:"green",
                      color:"black"}} block> Download this auction
                  </Button>
                :
                (verification)
                }
                </Col>  
              </Row> 
            </Form>
          </Col>
        </Row>
      </div>
    );
    return (
      <div  >
        {this.state.button==="New Auction" ?
          (
            <Button style={{width:"30%",borderColor:"#00a2ed",float:"right"}} color="outline-primary" 
              onClick={this.toggle}>{this.state.button}
            </Button>
          )
          :
          this.state.button==="Show Message" ?
            (
              <Button  onClick={this.toggle} block>{this.state.button}
              </Button>
            )
          :
          (
            <Button color='dark' style={{width:"100%"}} 
              onClick={this.toggle} block><IoIosMore/>
            </Button>
          )
        }
        <Modal isOpen={this.state.modal} toggle={this.toggle} size="xl" >
          {goBack}
          <ModalHeader toggle={this.toggle} cssModule={{'modal-title': 'w-100 text-center'}}>
            {this.state.name===""?"Add an auction":
            this.state.original==="inbox" ? "Received Message":
            this.state.original==="sent"? "Sent Message":
              
              this.state.name}
            {this.state.show==="My Auctions" || this.state.show==="My Bids"
              || this.state.show==="All Auctions" ?
              <FormGroup style={{display: "flex",alignItems: "center"}}>
                <Row >
                  {this.renderImgs(false)}
                </Row>
              </FormGroup>
              :
              (null)
            }
          </ModalHeader>
          <ModalBody>
              {this.props.isAuthenticated==="false" && 
                  this.state.original==="All Auctions" ? 
                  <Alert myKey="alert" variant="warning" msg={"You are not signed in ! "
                    +this.state.msg} />
                :
                this.props.isListed===false && 
                this.state.original==="All Auctions"? 
                <Alert myKey="alert" variant="warning" msg={"You are not yet accepted by the admin of our page ! "
                  +this.state.msg} />
                  :(null)
                }
                {this.state.formError!==""?
                  <Alert myKey="alert" variant="danger" 
                    msg={this.state.formError} />
                  :
                  (null)
                }
                {this.state.show==="add" || this.state.show==="update"?
                  <Alert myKey="alert" variant="warning" 
                    msg={"Address must be checked before being sumbitted !"} />
                  :
                  (null)
                }
                {new Date(this.state.ends).getTime()-Date.now()<=0 
                  && this.state.original!=="inbox" && this.state.original!=="My Ratings"
                  && this.state.original!=="new" && this.state.original!=="sent"
                  & this.state.original!=="downloads"?
                  <Alert myKey="error" show={true} variant="danger"
                    msg={"This auction has ended!"} />
                  :
                  (null)
                }
                {(this.state.show==="All Auctions" || this.state.show==="My Bids") 
                  && new Date(this.state.ends).getTime()-Date.now()<=0 && 
                  this.state.number_of_bids>0 && String(this.props.rating)!=="undefined" &&
                  this.props.rating.length!==0 && String(this.props.user)!=="" &&
                  this.props.user===this.props.rating[0].bidder.username?
                  <Alert myKey="success" show={true} variant="success"
                    msg={"Congratulations,you won this auction!"} />
                  :
                  (null)
                }
                {(this.state.show==="All Auctions" || this.state.show==="My Bids") 
                  && new Date(this.state.ends).getTime()-Date.now()<=0 && 
                  this.state.number_of_bids>0 && String(this.props.rating)!=="undefined" &&
                  this.props.rating.length!==0 && String(this.props.user)!=="" &&
                  this.props.user!==this.props.rating[0].bidder.username?
                  <Alert myKey="lost" show={true} variant="danger"
                    msg={"You lost this auction!"} />
                    :
                    (null)
                }
                {this.state.show==="My Auctions" && this.state.number_of_bids>0
                  && new Date(this.state.ends).getTime()-Date.now()<=0 ?
                  <Alert myKey="sold" show={true} variant="success"
                    msg={"You sold this item!"} />
                  :
                  (null)
                } 
                {this.state.show==="My Auctions"  && this.state.number_of_bids===0
                  && new Date(this.state.ends).getTime()-Date.now()<=0 ?
                  <Alert myKey="unsold" show={true} variant="danger"
                    msg={"You did not sold this item!"} />
                  :
                  (null)
                }        
                {this.state.show==="My Auctions" ?
                  [
                  (myAuctions),
                  (String(this.state.amount)==="undefined" ? 
                    [
                      (
                        String(this.state.ends)==="undefined" ?
                          (buttons) 
                          :
                          new Date(this.state.ends).getTime()-Date.now()>0 ?
                          <Row key="roww">
                            <Col>
                                <Map  coords={this.state.location}/>
                            </Col>
                            {countDown}
                          </Row> 
                          :
                          (null)
                      )
                    ]
                    : (
                      (null)
                  ))
                  ]
                  :
                  this.state.show==="update" || this.state.show==="add" ?
                  (add_updateAuctionForm)
                  :
                  [
                    this.state.show==="DELETE" || this.state.show==="START" ?
                      [(myAuctions),
                      (verification)
                      ]
                      :
                      this.state.show==="UPDATE" ?
                      [(updateAuction),
                      (verification)]
                      :
                      this.state.show==="ADD" ?
                      [(addAuction),
                      (verification)]
                      :
                      [
                        this.state.show==="start" ?
                          (setEnd)
                          :
                          [this.state.show==="All Auctions" || this.state.show==="My Bids" ?
                            (setBid)
                            :
                            this.state.show==="BID" ?
                              [(setBid),
                              (verification)]
                            :
                            this.state.show==="My Ratings" ?
                              (setRating)
                            :
                            this.state.show==="RATE" ?
                              [(setRating),
                              (verification)]
                            :
                            this.state.original==="inbox" || this.state.original==="sent"
                            || this.state.original==="new"?
                              (message)
                            :
                            this.state.original==="downloads"?
                            (downloads)
                            :
                            (null)
                          ]
                      ]
                  ]
                  }
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  categories: state.categories,
  isAuthenticated: state.auth.isAuthenticated,
  formError: state.formError,
  isListed: state.auth.isListed
});
export default connect(
  mapStateToProps,
  {deleteAuction,updateAuction,addAuction,startAuction,makeAbid,rate,
  clearFormErrors,addMessage,setSeen,downloadAuction}
)(AuctionModal);