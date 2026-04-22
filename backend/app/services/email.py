import os
import resend
from datetime import datetime, timedelta
from fastapi import HTTPException

# Initialize Resend with API Key from environment 
resend.api_key = os.environ.get("RESEND_API_KEY")

def send_order_confirmation(user_email, order_data):
    """
    Sends a formatted HTML order confirmation email via Resend[cite: 196, 197].
    """
    if not resend.api_key:
        print("WARNING: RESEND_API_KEY is not set. Email will not be sent.") [cite: 211]
        return

    # Calculate estimated delivery (today + 5 business days) 
    est_delivery = (datetime.now() + timedelta(days=7)).strftime("%A, %b %d")

    # Construct HTML Line Items 
    items_html = "".join([
        f"<li>{item['name']} (x{item['qty']}) - ${item['price']:.2f}</li>"
        for item in order_data['items']
    ])

    html_content = f"""
    <h1>Order Confirmed!</h1>
    <p>Thank you for your purchase. Your order <strong>#{order_data['order_id']}</strong> has been received.</p>
    <hr />
    <h3>Order Summary:</h3>
    <ul>{items_html}</ul>
    <p><strong>Subtotal:</strong> ${order_data['subtotal']:.2f}</p>
    <p><strong>Tax:</strong> ${order_data['tax']:.2f}</p>
    <p><strong>Total:</strong> ${order_data['total']:.2f}</p>
    <hr />
    <p><strong>Estimated Delivery:</strong> {est_delivery}</p>
    """

    try:
        params = {
            "from": "orders@shopsphere.dev",  # [cite: 204]
            "to": user_email,
            "subject": f"Order Confirmation - #{order_data['order_id']}",
            "html": html_content,
        }
        
        email = resend.Emails.send(params)
        return email
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        return None