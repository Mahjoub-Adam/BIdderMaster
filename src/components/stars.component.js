import React, { Component } from 'react';
import StarRatings from 'react-star-ratings';
export default class Stars extends Component{
    constructor(props) {
      super(props);
      this.changeRating=this.changeRating.bind(this);
      this.state={
        stars:this.props.stars,
        editing:this.props.editing
      };
    }
    changeRating( newRating, name ) {
      this.setState({
        stars: String(newRating)
      });
      this.props.change(String(newRating));
    }
    componentWillReceiveProps(props){
      this.setState({
        stars:String(props.stars),
        editing:props.editing
      });
    }
    render(){
        if(String(this.state.stars)==="undefined") return ((null));
        return(
            this.state.editing?
                <StarRatings
                    rating={Number(this.state.stars)}
                    starRatedColor="gold"
                    changeRating={this.changeRating}
                    isSelectable={this.editing}
                    starDimension="15px"
                    numberOfStars={5}
                    starSpacing="2px"
                    name='rating'
                />
            :
                <StarRatings
                    rating={Number(this.state.stars)}
                    starRatedColor="gold"
                    starDimension="15px"
                    starSpacing="2px"
                    isSelectable={this.editing}
                    numberOfStars={5}
                    name='rating'
                />
        );
    }
}