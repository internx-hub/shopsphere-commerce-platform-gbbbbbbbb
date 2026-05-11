from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


# ---------------------------------------------------
# TEST 1
# LIST PRODUCTS RETURNS PAGINATED RESULTS
# ---------------------------------------------------

def test_list_products_paginated():

    response = client.get(
        "/api/products/?page=1&limit=5"
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)

    assert len(data) <= 5


# ---------------------------------------------------
# TEST 2
# CREATE PRODUCT RETURNS 201
# ---------------------------------------------------

def test_create_product_returns_201():

    response = client.post(
        "/api/products/",
        json={
            "name": "Laptop",
            "description": "Gaming Laptop",
            "price": 1500,
            "stock_quantity": 10
        }
    )

    assert response.status_code == 201

    data = response.json()

    assert data["name"] == "Laptop"

    assert data["stock_quantity"] == 10


# ---------------------------------------------------
# TEST 3
# GET PRODUCT RETURNS 404 FOR MISSING ID
# ---------------------------------------------------

def test_get_product_missing_returns_404():

    response = client.get(
        "/api/products/999999"
    )

    assert response.status_code == 404


# ---------------------------------------------------
# TEST 4
# UPDATE PRODUCT RETURNS 403 FOR NON-ADMIN
# ---------------------------------------------------

def test_update_product_non_admin_returns_403():

    # create product first
    create_response = client.post(
        "/api/products/",
        json={
            "name": "Phone",
            "description": "Android Phone",
            "price": 500,
            "stock_quantity": 5
        }
    )

    product = create_response.json()

    # update without admin auth
    response = client.put(
        f"/api/products/{product['id']}",
        json={
            "name": "Updated Phone",
            "description": "Updated",
            "price": 700,
            "stock_quantity": 10
        }
    )

    # expected protected route
    assert response.status_code == 403


# ---------------------------------------------------
# TEST 5
# CREATE PRODUCT WITH NEGATIVE STOCK RETURNS 422
# ---------------------------------------------------

def test_create_product_negative_stock_returns_422():

    response = client.post(
        "/api/products/",
        json={
            "name": "Keyboard",
            "description": "Mechanical Keyboard",
            "price": 100,
            "stock_quantity": -5
        }
    )

    assert response.status_code == 422