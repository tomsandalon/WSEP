import React , {Component}from 'react';

class OrderItem extends Component {
    render() {
        return(
            <React.Fragment>
                <article className="card card-body mb-3">
				<div className="row align-items-center">
					<div className="col-md-6">
						<figure className="itemside">
							<div className="aside"><img src={this.props.img} className="photoCart border img-sm" alt=""/></div>
							<figcaption className="info">
								<span className="text-muted">{this.props.shop_name}(ID:{this.props.shop_id}) {this.props.item_name} {this.props.item_desc}
								(ID:{this.props.product_id})
								</span>
							</figcaption>
						</figure> 
					</div> 
					<div className="col-3"> 
						<div className="input-group input-spinner">
							<h6>Amount: <span type="text" className="badge badge-pill badge-info">{this.props.amount}</span></h6>
						</div> 
					</div> 
					<div className="col-3">
						<h6>Price: <span type="number" className="badge badge-pill badge-info">{this.props.price}</span></h6>	
					</div>
				</div>
			</article>
            </React.Fragment>
        )
    }
}
export default OrderItem;