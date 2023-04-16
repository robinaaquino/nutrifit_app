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
  } else if (text == "Created at") {
    return "created_at";
  } else if (text == "Last updated") {
    return "updated_at";
  }
}
