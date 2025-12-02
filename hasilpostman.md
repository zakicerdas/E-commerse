GET http://localhost:5000/:

{
    "message": "Welcome to the E-commerce API",
    "hari": 3,
    "status": "success"
}

GET http://localhost:5000/api/products:

{
    "success": true,
    "jumlah": 3,
    "data": [
        {
            "id": 1,
            "name": "Laptop",
            "price": 8000000
        },
        {
            "id": 2,
            "name": "Smartphone",
            "price": 2000000
        },
        {
            "id": 3,
            "name": "Headphones",
            "price": 500000
        }
    ]
}

GET http://localhost:5000/api/products/1:

{
    "success": true,
    "data": {
        "id": 1,
        "name": "Laptop",
        "price": 8000000
    }
}

GET http://localhost:5000/api/search/?name=Headphone:

{
    "success": true,
    "data": [
        {
            "id": 3,
            "name": "Headphones",
            "price": 500000
        }
    ]
}

POST http://localhost:5000/api/products:

{
    "success": true,
    "data": {
        "id": 4,
        "name": "dakimakura Mon3ter",
        "price": 50000
    }
}

PUT http://localhost:5000/api/products/4:

{
    "success": true,
    "data": {
        "id": 4,
        "name": "dakimakura Elysia",
        "price": 65000
    },
    "message": "Product updated successfully"
}

DELETE http://localhost:5000/api/products/4:

{
    "success": true,
    "data": {
        "id": 4,
        "name": "dakimakura Elysia",
        "price": 65000
    },
    "message": "Product deleted successfully"
}