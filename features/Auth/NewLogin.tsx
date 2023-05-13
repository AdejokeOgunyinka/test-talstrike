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
import { createUser } from "@/api/auth";
import notify from "@/libs/toast";
import { useRouter } from "next/router";
import { LoginInfo, User } from "@/libs/types/user";
import { setAuthUser } from "@/store/slices/authSlice";
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

  const GoogleHandlerFunction = async () => {
    return signIn("google", { callbackUrl: "https://talstrike.netlify.app/" });
  };

  return (
    <div className="pt-[50px] h-full w-full flex flex-col lg:pt-[112px] xl:px-[140px] px-[20px]">
      <div className="w-full relative h-[unset] md:h-full">
        <div className="text-[24px] leading-[168.5%] text-brand-1650 font-semibold text-center mb-[31px]">
          Welcome Back
        </div>

        <p className=" mt-[65px] mb-[100px] text-[16px] text-brand-600 font-medium text-center">
          Get to your feeds, explore curated inspirational videos, livestream
          mentors and engage in self improvement challenges.
        </p>

        <form onSubmit={formik.handleSubmit}>
          <div className="mt-[15px]">
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
          <div className="mt-[15px] mb-[25px] flex flex-col md:flex-row gap-[15px]">
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
          <div className="flex flex-col md:flex-row gap-[15px] w-full">
            <a
              href="/"
              className="md:basis-1/2 flex justify-center items-center border-[1.5px] border-brand-1650 h-[37px] rounded-[4px] text-brand-1650 font-medium text-[14px]"
            >
              <button type="button">Back</button>
            </a>
            <button
              type="submit"
              className="md:basis-1/2 h-[37px] bg-brand-600 rounded-[4px] font-light font-medium text-[14px] text-white border border-[rgba(217, 217, 217, 0.97)] mb-[12px]"
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
          <div className="mt-[44px] w-full">
            <p className="text-center text-[#94AEC5] text-[14px] mb-[24px]">
              Or login with
            </p>
            <div className="flex w-full justify-center items-center gap-[20px] mb-[25px] md:mb-[unset]">
              <NextImage
                src={GmailIcon}
                alt="gmail"
                onClick={() => signIn("google")}
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
              />
            </div>
          </div>
          <div className="relative md:absolute md:bottom-[62px] w-full">
            <p className="text-[#94AEC5] text-[14px] font-medium leading-[21px] text-center">
              {"If you don’t have an account, "}
              <a href="/auth/signup" className="text-[#003D72] underline">
                Sign up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Index;
