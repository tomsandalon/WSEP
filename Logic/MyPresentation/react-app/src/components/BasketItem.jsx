import React, {Component} from 'react';
import {Alert} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';
class BasketItem extends Component {
	state ={
		visible:false,
		successVisible:false,
    	errorMsg:'',
		editAmount:''
	}
	onShowAlert = (message)=>{
		this.setState({successVisible:true,errorMsg:{message}},()=>{
			window.setTimeout(()=>{
			this.setState({successVisible:false})
			},1000)
		});
	}
	handleEdit = (event) =>{
		this.setState({editAmount:event.target.value});
	}
	handleEditBasket = () =>{
		const requestOptions = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Cookie': document.cookie,
			},
			body: JSON.stringify({
				shop_id:this.props.shop_id,
				product_id:this.props.product_id,
				amount:this.state.editAmount
			})
		  };
		  fetch('/cart',requestOptions)
			  .then(async response => {
				switch(response.status){
					case 200: //welcome
					this.props.refreshCart();
					this.onShowAlert("Amount Edit Successfully!");
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
	handleRemoveItemFromBasket = () =>{
		const requestOptions = {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Cookie': document.cookie,
			},
			body: JSON.stringify({
				shop_id:this.props.shop_id,
				product_id:this.props.product_id
			})
		  };
		  fetch('/cart',requestOptions)
			  .then(async response => {
				switch(response.status){
					case 200: //welcome
					this.onShowAlert("Item Removed Successfully!");
					this.props.refreshCart();
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
					<div className="col-md-2">
						<figure className="itemside">
							<div className="aside"><img src={this.props.img} className="photoCart border img-sm" alt=""/></div>
							<figcaption className="info">
								<span className="text-muted">{this.props.shop_name} {this.props.item_name}
								{/* (ID:{this.props.product_id}) */}
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
					<h6>Discount: <span type="text" className="badge badge-pill badge-info">{this.props.discount_price}</span></h6>
					</div>
					<div className="col-1">
						<button className="btn btn-primary btn-sm" onClick={this.handleRemoveItemFromBasket}> Remove </button>
					{/* <Alert color="success" isOpen={this.state.successVisible}>{this.state.errorMsg}</Alert> */}
						<Alert color="danger" toggle={this.toggle.bind(this)} isOpen={this.state.visible}>{this.state.errorMsg}</Alert>
					</div>
				</div>
				<div className="row">
					<div className="col-4">
						<input type="text" className="edit form-control" placeholder="Edit amount" onChange={this.handleEdit}/><button className="btn btn-primary" type="button"><i className="fas fa-edit" onClick={this.handleEditBasket}></i></button>
					</div>
					<div className="col-8">
						<Alert color="danger" toggle={this.toggle.bind(this)} isOpen={this.state.visible}>{this.state.errorMsg}</Alert>
					</div>
				</div>
			</article>
            </React.Fragment>
        );
    }
}

export default BasketItem;