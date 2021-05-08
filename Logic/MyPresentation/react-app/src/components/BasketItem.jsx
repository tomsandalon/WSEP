import React, {Component} from 'react';
import {Alert} from 'reactstrap';
class BasketItem extends Component {
	state ={
		visible:false,
    	errorMsg:''
	}

	handleRemoveItemFromBasket = () =>{
		// console.log(this.props.shop_id);
		// console.log(this.props.product_id);
		// console.log(this.props.amount);
		
		console.log("cookies",document.cookie);
		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Cookie': document.cookie,
				 body: JSON.stringify({
					shop_id:this.props.shop_id,
					product_id:this.props.product_id,
					amount:this.props.amount
				})
			},
		  };
		  fetch('/cart',requestOptions)
			  .then(async response => {
				switch(response.status){
					case 200: //welcome
					break;
					case 400:
					const err_message_fail = await response.text();
					this.setState({errorMsg:err_message_fail,visible:true})
                    break;
                	case 404: //server not found
                    break;
					default:
					break;
				}
			})		
	}
	toggle(){
		this.setState({visible:!this.state.visible, errorMsg:''})
	}
    render() {
        return(
            <React.Fragment>
                <article className="card card-body mb-3">
				<div className="row align-items-center">
					<div className="col-md-4">
						<figure className="itemside">
							<div className="aside"><img src={this.props.img} className="photoCart border img-sm" alt=""/></div>
							<figcaption className="info">
								<span className="text-muted">{this.props.shop_name} {this.props.item_name}
								(ID:{this.props.product_id})
								</span>
							</figcaption>
						</figure> 
					</div> 
					<div className="col-2"> 
						<div className="input-group input-spinner">
							<h6>Amount: <span type="text" className="badge badge-pill badge-info">{this.props.amount}</span></h6>
						</div> 
					</div> 
					<div className="col-2">
						<h6>Total: <span type="text" className="badge badge-pill badge-info">{this.props.price*this.props.amount}</span></h6>
						
					</div>
					<div className="col-2">
					<h6>Per item: <span type="text" className="badge badge-pill badge-info">{this.props.price}</span></h6>
					</div>
					<div className="col-2">
					<button className="btn btn-primary btn-sm" onClick={this.handleRemoveItemFromBasket}> Remove </button>
					<Alert color="danger" toggle={this.toggle.bind(this)} isOpen={this.state.visible}>{this.state.errorMsg}</Alert>
					</div>
					{/*<div className="col flex-grow-0 text-right">*/}
					{/*	<a href="#" className="btn btn-light"> <i className="fa fa-times"></i> </a>*/}
					{/*</div>*/}
				</div>
			</article>
            </React.Fragment>
        );
    }
}

export default BasketItem;