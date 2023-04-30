import no_image from "../public/no_image.png";

export function parseError(e: unknown) {
  let errorMessage: string = "Unknown error while adding product";
  if (typeof e === "string") {
    errorMessage = e;
  } else if (e instanceof Error) {
    errorMessage = e.message;
  }

  return errorMessage;
}

export function returnKeyByValue(text: string) {
  if (text == "Name") {
    return "name";
  } else if (text == "Category") {
    return "category";
  } else if (text == "Quantity Sold") {
    return "quantity_sold";
  } else if (text == "Quantity Left") {
    return "quantity_left";
  } else if (text == "Price") {
    return "price";
  } else if (text == "Description") {
    return "description";
  } else if (text == "Created at" || text == "Date ordered") {
    return "created_at";
  } else if (text == "Last updated") {
    return "updated_at";
  } else if (text == "ID") {
    return "id";
  } else if (text == "Total price") {
    return "total_price";
  } else if (text == "Delivery mode") {
    return "delivery_mode";
  } else if (text == "Status") {
    return "status";
  } else if (text == "User ID") {
    return "user_id";
  } else if (text == "Date cleared") {
    return "date_cleared";
  }
}

export function getImageInProduct(product: any) {
  if (product.images) {
    if (product.images.length > 0) {
      for (let i = 0; i < product.images.length; i++) {
        if (product.images[0] != null) {
          return product.images[0];
        }
      }
    }
  }
  return no_image;
}

export function computeSubtotalInCart(cart: any) {
  let sum = 0;
  if (cart) {
    if (cart.products) {
      for (let i = 0; i < cart.products.length; i++) {
        sum += cart.products[i].quantity * cart.products[i].price;
      }
    }
  }
  return sum;
}
