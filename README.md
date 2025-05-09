# Kundenbestellungenv2

This is a simple order tracking system with a frontend built using HTML, Tailwind CSS, and JavaScript, and a backend using Node.js and Express.

## Features

- Create new orders with customer information and order details.
- View orders with filtering by status.
- Edit and delete orders.
- Orders are stored in a JSON file on the server.

## Setup

1. Clone the repository.
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm start
   ```
4. Open your browser and navigate to:
   - Orders page: `http://localhost:3000/index.html`
   - Create order page: `http://localhost:3000/create-order.html`

## Usage

- Use the "Create Order" page to add new orders.
- Use the "Orders" page to view, filter, refresh, edit, and delete orders.

## Notes

- This is a simple demo application and does not include authentication or database persistence.
- Orders are saved in `orders.json` file in the project directory.

## License

MIT License
