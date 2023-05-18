export const ErrorCodes = {
  "email-already-in-use":
    "The email address is already in use by another account.",
  "invalid-user-token": "Error with user details. Try logging in again.",
  "invalid-email": "The email address is not allowed",
  "unauthorized-domain": "Error with URL domain. Please, contact the admin.",
  "account-exists-with-different-credential":
    "This account already exists. Login using this account.",
  "network-request-failed":
    "A network error has occurred. Please, contact the admin.",
  "popup-blocked":
    "Unable to establish a connection with the popup. It may have been blocked by the browser.",
  "popup-closed-by-user":
    "The popup has been closed by the user before finalizing the operation.",
  "provider-already-linked": "User can only login by either Google or Email",
  "quota-exceeded": "Error with project requests. Please, contact the admin.",
  timeout: "The operation has timed out. Try again.",
  "user-token-expired":
    "Error with user token expiration. Try logging in again.",
  "too-many-requests": "You have too many requests. Try again later.",
  "user-not-found": "User does not exist. Sign up first.",
  "user-disabled": "The user account has been disabled by an administrator.",
  "wrong-password": "Wrong password. Try again",
  "Invalid document reference":
    "Issues with document access. Please, contact the admin",

  "login-google":
    "An error has occurred while you were logging in using Google. Try again or contact the administrator",
  "login-email":
    "An error has occurred while you were logging in using your email and password. Try again or contact the administrator",
  "signup-email":
    "An error has occurred while you were creating an account. Try again or contact the administrator",
  "reset-password":
    "An error has occurred while you were resetting your password. Try again or contact the administrator",
  "initialize-cart":
    "An error has occurred while we were creating your cart. Try again or contact the administrator",
  "add-cart":
    "An error has occurred while we were adding your item to your cart. Try again or contact the administrator",
  "remove-cart-cart-does-not-exist":
    "Your cart does not exist in our database. Try again later",
  "remove-cart-product-does-not-exist":
    "That product in your cart does not exist in our database. Try again later or contact the administrator",
  "remove-cart":
    "An error has occurred while we were removing an item from your cart. Try again or contact the administrator",
  "clear-cart":
    "An error has occurred while we were clearing your cart. Try again or contact the administrator",
  "clear-cart-no-cart":
    "Your cart does not exist in our database. It is already cleared",
  "get-cart-given-id":
    "An error has occurred while we were getting the cart information. Try again or contact the administrator",
  "get-all-users":
    "An error has occurred while we were getting the information of all users. Try again or contact the administrator",
  "get-all-documents":
    "An error has occurred while we were getting the information of all documents. Try again or contact the administrator",
  "get-all-documents-given-user-id":
    "An error has occurred while we were getting the information of all documents given user id. Try again or contact the administrator",
  "get-document":
    "An error has occurred while we were getting the information of a document. Try again or contact the administrator",
  "add-user":
    "An error has occurred while we were adding a user. Try again or contact the administrator",
  "get-user":
    "An error has occurred while we were retrieving user information given ID. Try again or contact the administrator",
  "get-user-given-email":
    "An error has occurred while we were retrieving user information given email. Try again or contact the administrator",
  "update-user":
    "An error has occurred while we were updating the user information. Try again or contact the administrator",
  "update-product":
    "An error has occurred while we were updating the product information. Try again or contact the administrator",
  "update-message":
    "An error has occurred while we were updating the message information. Try again or contact the administrator",
  "update-order":
    "An error has occurred while we were updating the order information. Try again or contact the administrator",
  "update-wellness-survey-result":
    "An error has occurred while we were updating the wellness survey result information. Try again or contact the administrator",
  "user-authorized":
    "An error has occurred while we were checking user authorization. Try again or contact the administrator",
  "apply-filters":
    "An error has occurred while applying filters. Try again or contact the administrator",
  "apply-search":
    "An error has occurred while searching. Try again or contact the administrator",
  delete:
    "An error has occurred while deleting the item. Try again or contact the administrator",
  "add-product":
    "An error has occurred while we were adding a product. Try again or contact the administrator",
  "add-message":
    "An error has occurred while we were sending a message. Try again or contact the administrator",
  "add-order":
    "An error has occurred while we were adding a order. Try again or contact the administrator",
  "add-wellness-survey-result":
    "An error has occurred while we were adding a wellness survey. Try again or contact the administrator",
  "best-selling-products":
    "An error has occurred while we were looking for the best selling products. Try again or contact the administrator",
  "no-product-quantity-left":
    "There's insufficient quantity to add the product to your cart",
  "no-items-in-cart":
    "There are no items in your cart. Add products before trying again",
  "error-in-cart-product-quantity":
    "Your cart has a product with too much quantity. This product has been removed. Please, try again",
  "user-pending-orders":
    "User still has pending orders. Resolve all pending orders before deleting the user",
  "user-pending-orders-error":
    "An error has occurred while we were retrieving the pending orders of the user. Try again or contact the administrator",
  "email-verification":
    "An error has occurred while we were sending a verification email. Try again or contact the administrator",
  "email-not-verified":
    "Your email is not yet verified. Please, verify your email in your profile before checkout",
  "invalid-format":
    "You have uploaded the incorrect file. Only images are accepted",
  "unauthorized-access": "You are not authorized to view this page",
};

export const SuccessCodes = {
  "login-google": "You have successfully logged in using Google",
  "login-email":
    "You have successfully logged in using your email and password",
  "signup-email":
    "You have successfully created your account using email and password",
  "reset-password":
    "Check your email and follow the instructions to reset your password",
  "initialize-cart": "You have created a new cart",
  "initialize-cart-with-product": "You have added a product to your cart",
  "add-cart": "You have successfully added an item to your cart",
  "remove-cart": "You have successfully removed an item from your cart",
  "clear-cart": "You have successfully clear your cart",
  "get-cart-given-id": "You have successfully retrieved cart info",
  "get-all-users": "All user information have been retrieved",
  "get-all-documents": "All information have been retrieved",
  "get-all-documents-given-user-id":
    "All information have been retrieved given user id",
  "get-document": "Document information have been retrieved",
  "document-does-not-exist": "Document does not exist",
  "add-user": "You have successfully created a user",
  "add-product": "You have successfully created a product",
  "add-message": "You have successfully created a message",
  "add-order": "You have successfully created a order",
  "add-wellness-survey-result":
    "You have successfully submitted a wellness survey. Please, wait for a message from our administrators",
  "get-user": "You have successfully retrieved user info",
  "get-user-does-not-exist": "User does not exist",
  "update-user": "You have successfully updated your information",
  "update-product": "You have successfully updated your product",
  "update-message": "You have successfully updated your message",
  "update-order": "You have successfully updated your order",
  "update-wellness-survey-result":
    "You have successfully updated the wellness survey",
  "user-authorized":
    "You have successfully retrieved user authorization status",
  "apply-filters":
    "You have successfully retrieved information with the filters",
  "apply-search":
    "You have successfully retrieved information with the given search string",
  delete: "You have successfully deleted the item",
  "best-selling-products":
    "You have successfully retrieved the top best selling products",
  "user-pending-orders":
    "You have successfully retrieved all the pending orders of the user",
  "email-verification":
    "We have sent you a verification email. Please, check your email",
};
