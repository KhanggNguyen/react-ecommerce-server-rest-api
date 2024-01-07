# Simple eCommerce API

Welcome to the documentation for my simple eCommerce API. This API provides a set of endpoints to manage and interact with my https://react-rest-ecommerce.onrender.com eCommerce platform. Whether you're building a web application, mobile app, or integrating with other services, this API can help you power your eCommerce experience.

## Getting Started

### Base URL

Make all requests to the following base URL:

### Authentication

To use this API, you need to include your API key in the `Authorization` header of your requests.

```http
Authorization: Bearer API_KEY
```

#### Products
<details>
 <summary><code>GET</code> <code><b>/api/product</b></code> <code>(Fetch all products)</code></summary>
 
##### Parameters

> None


##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json;        | `{"products": []}`                                |
> | `201`         | `application/json;        | ``                                |
> | `400`         | `application/json`                | `{"code":"400","message":"Bad Request"}`                            |
> | `405`         | `text/html;charset=utf-8`         | None                                                                |

##### Example cURL

> ```javascript
>  curl -X GET -H "Content-Type: application/json" https://react-rest-ecommerce.onrender.com/api/product
> ```

</details>

<details>
 <summary><code>GET</code> <code><b>/api/product?productId={productId}</b></code> <code>(Fetch product by product id)</code></summary>
 
##### Parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | productId   |  required | string   | N/A  |


##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json;        | `{"products": []}`                                |
> | `201`         | `application/json;        | ``                                |
> | `400`         | `application/json`                | `{"code":"400","message":"Bad Request"}`                            |
> | `405`         | `text/html;charset=utf-8`         | None                                                                |

##### Example cURL

> ```javascript
>  curl -X GET -H "Content-Type: application/json" https://react-rest-ecommerce.onrender.com/api/product?productId={productId}
> ```

</details>

<details>
 <summary><code>GET</code> <code><b>/api/product?category={categoryId}</b></code> <code>(Fetch product by category id)</code></summary>
 
##### Parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | categoryId   |  required | string   | N/A  |


##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json;        | `{"products": []}`                                |
> | `201`         | `application/json;        | ``                                |
> | `400`         | `application/json`                | `{"code":"400","message":"Bad Request"}`                            |
> | `405`         | `text/html;charset=utf-8`         | None                                                                |

##### Example cURL

> ```javascript
>  curl -X GET -H "Content-Type: application/json" https://react-rest-ecommerce.onrender.com/api/product?categoryId={categoryId}
> ```

</details>

<details>
 <summary><code>POST</code> <code><b>/api/admin/product</b></code> <code>(Create a new product)</code></summary>
 
##### Headers

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | Authorization   |  required | string   |  Bearer API_KEY | 
> | Content-type   |  required | string   | application/json | 
 
##### Parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | name   |  required | string   | N/A  |
> | price   |  required | string   | N/A  |
> | productPicture   |  required | files   | N/A  |
> | description   |  required | string   | N/A  |
> | quantity   |  required | string   | N/A  |
> | category   |  required | string   | N/A  |


##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json;        | `{"products": []}`                                |
> | `201`         | `application/json;        | `{"products": []}`                                |
> | `400`         | `application/json`                | `{"code":"400","message":"Bad Request"}`                            |
> | `405`         | `text/html;charset=utf-8`         | None                                                                |

##### Example cURL

> ```javascript
>  curl -X POST -H "Content-Type: application/json" -H 'Content-type:application/json,Authorization: Bearer ...' -d '{"name": "something name", "...":"...",etc.}' https://react-rest-ecommerce.onrender.com/api/product
> ```

</details>

<details>
 <summary><code>PUT</code> <code><b>/api/admin/product</b></code> <code>(Update a product)</code></summary>
 
##### Headers

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | Authorization   |  required | string   |  Bearer API_KEY | 
> | Content-type   |  required | string   | application/json | 
 
##### Parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | _id   |  required | string   | product id  |
> | name   |  required | string   | N/A  |
> | price   |  required | string   | N/A  |
> | productPicture   |  required | files   | N/A  |
> | description   |  required | string   | N/A  |
> | quantity   |  required | string   | N/A  |
> | category   |  required | string   | N/A  |


##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json;        | `{"products": []}`                                |
> | `201`         | `application/json;        | `{"products": []}`                                |
> | `400`         | `application/json`                | `{"code":"400","message":"Bad Request"}`                            |
> | `405`         | `text/html;charset=utf-8`         | None                                                                |

##### Example cURL

> ```javascript
>  curl -X PUT -H "Content-Type: application/json" -H 'Content-type:application/json,Authorization: Bearer ...' -d '{"name": "something name", "...":"...",etc.}' https://react-rest-ecommerce.onrender.com/api/product
> ```

</details>

<details>
 <summary><code>DEL</code> <code><b>/api/admin/product</b></code> <code>(Delete a product)</code></summary>
 
##### Headers

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | Authorization   |  required | string   |  Bearer API_KEY | 
> | Content-type   |  required | string   | application/json | 
 
##### Parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | productId   |  required | string   | product id  |


##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json;        | `{"products": []}`                                |
> | `201`         | `application/json;        | `{"products": []}`                                |
> | `400`         | `application/json`                | `{"code":"400","message":"Bad Request"}`                            |
> | `405`         | `text/html;charset=utf-8`         | None                                                                |

##### Example cURL

> ```javascript
>  curl -X DELETE -H "Content-Type: application/json" -H 'Content-type:application/json,Authorization: Bearer ...' -d '{"productId": "id of product"}' https://react-rest-ecommerce.onrender.com/api/product
> ```

</details>
------------------------------------------------------------------------------------------