from app.services.email import send_order_confirmation

@router.post("/webhooks/stripe")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        # Verify signature to prevent spoofing [cite: 160, 206]
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid signature") [cite: 173, 210]

    if event["type"] == "payment_intent.succeeded":
        payment_intent = event["data"]["object"]
        
        # 1. Update order status to 'paid' in DB [cite: 174]
        # 2. Fetch order details from DB (items, total, user_email)
        
        # 3. Trigger Transactional Email 
        send_order_confirmation(
            user_email=order.user_email,
            order_data={
                "order_id": order.id,
                "items": order.items,
                "subtotal": order.subtotal,
                "tax": order.tax,
                "total": order.total
            }
        )

    return {"status": "success"}