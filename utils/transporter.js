const payOrderEmailTemplate = (order) => {
   return `<h3>Thanks for shopping with us</h3>
<p>
Hi ${order.user.firstName},</p>
<p>We have finished processing your order.</p>
<h3>Order (${order.createdAt.toString().substring(0, 10)})</h3>
<table border="1">
<thead>
<tr>
<th><strong>Product</strong></th>
<th><strong>Quantity</strong></th>
<th><strong align="right">Price</strong></th>
</thead>
<tbody>
<tr>
${order.orderItems
         .map(
            (item) => `
  <td>${item.title}</td>
  <td align="center">${item.quantity}</td>
  <td align="right"> $${item.price}</td>
  `
         )
         .join('\n')}
  </tr>
</tbody>
<tfoot>
<tr>
<td colspan="2">Items Price:</td>
<td align="right"> $${order.itemsPrice}</td>
</tr>
<tr>
<td colspan="2"><strong>Total Price:</strong></td>
<td align="right"><strong> $${order.totalPrice}</strong></td>
</tr>
<tr>
<td colspan="2">Payment Method:</td>
<td align="right">${order.paymentMethod}</td>
</tr>
</table>
<h2>Shipping address</h2>
<p>
Name: ${order.shippingAddress.firstName},<br/>
LastName: ${order.shippingAddress.lastName},<br/>
Country: ${order.shippingAddress.country},<br/>
City: ${order.shippingAddress.city}<br/>
State: ${order.shippingAddress.state}<br/>
Address: ${order.shippingAddress.address},<br/>
ZipCode: ${order.shippingAddress.zipCode}<br/>
Phone: ${order.shippingAddress.phone}
</p>
<hr/>
<p>
Thanks for shopping with us.
</p>
`;
};
module.exports = { payOrderEmailTemplate }