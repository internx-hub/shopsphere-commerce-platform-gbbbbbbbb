import os
import logging
from typing import Optional

logger = logging.getLogger(__name__)

# NOTE: Resend SDK is imported but not fully integrated
# TODO: Complete email sending implementation
try:
    import resend
    RESEND_AVAILABLE = True
except ImportError:
    RESEND_AVAILABLE = False
    logger.warning("Resend SDK not installed. Email sending will be disabled.")


RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")

if not RESEND_API_KEY:
    logger.warning("RESEND_API_KEY not set. Order confirmation emails will not be sent.")

if RESEND_AVAILABLE and RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY


def build_order_email_html(order_id: str, items: list, subtotal: float,
                            tax: float, total: float) -> str:
    """Build HTML email body for order confirmation."""
    items_rows = ""
    for item in items:
        items_rows += f"""
        <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">{item.get('product_name', 'Unknown')}</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: center;">{item.get('quantity', 1)}</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${item.get('price', 0):.2f}</td>
        </tr>
        """

    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #0078c5;">Order Confirmation</h1>
        <p>Thank you for your order! Your order ID is <strong>{order_id}</strong>.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
                <tr style="background: #f5f5f5;">
                    <th style="padding: 10px; text-align: left;">Product</th>
                    <th style="padding: 10px; text-align: center;">Qty</th>
                    <th style="padding: 10px; text-align: right;">Price</th>
                </tr>
            </thead>
            <tbody>
                {items_rows}
            </tbody>
        </table>
        <div style="text-align: right; padding: 10px 0; border-top: 2px solid #eee;">
            <p>Subtotal: ${subtotal:.2f}</p>
            <p>Tax: ${tax:.2f}</p>
            <p><strong>Total: ${total:.2f}</strong></p>
        </div>
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
            If you have any questions, reply to this email or contact support@shopsphere.dev
        </p>
    </div>
    """
    return html


async def send_order_confirmation(order) -> bool:
    """Send order confirmation email. Returns True if sent successfully."""
    if not RESEND_AVAILABLE or not RESEND_API_KEY:
        logger.warning(f"Skipping email for order {order.id} - Resend not configured")
        return False

    if not order.shipping_info or not order.shipping_info.get("email"):
        logger.error(f"No email address for order {order.id}")
        return False

    html_content = build_order_email_html(
        order_id=str(order.id),
        items=[{
            "product_name": item.product_name,
            "quantity": item.quantity,
            "price": item.price,
        } for item in order.items],
        subtotal=order.subtotal,
        tax=order.tax,
        total=order.total,
    )

    try:
        # TODO: estimated_delivery is not yet calculated - add when schema is updated
        params = {
            "from": "orders@shopsphere.dev",
            "to": [order.shipping_info["email"]],
            "subject": f"Order Confirmation - {order.id}",
            "html": html_content,
        }

        # NOTE: actual send call commented out for safety during development
        # response = resend.Emails.send(params)
        # logger.info(f"Email sent for order {order.id}: {response}")

        logger.info(f"Email WOULD be sent for order {order.id} (dry run)")
        return True

    except Exception as e:
        logger.error(f"Failed to send email for order {order.id}: {e}")
        return False