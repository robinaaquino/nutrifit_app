import GoogleSignInButton from "./GoogleSignInButton";

export default function SocialMediaLogin({
  addDivider,
}: {
  addDivider?: boolean;
}) {
  return (
    <>
      <div className="my-2">
        {addDivider ? (
          <>
            <p className="mb-6 text-base text-black">or login via</p>
          </>
        ) : null}
        <ul className="-mx-2 mb-12 flex justify-between">
          <li className="w-full px-2" key="google">
            <GoogleSignInButton />
          </li>
        </ul>
      </div>
    </>
  );
}
