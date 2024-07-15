import jsPDF from 'jspdf';

export const generateInvoice = ({ order }) => {
  const doc = new jsPDF();
  doc.setFont("helvetica");

  // Helper function to add text
  const addText = (text, x, y, options = {}) => {
    doc.text(text, x, y, options);
  };

  // Add company logo or name
  doc.setFontSize(20);
  addText("Your Company Name", 105, 20, { align: "center" });

  // Add invoice title
  doc.setFontSize(16);
  addText("INVOICE", 105, 40, { align: "center" });

  // Add order details
  doc.setFontSize(12);
  addText(`Invoice Number: INV-${order._id.slice(-6)}`, 20, 60);
  addText(`Order Date: ${new Date(order.orderDate).toLocaleDateString()}`, 20, 70);
  addText(`Receipt ID: ${order.receiptId}`, 20, 80);

  // Add customer details
  addText("Bill To:", 20, 100);
  addText(`${order.userId.fullName}`, 20, 110);
  addText(`${order.userId.email}`, 20, 120);

  // Add shipping address
  addText("Ship To:", 110, 100);
  const address = order.address;
  addText(`${address.street}`, 110, 110);
  addText(`${address.city}, ${address.state} ${address.zip}`, 110, 120);
  addText(`${address.country}`, 110, 130);

  // Add table header
  let yPos = 150;
  doc.setFillColor(220, 220, 220);
  doc.rect(20, yPos, 170, 10, "F");
  addText("Product ID", 25, yPos + 7);
  addText("Quantity", 80, yPos + 7);
  addText("Price", 120, yPos + 7);
  addText("Total", 160, yPos + 7);

  // Add table content
  yPos += 15;
  order.products.forEach(product => {
    addText(product.productId.toString(), 25, yPos);
    addText(product.quantity.toString(), 85, yPos);
    addText(`₹${product.price.toFixed(2)}`, 120, yPos);
    addText(`₹${(product.price * product.quantity).toFixed(2)}`, 160, yPos);
    yPos += 10;
  });

  // Add total
  yPos += 10;
  doc.setFont("helvetica", "bold");
  addText("Total:", 130, yPos);
  addText(`₹${order.total.toFixed(2)}`, 160, yPos);

  // Add payment status
  yPos += 10;
  doc.setFont("helvetica", "normal");
  addText(`Payment Status: ${order.isPaymentVerify ? 'Verified' : 'Pending'}`, 20, yPos);

  // Add footer
  doc.setFontSize(10);
  addText("Thank you for your business!", 105, 280, { align: "center" });

  // Save the PDF
  doc.save(`Invoice-${order._id.slice(-6)}.pdf`);
};