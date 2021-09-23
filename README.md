# Inventory Manager

 ## Overview

 This is an inventory web application with a user authentication mechanism. Authorized users are allowed to manage inventory items, make sales and restock items that are low in stock.

 This project is made with a frontend of HTML + CSS + Bootstrap, a backend of JavaScript + Express and a MongoDB database to store items.

 ## User Stories

 1. As a non-connected user, I can create an account or log in to an existing account
 2. As a user, I can see a list of products, sales and restock orders in my inventory
 3. As a user, I can add new products to my inventory
 4. As a user, I can make a sale from the available products in my inventory that will update the quantity available accordingly
 5. As a user, I can place restock orders for any of the products in my inventory that will update the quantity availably accordingly
 6. As a user, I can search for products, sales and restock orders by their name or category using the search bar
 7. As a user, I can sort products, sales and restock orders by their name or price
 8. As a user, I can filter products, sales and restock orders using comparison operators
 9. As a user, I can update products, sales and restock orders
 10. As a user, I can delete products, sales and restock orders from my repository

 ## Data Model

 The application stores Users, Products, Sales and Restocks

 **Users**
 * Contain name, email and password

 An example User:
 
 ```javascript
 {
   name: "John Apple",
   email: "japple@gmail.com",
   password: "(Some encrypted password)"
 }
 ```
 
 **Products**
 * Contain name, category, price and quantity

 An example Product:
 
 ```javascript
 {
   name: "iPhone 12",
   category: "Mobile",
   price: 1000,
   quantity: 15
 }
 ```
 
 **Sales**
 * Contain name, category, price, quantity, discount and total
 
 An example Sale:
 
 ```javascript
 {
   name: "MacBook Pro",
   category: "Laptop",
   price: 1000,
   quantity: 5,
   discount: 10%,
   total: 4500
 }
 ```
 
 **Restocks**
 * Contain name, category, price, quantity, total and status

 An example Restock:
 
  ```javascript
 {
   name: "Chocolate",
   category: "Food",
   price: 10,
   quantity: 3,
   total: 30,
   status: "processing"
 }
 ```
