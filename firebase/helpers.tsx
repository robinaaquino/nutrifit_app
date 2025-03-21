import no_image from "../public/no_image.png";
import format from "date-fns/format";
import { ErrorCodes } from "./constants/success_and_error_codes";

//check all
export function parseError(e: unknown) {
  let message: string = "";
  if (typeof e === "string") {
    message = e;
  } else if (e instanceof Error) {
    message = e.message;
  }

  for (const [key, value] of Object.entries(ErrorCodes)) {
    let regexExp = `^.*` + key + `.*$`;
    if (message.toLowerCase().match(regexExp)) {
      message = value;
      break;
    }
  }

  return message;
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
  } else if (text == "First name") {
    return "first_name";
  } else if (text == "Last name") {
    return "last_name";
  } else if (text == "Role") {
    return "role";
  } else if (text == "Email") {
    return "email";
  } else if (text == "Sales") {
    return "sales";
  } else if (text == "Message") {
    return "message";
  } else if (text == "Date cleared") {
    return "date_cleared";
  } else if (text == "Date") {
    return "date";
  } else if (text == "Name") {
    return "name";
  } else if (text == "Contact Number") {
    return "contact_number";
  } else if (text == "Reviewed by Admin") {
    return "reviewed_by_admin";
  } else if (text == "Program") {
    return "program";
  } else if (text == "Height") {
    return "height";
  } else if (text == "Weight") {
    return "weight";
  } else if (text == "Age") {
    return "age";
  } else if (text == "Date submitted") {
    return "date";
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

export function formatDate(date: string) {
  try {
    const dateObject = new Date(date);
    return format(dateObject, "MM/dd/yyyy p");
  } catch (e: unknown) {
    return date;
  }
}

export function splitLabel(text: string) {
  const textArray: string[] = text.split("-");
  if (textArray.length > 1) {
    return textArray;
  } else {
    return text;
  }
}

export function returnDateForInput() {
  const currentDate = new Date();
  const day =
    currentDate.getDate() < 10
      ? "0" + currentDate.getDate()
      : currentDate.getDate();
  const month =
    currentDate.getMonth() + 1 < 10
      ? "0" + (currentDate.getMonth() + 1)
      : currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const parsedDate = year + "-" + month + "-" + day;
  return parsedDate;
}
