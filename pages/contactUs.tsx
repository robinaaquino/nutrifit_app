import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { useAuthContext } from "@/context/AuthContext";
import { addMessageFunction } from "@/firebase/firebase_functions/messages_functions";
import WarningMessage from "@/components/forms/WarningMessage";
import HeadingOne from "@/components/forms/HeadingOne";

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { success, error } = useAuthContext();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      inputName: "",
      inputEmail: "",
      inputMessage: "",
    },
  });

  const mapContainer = useRef<any>(null);
  const geocoderContainer = useRef<any>(null);
  const map = useRef<any>(null);
  const [lng, setLng] = useState(120.46851434051715);
  const [lat, setLat] = useState(14.86645035829063);
  const [zoom, setZoom] = useState(15);

  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOXGL_ACCESS_TOKEN || "";

  const handleForm = async (data: any, e: any) => {
    e.preventDefault();
    const { inputName, inputEmail, inputMessage } = data;

    const result = await addMessageFunction({
      name: inputName,
      email: inputEmail,
      message: inputMessage,
    });

    if (result.isSuccess) {
      success(result.message);
      await discardChanges();
    } else {
      error(result.message);
    }
  };

  const discardChanges = async () => {
    reset();
    setName("");
    setEmail("");
    setMessage("");
  };

  useEffect(() => {
    if (!mapContainer.current) {
      return;
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current || "",
      style: "mapbox://styles/mapbox/streets-v12",
      center: [120.46851434051715, 14.86645035829063],
      zoom: zoom,
    });

    const marker = new mapboxgl.Marker({})
      .setLngLat([120.46851434051715, 14.86645035829063])
      .addTo(map.current);
  }, [mapContainer, map]);

  return (
    <>
      <section className="relative z-10 overflow-hidden bg-white py-20 lg:py-[120px]">
        <div className="container mx-auto">
          <div className="-mx-4 flex flex-wrap lg:justify-between">
            <div className="w-full px-4 lg:w-1/2 xl:w-5/12">
              <div className="relative rounded-lg bg-white p-8 shadow-lg sm:p-12">
                <HeadingOne
                  label="Got any questions or concerns?"
                  id="contactUsHeading"
                />
                <span className="text-black mb-4 block  font-semibold">
                  Contact Us
                </span>
                <form onSubmit={handleSubmit(handleForm)}>
                  <div className="mb-6">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-last-name"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Type your name..."
                      className="text-black bg-white border-[f0f0f0] focus:border-primary w-full rounded border py-3 px-[14px]  outline-none focus-visible:shadow-none"
                      {...register("inputName", {
                        required: "Name is required",
                        onChange: (e) => setName(e.target.value),
                      })}
                      aria-invalid={errors.inputName ? "true" : "false"}
                    />
                    {errors.inputName && (
                      <WarningMessage text={errors.inputName?.message} />
                    )}
                  </div>
                  <div className="mb-6">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-last-name"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="Type your email address..."
                      className="text-black bg-white border-[f0f0f0] focus:border-primary w-full rounded border py-3 px-[14px]  outline-none focus-visible:shadow-none"
                      {...register("inputEmail", {
                        required: "Email address is required",
                        pattern: {
                          value:
                            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/,
                          message:
                            "Follow the correct email format. An example is email@email.com",
                        },
                        onChange: (e) => setEmail(e.target.value),
                      })}
                      aria-invalid={errors.inputEmail ? "true" : "false"}
                    />
                  </div>
                  {errors.inputEmail && (
                    <WarningMessage text={errors.inputEmail?.message} />
                  )}
                  <div className="mb-6">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-last-name"
                    >
                      Message
                    </label>
                    <textarea
                      rows={6}
                      placeholder="Type your message..."
                      className="text-black bg-white border-[f0f0f0] focus:border-primary w-full resize-none rounded border py-3 px-[14px]  outline-none focus-visible:shadow-none"
                      {...register("inputMessage", {
                        required: "Message is required",
                        onChange: (e) => setMessage(e.target.value),
                      })}
                      aria-invalid={errors.inputMessage ? "true" : "false"}
                    ></textarea>
                    {errors.inputMessage && (
                      <WarningMessage text={errors.inputMessage?.message} />
                    )}
                  </div>
                  <div>
                    <button
                      type="submit"
                      className=" w-1/2 cursor-pointer rounded-md border bg-nf_green py-3 px-5 text-base text-white transition hover:bg-nf_dark_green"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="mt-12 w-full px-4 lg:w-1/2 xl:w-6/12">
              <div className="mb-12 max-w-[570px] lg:mb-0">
                <div className="mb-8 flex w-full max-w-[370px]">
                  <div className="bg-nf_green text-nf_yellow mr-6 flex h-[60px] w-full max-w-[60px] items-center justify-center overflow-hidden rounded  sm:h-[70px] sm:max-w-[70px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-house"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
                    </svg>
                  </div>
                  <div className="w-full">
                    <h4 className="text-black mb-1 text-xl font-bold">
                      Our Location
                    </h4>
                    <p className="text-black bg-white ">
                      Stall 4, Vision 2010 Bldg., #27 Rizal St., Dinalupihan,
                      Bataan
                    </p>
                  </div>
                </div>
                <div
                  id="mapId"
                  ref={mapContainer}
                  className="map-container w-full h-96"
                ></div>
                <div className="mt-4 mb-8 flex w-full max-w-[370px]">
                  <div className="bg-nf_green text-nf_yellow mr-6 flex h-[60px] w-full max-w-[60px] items-center justify-center overflow-hidden rounded  sm:h-[70px] sm:max-w-[70px]">
                    <svg
                      width="24"
                      height="26"
                      viewBox="0 0 24 26"
                      className="fill-current"
                    >
                      <path d="M22.6149 15.1386C22.5307 14.1704 21.7308 13.4968 20.7626 13.4968H2.82869C1.86042 13.4968 1.10265 14.2125 0.97636 15.1386L0.092295 23.9793C0.0501967 24.4845 0.21859 25.0317 0.555377 25.4106C0.892163 25.7895 1.39734 26 1.94462 26H21.6887C22.1939 26 22.6991 25.7895 23.078 25.4106C23.4148 25.0317 23.5832 24.5266 23.5411 23.9793L22.6149 15.1386ZM21.9413 24.4424C21.8992 24.4845 21.815 24.5687 21.6466 24.5687H1.94462C1.81833 24.5687 1.69203 24.4845 1.64993 24.4424C1.60783 24.4003 1.52364 24.3161 1.56574 24.1477L2.4498 15.2649C2.4498 15.0544 2.61819 14.9281 2.82869 14.9281H20.8047C21.0152 14.9281 21.1415 15.0544 21.1835 15.2649L22.0676 24.1477C22.0255 24.274 21.9834 24.4003 21.9413 24.4424Z" />
                      <path d="M11.7965 16.7805C10.1547 16.7805 8.84961 18.0855 8.84961 19.7273C8.84961 21.3692 10.1547 22.6742 11.7965 22.6742C13.4383 22.6742 14.7434 21.3692 14.7434 19.7273C14.7434 18.0855 13.4383 16.7805 11.7965 16.7805ZM11.7965 21.2008C10.9966 21.2008 10.3231 20.5272 10.3231 19.7273C10.3231 18.9275 10.9966 18.2539 11.7965 18.2539C12.5964 18.2539 13.2699 18.9275 13.2699 19.7273C13.2699 20.5272 12.5964 21.2008 11.7965 21.2008Z" />
                      <path d="M1.10265 7.85562C1.18684 9.70794 2.82868 10.4657 3.67064 10.4657H6.61752C6.65962 10.4657 6.65962 10.4657 6.65962 10.4657C7.92257 10.3815 9.18552 9.53955 9.18552 7.85562V6.84526C10.5748 6.84526 13.7742 6.84526 15.1635 6.84526V7.85562C15.1635 9.53955 16.4264 10.3815 17.6894 10.4657H17.7315H20.6363C21.4782 10.4657 23.1201 9.70794 23.2043 7.85562C23.2043 7.72932 23.2043 7.26624 23.2043 6.84526C23.2043 6.50847 23.2043 6.21378 23.2043 6.17169C23.2043 6.12959 23.2043 6.08749 23.2043 6.08749C23.078 4.90874 22.657 3.94047 21.9413 3.18271L21.8992 3.14061C20.8468 2.17235 19.5838 1.62507 18.6155 1.28828C15.795 0.193726 12.2587 0.193726 12.0903 0.193726C9.6065 0.235824 8.00677 0.446315 5.60716 1.28828C4.681 1.58297 3.41805 2.13025 2.36559 3.09851L2.3235 3.14061C1.60782 3.89838 1.18684 4.86664 1.06055 6.04539C1.06055 6.08749 1.06055 6.12959 1.06055 6.12959C1.06055 6.21378 1.06055 6.46637 1.06055 6.80316C1.10265 7.18204 1.10265 7.68722 1.10265 7.85562ZM3.37595 4.15097C4.21792 3.3932 5.27038 2.93012 6.15444 2.59333C8.34355 1.79346 9.7749 1.62507 12.1745 1.58297C12.3429 1.58297 15.6266 1.62507 18.1525 2.59333C19.0365 2.93012 20.089 3.3511 20.931 4.15097C21.394 4.65615 21.6887 5.32972 21.7729 6.12959C21.7729 6.25588 21.7729 6.46637 21.7729 6.80316C21.7729 7.22414 21.7729 7.68722 21.7729 7.81352C21.7308 8.78178 20.8047 8.99227 20.6784 8.99227H17.7736C17.3526 8.95017 16.679 8.78178 16.679 7.85562V6.12959C16.679 5.7928 16.4685 5.54021 16.1738 5.41392C15.9213 5.32972 8.55405 5.32972 8.30146 5.41392C8.00677 5.49811 7.79628 5.7928 7.79628 6.12959V7.85562C7.79628 8.78178 7.1227 8.95017 6.70172 8.99227H3.79694C3.67064 8.99227 2.74448 8.78178 2.70238 7.81352C2.70238 7.68722 2.70238 7.22414 2.70238 6.80316C2.70238 6.46637 2.70238 6.29798 2.70238 6.17169C2.61818 5.32972 2.91287 4.65615 3.37595 4.15097Z" />
                    </svg>
                  </div>
                  <div className="w-full">
                    <h4 className="text-black mb-1 text-xl font-bold">
                      Phone Number
                    </h4>
                    <p className="text-black bg-white ">(0928) 765 2222</p>
                  </div>
                </div>
                <div className="mb-8 flex w-full max-w-[370px]">
                  <div className="bg-nf_green text-nf_yellow mr-6 flex h-[60px] w-full max-w-[60px] items-center justify-center overflow-hidden rounded  sm:h-[70px] sm:max-w-[70px]">
                    <svg
                      width="28"
                      height="19"
                      viewBox="0 0 28 19"
                      className="fill-current"
                    >
                      <path d="M25.3636 0H2.63636C1.18182 0 0 1.16785 0 2.6052V16.3948C0 17.8322 1.18182 19 2.63636 19H25.3636C26.8182 19 28 17.8322 28 16.3948V2.6052C28 1.16785 26.8182 0 25.3636 0ZM25.3636 1.5721C25.5909 1.5721 25.7727 1.61702 25.9545 1.75177L14.6364 8.53428C14.2273 8.75886 13.7727 8.75886 13.3636 8.53428L2.04545 1.75177C2.22727 1.66194 2.40909 1.5721 2.63636 1.5721H25.3636ZM25.3636 17.383H2.63636C2.09091 17.383 1.59091 16.9338 1.59091 16.3499V3.32388L12.5 9.8818C12.9545 10.1513 13.4545 10.2861 13.9545 10.2861C14.4545 10.2861 14.9545 10.1513 15.4091 9.8818L26.3182 3.32388V16.3499C26.4091 16.9338 25.9091 17.383 25.3636 17.383Z" />
                    </svg>
                  </div>
                  <div className="w-full">
                    <h4 className="text-black mb-1 text-xl font-bold">
                      Independent Herbalife Nutrition Member
                    </h4>
                    <p className="text-black bg-white ">Melanie M. Laxamana</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
