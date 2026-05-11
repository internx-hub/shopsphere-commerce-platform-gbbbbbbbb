# test_products.py

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


# ---------------------------------------------------
# TEST CREATE PRODUCT SUCCESS
# ---------------------------------------------------

def test_create_product_success():

    response = client.post(
        "/api/products/",
        json={
            "name": "iPhone",
            "description": "Apple mobile",
            "price": 999.99
        }
    )

    assert response.status_code == 201

    data = response.json()

    assert data["name"] == "iPhone"
    assert data["price"] == 999.99


# ---------------------------------------------------
# TEST INVALID PRODUCT INPUT
# ---------------------------------------------------

def test_create_product_invalid():

    response = client.post(
        "/api/products/",
        json={
            "name": "",
            "price": -100
        }
    )

    assert response.status_code == 422


# ---------------------------------------------------
# TEST GET PRODUCTS PAGINATION
# ---------------------------------------------------

def test_get_products():

    response = client.get(
        "/api/products/?page=1&limit=5"
    )

    assert response.status_code == 200

    assert isinstance(response.json(), list)