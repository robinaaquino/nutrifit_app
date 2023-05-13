import WarningMessage from "../WarningMessage";
import { useState } from "react";

export default function InputComponent({
  id,
  name,
  label,
  placeholder,
  value,
  register,
  rules,
  error,
  type,
  disabled,
}: {
  id: any;
  name: any;
  label: any;
  type: any;
  placeholder?: any;
  value?: any;
  register?: any;
  rules?: any;
  error?: any;
  disabled?: any;
}) {
  const errorObject = error[name];
  const hasError = !!(error && errorObject);
  const [capsLock, setCapsLock] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const checkCapsLock = (event: any) => {
    if (event.getModifierState("CapsLock")) {
      setCapsLock(true);
    } else {
      setCapsLock(false);
    }
  };

  const changePasswordVisibility = () => {
    var passwordElement: HTMLScriptElement | null = document.getElementById(
      "password"
    ) as HTMLScriptElement;
    if (passwordElement.type == "password") {
      passwordElement.type = "text";
      setPasswordVisible(true);
    } else {
      passwordElement.type = "password";
      setPasswordVisible(false);
    }
  };

  return (
    <>
      {type == "password" ? (
        <>
          <div className="mb-6">
            <div className="relative">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-left"
                htmlFor={id}
              >
                {label}
              </label>
              <input
                id={id}
                name={name}
                type={type}
                aria-label={label}
                aria-invalid={hasError}
                onKeyUp={(e: any) => checkCapsLock(e)}
                placeholder={placeholder}
                value={value}
                disabled={disabled}
                {...(register && register(name, rules))}
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              />
              {hasError && <WarningMessage text={errorObject.message} />}
              <div className="absolute right-0 top-6">
                <button
                  type="button"
                  onClick={() => changePasswordVisibility()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    className={
                      passwordVisible
                        ? " bi bi-eye mr-12 mt-3 cursor-pointer text-black"
                        : "bi bi-eye mr-12 mt-3 cursor-pointer"
                    }
                    viewBox="0 0 16 16"
                  >
                    {passwordVisible ? (
                      <>
                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                      </>
                    ) : (
                      <>
                        <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                        <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                        <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
                      </>
                    )}
                  </svg>
                </button>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className={
                    capsLock
                      ? "bi bi-capslock absolute top-0 right-0 mr-3 mt-3 text-black"
                      : "bi bi-capslock absolute top-0 right-0 mr-3 mt-3"
                  }
                  viewBox="0 0 16 16"
                >
                  {capsLock ? (
                    <path d="M7.27 1.047a1 1 0 0 1 1.46 0l6.345 6.77c.6.638.146 1.683-.73 1.683H11.5v1a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-1H1.654C.78 9.5.326 8.455.924 7.816L7.27 1.047zM4.5 13.5a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-1z" />
                  ) : (
                    <path
                      fill-rule="evenodd"
                      d="M7.27 1.047a1 1 0 0 1 1.46 0l6.345 6.77c.6.638.146 1.683-.73 1.683H11.5v1a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-1H1.654C.78 9.5.326 8.455.924 7.816L7.27 1.047zM14.346 8.5 8 1.731 1.654 8.5H4.5a1 1 0 0 1 1 1v1h5v-1a1 1 0 0 1 1-1h2.846zm-9.846 5a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-1zm6 0h-5v1h5v-1z"
                    />
                  )}
                </svg>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-left"
              htmlFor={id}
            >
              {label}
            </label>
            <input
              id={id}
              name={name}
              type={type}
              aria-label={label}
              aria-invalid={hasError}
              placeholder={placeholder}
              value={value}
              disabled={disabled}
              {...(register && register(name, rules))}
              className={
                hasError
                  ? `block appearance-none w-full bg-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 border border-red-500`
                  : `block appearance-none w-full bg-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 border border-gray-200`
              }
            />
            {hasError && <WarningMessage text={errorObject.message} />}
          </div>
        </>
      )}
    </>
  );
}
