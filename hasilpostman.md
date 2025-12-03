GET http://localhost:5000/:

{
    "success": true,
    "message": "Welcome to the E-commerce API",
    "data": {
        "hari": 3,
        "status": "success",
        "responseTime": "0ms",
        "note": "Gunakan header X-API-Key: 12345 untuk mengakses API",
        "available_categories": [
            "Electronics",
            "Books",
            "Clothing",
            "Home",
            "Sports"
        ]
    }
}

GET http://localhost:5000/api/products:

{
    "success": true,
    "message": "Products list",
    "data": [
        {
            "id": 1,
            "name": "Laptop",
            "price": 1500,
            "description": "A high-performance laptop",
            "category": "Electronics"
        },
        {
            "id": 2,
            "name": "Smartphone",
            "price": 800,
            "description": "A latest model smartphone",
            "category": "Electronics"
        },
        {
            "id": 3,
            "name": "Novel Book",
            "price": 20,
            "description": "A best-selling novel",
            "category": "Books"
        }
    ]
}

GET http://localhost:5000/api/search/1:

{
    "success": true,
    "message": "Product founded",
    "data": {
        "id": 1,
        "name": "Laptop",
        "price": 1500,
        "description": "A high-performance laptop",
        "category": "Electronics"
    }
}

GET http://localhost:5000/api/search/?name=Laptop:
GET http://localhost:5000/api/search/?category=Electronics:
GET http://localhost:5000/api/search/?max_price=1500:

{
    "success": true,
    "message": "Search results",
    "data": [
        {
            "id": 1,
            "name": "Laptop",
            "price": 1500,
            "description": "A high-performance laptop",
            "category": "Electronics"
        }
    ]
}

GET http://localhost:5000/api/categories/Books:

{
    "success": true,
    "message": "Products in category: Books",
    "data": [
        {
            "id": 3,
            "name": "Novel Book",
            "price": 20,
            "description": "A best-selling novel",
      {
      "category": "Books"
        }
    ]
}

POST http://localhost:5000/api/products:

{
    "success": true,
    "message": "Product created successfully",
    "data": {
        "id": 4,
        "name": "TWS moondrop",
        "description": "good quality",
        "category": "Electronics",
        "price": 100
    }
}

PUT http://localhost:5000/api/products/4:

{
    "success": true,
    "message": "Product updated successfully",
    "data": {
        "id": 4,
        "name": "TWS moondrop X hololive",
        "description": "good quality, zeta bonus voice",
        "category": "Electronics",
        "price": 150
    }
}

DELETE http://localhost:5000/api/products/4:

{
    "success": true,
    "message": "Product deleted successfully",
    "data": {
        "id": 4,
        "name": "TWS moondrop X hololive",
        "description": "good quality, zeta bonus voice",
        "category": "Electronics",
        "price": 150
    }
}

