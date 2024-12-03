## route.js

This API extracts structured data from unstructured grocery receipt text using OpenAI's GPT-4o-mini model. The extracted data is returned in a predefined schema, categorized into food groups, and excludes non-food items.

The extracted structured information, is listed:

- Item Name
- Item Price (Per Item)
- Item Quantity
- Total Item Price (Collective Total for an Item)
- Food Group (categorized into Fruits, Vegetables, Protein, Grains, Dairy, or Uncategorized)
- Receipt Date

The receipt date is formatted as `mm/dd/yyyy`. Items that are not food-related are ignored.

---

## Usage

Ensure you have your API key located in `.env.local`

1. Send a POST request to the `/api/openai` endpoint with the following JSON structure:

   ```json
   {
     "prompt": "<Unstructured grocery receipt text>"
   }
   ```

2. The application processes the input and returns a structured response. For example:
   ```json
   {
     "response": {
       "receiptDate": "01/23/2024",
       "groceries": [
         {
           "itemName": "Bananas",
           "itemPrice": 1.2,
           "quantity": 3,
           "foodGroup": "Fruits",
           "totalPrice": 3.6
         }
       ]
     }
   }
   ```

---

## OpenAI Error Codes

| **Error Code** | **Meaning**                                                       | **Resolution**                                             |
| -------------- | ----------------------------------------------------------------- | ---------------------------------------------------------- |
| **400**        | Bad Request: Check the prompt structure or API request.           | Verify request parameters and JSON structure.              |
| **401**        | Unauthorized: Invalid API key or insufficient permissions.        | Ensure your API key is valid and has required permissions. |
| **403**        | Forbidden: Access to the requested resource is denied.            | Check access levels and API restrictions.                  |
| **404**        | Not Found: The requested endpoint or resource could not be found. | Verify the endpoint URL.                                   |
| **429**        | Rate Limit Exceeded: Too many requests in a short time.           | Add a retry mechanism with exponential backoff.            |
| **500**        | Internal Server Error: A problem occurred on OpenAI's end.        | Retry the request after some time.                         |
| **503**        | Service Unavailable: OpenAI is temporarily unavailable.           | Retry after some time.                                     |
|                |
