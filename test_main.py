# test_main.py

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


# ---------------------------------------------------
# TEST 1: NEGATIVE STOCK SHOULD FAIL
# ---------------------------------------------------

def test_create_product_negative_stock():
    response = client.post(
        "/api/products",
        json={
            "name": "Laptop",
            "price": 1000,
            "stock_quantity": -5
        }
    )

    assert response.status_code == 422


# ---------------------------------------------------
# TEST 2: INSUFFICIENT STOCK SHOULD RETURN 409
# ---------------------------------------------------

def test_order_insufficient_stock():

    # CREATE PRODUCT
    product_response = client.post(
        "/api/products",
        json={
            "name": "Phone",
            "price": 500,
            "stock_quantity": 2
        }
    )

    product = product_response.json()

    # TRY ORDERING MORE THAN AVAILABLE
    response = client.post(
        "/api/orders",
        json={
            "product_id": product["id"],
            "quantity": 5
        }
    )

    assert response.status_code == 409
    assert response.json()["detail"] == "Insufficient stock"


# ---------------------------------------------------
# TEST 3: SUCCESSFUL ORDER SHOULD REDUCE STOCK
# ---------------------------------------------------

def test_order_reduces_stock():

    # CREATE PRODUCT
    product_response = client.post(
        "/api/products",
        json={
            "name": "Keyboard",
            "price": 50,
            "stock_quantity": 10
        }
    )

    product = product_response.json()

    # PLACE ORDER
    order_response = client.post(
        "/api/orders",
        json={
            "product_id": product["id"],
            "quantity": 3
        }
    )

    assert order_response.status_code == 201

    # FETCH UPDATED PRODUCT
    updated_product_response = client.get(
        f"/api/products/{product['id']}"
    )

    updated_product = updated_product_response.json()

    assert updated_product["stock_quantity"] == 7