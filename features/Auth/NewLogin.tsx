/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable no-unused-vars */

import { useFormik } from "formik";
import { useState } from "react";
import NextImage from "next/image";
import * as yup from "yup";
import BeatLoader from "react-spinners/BeatLoader";
import { signIn } from "next-auth/react";
// import {getProviders} from "next-auth/react"

import GmailIcon from "@/assets/gmailIcon.svg";
import FacebookIcon from "@/assets/facebookIcon.svg";
import LinkedinIcon from "@/assets/linkedinIcon.svg";
import EmailIcon from "@/assets/emailIcon.svg";
import HiddenPasswordIcon from "@/assets/hiddenPasswordIcon.svg";
// import { createUser } from "@/api/auth";
import notify from "@/libs/toast";
import { useRouter } from "next/router";
import { LoginInfo } from "@/libs/types/user";
// import { setAuthUser } from "@/store/slices/authSlice";
import { useTypedDispatch } from "@/hooks/hooks";
import CustomInputBox from "@/components/AuthInputbox";

const Index = ({ providers }: { providers: any }) => {
  const router = useRouter();
  const dispatch = useTypedDispatch();

  const loginSchema = yup.object().shape({
    email: yup
      .string()
      .email("Invalid email address")
      .required("Please enter your email address"),
    password: yup.string().required("Please enter your password"),
  });

  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validateOnBlur: true,
    validationSchema: loginSchema,
    onSubmit: async (values: LoginInfo) => {
      try {
        setLoading(true);

        const response = await signIn("credentials", {
          redirect: false,
          email: values.email,
          password: values.password,
          callbackUrl: "/dashboard",
        });

        if (response?.ok) {
          router.push("/dashboard");
        } else {
          notify({ type: "error", text: response?.error as string });
        }
      } catch (error) {
        const { data } = (error as any).response;
        notify({ type: "error", text: data.message || data?.body });
      } finally {
        setLoading(false);
      }
    },
  });

  const [hidePassword, setHidePassword] = useState(true);

  const signInHandlerFunction = async (social: string) => {
    return signIn(social, { callbackUrl: "/dashboard" });
  };

  return (
    <div className="pt-[50px] h-full w-full flex flex-col lg:pt-[69px] lg:px-[70px] xl:px-[140px] px-[20px]">
      <div className="w-full relative h-[unset] md:h-full">
        <div className="text-[30px] leading-[145%] text-brand-600 font-semibold text-center mb-[19px]">
          Welcome Back: Your Dreams Are Valid and Achievable.
        </div>

        <p className="text-[18px] text-center leading-[169%]">
          Immerse Yourself in Customized Feeds, Uncover Inspiring Videos,
          Participate in Live Mentorship Sessions, and Embrace Self-Improvement
          Challenges to Elevate Your Athletic Journey.
        </p>

        <div className="mt-[53px] w-full">
          <div className="flex w-full justify-center items-center gap-[20px] mb-[13px]">
            <NextImage
              src={GmailIcon}
              alt="gmail"
              onClick={() => signInHandlerFunction("google")}
              className="cursor-pointer"
            />
            <NextImage
              src={LinkedinIcon}
              alt="linkedin"
              className="cursor-pointer"
            />
            <NextImage
              src={FacebookIcon}
              alt="facebook"
              className="cursor-pointer"
              onClick={() => signInHandlerFunction("facebook")}
            />
          </div>

          <p className="text-center text-[18px] mb-[31px]">Or login with</p>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="mt-[15px]">
            <CustomInputBox
              label="Email"
              placeholder="Enter your email"
              icon={
                <NextImage src={EmailIcon} alt="email" className="mt-[17px]" />
              }
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.email && formik.touched.email && (
              <p className="text-brand-warning text-[10px]">
                {formik.errors.email}
              </p>
            )}
          </div>
          <div className="mt-[15px] mb-[25px]">
            <CustomInputBox
              label="Password"
              type={hidePassword ? "password" : "text"}
              placeholder="Password (minimum of 8 characters)"
              icon={
                <NextImage
                  src={HiddenPasswordIcon}
                  alt="password"
                  className="cursor-pointer mt-[17px]"
                  onClick={() => setHidePassword(!hidePassword)}
                />
              }
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.password && formik.touched.password && (
              <p className="text-brand-warning text-[10px]">
                {formik.errors.password}
              </p>
            )}
          </div>
          <div className="flex flex-col justify-center md:flex-row gap-[15px] w-full">
            <a
              href="/"
              className="w-[130px] flex justify-center items-center border-[1.5px] border-[#293137] h-[45px] rounded-[4px] text-[#293137] text-[18px]"
            >
              <button type="button">Back</button>
            </a>
            <button
              type="submit"
              className="w-[130px] h-[45px] bg-brand-600 rounded-[4px] text-[18px] text-white border border-[rgba(217, 217, 217, 0.97)] mb-[12px]"
            >
              {loading ? (
                <BeatLoader
                  color={"white"}
                  size={10}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              ) : (
                "Login"
              )}
            </button>
          </div>

          <div className="pb-[62px] mt-[51px] w-full">
            <p className="text-[#293137] text-[18px] leading-[21px] text-center">
              {"If you don’t have an account, "}
              <a
                href="/auth/signup"
                className="text-brand-600 underline underline-offset-4 font-normal"
              >
                Sign up
              </a>
            </p>

            <p className="text-[#293137] text-[18px] mt-[17px] leading-[21px] text-center">
              {"Forgotten password? "}
              <a
                href="/auth/reset_password"
                className="text-brand-600 underline underline-offset-4 font-normal"
              >
                Reset here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Index;
