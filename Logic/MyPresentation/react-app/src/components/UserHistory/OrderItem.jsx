import React , {Component}from 'react';
import Rating from 'react-rating';
class OrderItem extends Component {
 
	handleClick = (value) => {
		const requestOptions = {
			method: "PUT",
			headers: { "Content-Type": "application/json",
			'Cookie': document.cookie },
			body: JSON.stringify({
			  shop_id: this.props.shop_id,
			  product_id: this.props.product_id,
			  rating: value,
			}),
		  };
		  fetch("/user/shop/product/rate", requestOptions)
		  .then(async response => {
			switch(response.status){
				case 200:
					this.props.refreshHistory();
					break;
				default:
					// return false;
					break;       
			}
		});
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
								<span className="text-muted">{this.props.shop_name}(ID:{this.props.shop_id}) {this.props.item_name} {this.props.item_desc}
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
						<h6>Price: <span type="number" className="badge badge-pill badge-info">{this.props.price}</span></h6>	
					</div>
					<div className="col-4">
					{false ? <h5>My rating</h5> : <h5>Rate product:</h5>}
					{false ? 
					<Rating readonly={true} placeholderRating={this.props.rating}></Rating>:
							 <Rating placeholderRating={this.props.rating} onClick={this.handleClick}></Rating>
					}
						</div>
				</div>
			</article>
            </React.Fragment>
        )
    }
}
export default OrderItem;