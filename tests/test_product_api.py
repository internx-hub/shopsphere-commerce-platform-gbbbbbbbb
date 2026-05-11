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
            "price": 1000,
            "stock_quantity": 10
        }
    )

    assert response.status_code == 201


# ---------------------------------------------------
# TEST 3
# GET PRODUCT RETURNS 404
# ---------------------------------------------------

def test_get_missing_product_returns_404():

    response = client.get(
        "/api/products/999999"
    )

    assert response.status_code == 404


# ---------------------------------------------------
# TEST 4
# UPDATE PRODUCT RETURNS 403 FOR NON ADMIN
# ---------------------------------------------------

def test_update_product_returns_403_for_non_admin():

    response = client.put(
        "/api/products/1",
        json={
            "name": "Phone",
            "price": 100,
            "stock_quantity": 5
        }
    )

    assert response.status_code == 403


# ---------------------------------------------------
# TEST 5
# NEGATIVE STOCK RETURNS 422
# ---------------------------------------------------

def test_negative_stock_returns_422():

    response = client.post(
        "/api/products/",
        json={
            "name": "Keyboard",
            "price": 50,
            "stock_quantity": -10
        }
    )

    assert response.status_code == 422