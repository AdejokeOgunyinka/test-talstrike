/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable no-unused-vars */

import { useFormik } from "formik";
import { useState } from "react";
import NextImage from "next/image";
import * as yup from "yup";
import BeatLoader from "react-spinners/BeatLoader";
import { signIn } from "next-auth/react";

import GmailIcon from "@/assets/gmailIcon.svg";
import FacebookIcon from "@/assets/facebookIcon.svg";
import LinkedinIcon from "@/assets/linkedinIcon.svg";
import EmailIcon from "@/assets/emailIcon.svg";
import HiddenPasswordIcon from "@/assets/hiddenPasswordIcon.svg";
import { useCreateUser } from "@/api/auth";
import notify from "@/libs/toast";
import { useRouter } from "next/router";
import { User } from "@/libs/types/user";
import { setAuthUser } from "@/store/slices/authSlice";
import { useTypedDispatch } from "@/hooks/hooks";
import CustomInputBox from "@/components/AuthInputbox";
import SignupIndicators from "./SignupIndicators";

const Index = ({
  providers,
  goBack,
  continueSignup,
}: {
  providers: any;
  goBack?: () => void;
  continueSignup?: () => void;
}) => {
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

  const { mutate: createUser, isLoading } = useCreateUser();

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    },
    validationSchema: signupSchema,
    validateOnBlur: true,
    onSubmit: (values: User) => {
      createUser(values, {
        onSuccess: (response: any) => {
          dispatch(setAuthUser(response.data));
          continueSignup && continueSignup();
        },
        onError: (err) => {
          notify({ type: "error", text: (err as any)?.data?.message });
        },
      });
    },
  });

  const [hidePassword, setHidePassword] = useState(true);

  return (
    <div className="pt-[50px] h-full w-full flex flex-col lg:pt-[61px] xl:px-[140px] px-[20px]">
      <div className="w-full relative h-[unset] md:h-full">
        <SignupIndicators active={0} />
        <div className="text-[30px] leading-[145%] text-brand-600 font-semibold text-center mt-[28px]">
          Sign Up
        </div>
        <p className="mt-[26px] text-[16px] text-center">
          Great! You’ve taken the first step to creating your account.
        </p>

        <div className="mt-[36px] w-full">
          <div className="flex w-full justify-center items-center gap-[20px]">
            <NextImage
              src={GmailIcon}
              alt="gmail"
              onClick={() =>
                signIn("google", { callbackUrl: "/auth/signup/setup" })
              }
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
              onClick={() =>
                signIn("facebook", { callbackUrl: "/auth/signup/setup" })
              }
              className="cursor-pointer"
            />
          </div>
          <p className="text-center text-[18px] mt-[32px] mb-[24px]">
            Or sign up with
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} autoComplete="on">
          <div className="flex gap-x-[13px]">
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
          <div className="mt-[15px] mb-[25px]">
            <CustomInputBox
              label="Password"
              type={hidePassword ? "password" : "text"}
              placeholder="Password (minimum of 8 characters)"
              icon={
                <NextImage
                  src={HiddenPasswordIcon}
                  alt="password"
                  className="cursor-pointer mt-[18px]"
                  onClick={() => setHidePassword(!hidePassword)}
                />
              }
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              autocomplete="on"
            />
            {formik.errors.password && formik.touched.password && (
              <p className="text-brand-warning text-[10px]">
                {formik.errors.password}
              </p>
            )}
          </div>
          <div className="flex flex-col md:flex-row gap-[15px]">
            <button
              onClick={goBack}
              className="md:basis-1/2 border-[1.5px] border-[#293137] h-[44px] rounded-[4px] text-[#293137] text-[18px]"
            >
              Back
            </button>
            <button
              type="submit"
              className="h-[44px] bg-brand-600 rounded-[4px] md:basis-1/2 text-[18px] text-white border border-[rgba(217, 217, 217, 0.97)] mb-[12px]"
            >
              {isLoading ? (
                <BeatLoader
                  color={"white"}
                  size={10}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              ) : (
                "Continue"
              )}
            </button>
          </div>

          <div className="relative mt-[46px] pb-[15px] w-full">
            <p className="text-[18px] leading-[21px] text-center">
              Already have an account?{" "}
              <a
                href="/auth/login"
                className="text-brand-600 underline underline-offset-4"
              >
                Login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Index;
