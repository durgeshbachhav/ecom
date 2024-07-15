import { User } from "../models/user.model.js";
import { sendEmail } from "../services/mailer.js";

// Send verification link when user creates account
const sendVerificationEmail = async (user) => {
    const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${user._id}`;
    const subject = 'Account Verification';
    const text = `Please verify your account by clicking the following link: ${verificationLink}`;
    await sendEmail(user.email, subject, text);
};

// Send password reset link
const sendPasswordResetEmail = async (user) => {
    const resetLink = `${process.env.BASE_URL}/reset-password?token=${user._id}`;
    const subject = 'Password Reset';
    const text = `Please reset your password by clicking the following link: ${resetLink}`;
    await sendEmail(user.email, subject, text);
};

// Send order confirmation to user
const sendOrderConfirmationEmail = async (order) => {
    const user = await User.findById(order.userId);
    const subject = 'Order Confirmation';
    const text = `Your order with ID ${order._id} has been placed successfully.`;
    await sendEmail(user.email, subject, text);
};

// Send new order notification to admin
const sendNewOrderNotificationToAdmin = async (order) => {
    const adminEmail = process.env.ADMIN_EMAIL;
    const subject = 'New Order';
    const text = `A new order with ID ${order._id} has been placed by user ${order.userId}.`;
    await sendEmail(adminEmail, subject, text);
};

// Send low stock notification to admin
const sendLowStockNotificationToAdmin = async (product) => {
    if (product.stock < 5) {
        const adminEmail = process.env.ADMIN_EMAIL;
        const subject = 'Low Stock Alert';
        const text = `The product ${product.name} has low stock (${product.stock} items left).`;
        await sendEmail(adminEmail, subject, text);
    }
};

// Send order status update notification to user
const sendOrderStatusUpdateEmail = async (order) => {
    const user = await User.findById(order.userId);
    const subject = 'Order Status Update';
    const text = `Your order with ID ${order._id} status has been updated to ${order.status}.`;
    await sendEmail(user.email, subject, text);
};

export {
    sendVerificationEmail,
    sendPasswordResetEmail,
    sendOrderConfirmationEmail,
    sendNewOrderNotificationToAdmin,
    sendLowStockNotificationToAdmin,
    sendOrderStatusUpdateEmail
};
