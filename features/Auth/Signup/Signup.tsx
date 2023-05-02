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
import TalstrikeLogo from "@/assets/TalstrikeLogo.svg";
import EmailIcon from "@/assets/emailIcon.svg";
import HiddenPasswordIcon from "@/assets/hiddenPasswordIcon.svg";
import { createUser } from "@/api/auth";
import notify from "@/libs/toast";
import { useRouter } from "next/router";
import { User } from "@/libs/types/user";
import { setAuthUser } from "@/store/slices/authSlice";
import { useTypedDispatch } from "@/hooks/hooks";
import CustomInputBox from "@/components/Inputbox";

const Index = ({ providers }: { providers: any }) => {
  const router = useRouter();
  const dispatch = useTypedDispatch();

  const signupSchema = yup.object().shape({
    firstname: yup
      .string()
      .min(2, "Minimum of 2 characters")
      .max(15, "Maximum of 15 characters")
      .required("Please enter your first name"),
    lastname: yup
      .string()
      .min(2, "Minimum of 2 characters")
      .max(15, "Maximum of 15 characters")
      .required("Please enter your last name"),
    email: yup
      .string()
      .email("Invalid email address")
      .required("Please enter your email address"),
    password: yup
      .string()
      .required("Please enter your password")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])/,
        "password must contain one uppercase character (A-Z), one lowercase character (a-z)"
      )
      .matches(/\W|_/g, "password must contain one special case character")
      .matches(/^(?=.{8,})/, "password must contain at least 8 characters")
      .matches(/^(?=.{6,20}$)\D*\d/, "password must contain one number (0-9)"),
  });

  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    },
    validationSchema: signupSchema,
    validateOnBlur: true,
    onSubmit: async (values: User, { setErrors }) => {
      try {
        setLoading(true);
        const response = await createUser(values);
        if (response.data.user) {
          dispatch(setAuthUser(response.data));
          router.push("/confirm-email");
        } else {
          notify({ type: "error", text: response.data.message });
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

  return (
    <div className="max-w-md pt-[50px] w-full lg:pt-[102px] pl-[20px] lg:pl-[50px] pr-[20px] lg:pr-[unset]">
      <div className="w-full">
        <NextImage src={TalstrikeLogo} alt="talstrike" width="74" height="48" />
        <div className="mt-[47px] text-[32px] leading-[48px] text-brand-70 font-bold">
          Create an account
        </div>
        <p className="text-[11px] text-brand-50 font-light">
          Lorem Ipsum is simply dummy text of the printing{" "}
        </p>
        <div className="flex mt-[24px] mb-[29px] gap-x-[16px] w-full">
          <div
            onClick={() => signIn("google")}
            className="flex items-center basis-1/2 cursor-pointer rounded-[18px] border py-[9px] px-[19px] border-[rgba(217, 217, 217, 0.97)]"
          >
            <NextImage src={GmailIcon} alt="gmail" />
            <p className="ml-[7px] text-brand-50 text-[10px] font-light leading-[15px]">
              Sign up with Google
            </p>
          </div>
          <div className="flex items-center basis-1/2 cursor-pointer rounded-[18px] border py-[9px] px-[19px] border-[rgba(217, 217, 217, 0.97)]">
            <NextImage src={FacebookIcon} alt="gmail" />
            <p className="ml-[7px] text-brand-50 text-[10px] font-light leading-[15px]">
              Sign up with Facebook
            </p>
          </div>
        </div>
        <div className="relative w-full border-b-[rgba(217, 217, 217, 0.97)] border border-t-0 border-l-0 border-r-0">
          <p className="text-center absolute pl-[20px] pr-[20px] -top-[10px] bg-white left-[25%] text-[12px] leading-[18px] text-brand-50 font-normal">
            or Get started with Email
          </p>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="flex mt-[23px] gap-x-[13px]">
            <div className="basis-1/2">
              <CustomInputBox
                label="First name"
                placeholder="Enter your First name"
                name="firstname"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.firstname && formik.touched.firstname && (
                <p className="text-brand-warning text-[10px]">
                  {formik.errors.firstname}
                </p>
              )}
            </div>
            <div className="basis-1/2">
              <CustomInputBox
                label="Last name"
                placeholder="Enter your Last name"
                name="lastname"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.lastname && formik.touched.lastname && (
                <p className="text-brand-warning text-[10px]">
                  {formik.errors.lastname}
                </p>
              )}
            </div>
          </div>
          <div className="mt-[30px]">
            <CustomInputBox
              label="Email"
              placeholder="Enter your email"
              icon={<NextImage src={EmailIcon} alt="email" />}
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
          <div className="mt-[30px] mb-[25px]">
            <CustomInputBox
              label="Password"
              type={hidePassword ? "password" : "text"}
              placeholder="Password (minimum of 8 characters)"
              icon={
                <NextImage
                  src={HiddenPasswordIcon}
                  alt="password"
                  className="cursor-pointer"
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
          <button
            type="submit"
            className="h-[40px] bg-brand-600 rounded-[7px] w-full font-light text-[11px] text-white border border-[rgba(217, 217, 217, 0.97)] mb-[12px]"
          >
            {loading ? (
              <BeatLoader
                color={"white"}
                size={10}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            ) : (
              "Sign up"
            )}
          </button>
          <p className="text-[11px] text-center text-brand-50 text-light">
            Already have an account?{" "}
            <a href="/" className="underline decoration-solid text-brand-100">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Index;
