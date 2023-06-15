/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable no-unused-vars */

import { useFormik } from "formik";
import { useEffect, useState } from "react";
import NextImage from "next/image";
import * as yup from "yup";
import BeatLoader from "react-spinners/BeatLoader";
import { useRouter } from "next/router";
// import { signIn } from "next-auth/react";

import GmailIcon from "@/assets/gmailIcon.svg";
import FacebookIcon from "@/assets/facebookIcon.svg";
import LinkedinIcon from "@/assets/linkedinIcon.svg";
import EmailIcon from "@/assets/emailIcon.svg";
import HiddenPasswordIcon from "@/assets/hiddenPasswordIcon.svg";
import notify from "@/libs/toast";
import CustomInputBox from "@/components/AuthInputbox";
import { useResetPassword, useSendResetPasswordToken } from "@/api/auth";

const Index = ({ providers }: { providers: any }) => {
  const resetPasswordSchema = yup.object().shape({
    email: yup
      .string()
      .email("Invalid email address")
      .required("Please enter your email address"),
  });

  const resetSchema = yup.object().shape({
    token: yup
      .string()
      .required("Please enter the code that was sent to your email address"),
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
    c_password: yup
      .string()
      .oneOf(
        [yup.ref("password")],
        "Password and Confirm password do not match"
      ),
  });

  const {
    mutate: sendResetPasswordToken,
    isLoading: isSendingResetPasswordToken,
  } = useSendResetPasswordToken();

  const { mutate: resetPassword, isLoading: isResettingPassword } =
    useResetPassword();

  const [page, setPage] = useState(1);
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validateOnBlur: true,
    validationSchema: resetPasswordSchema,
    onSubmit: (values: any) => {
      sendResetPasswordToken(values.email, {
        onError: (err: any) => notify({ type: "error", text: err?.message }),
        onSuccess: () => {
          notify({
            type: "success",
            text: `Reset password has been successfully sent to ${values.email}!`,
          });
          setPage(2);
        },
      });
    },
  });

  const router = useRouter();

  const resetFormik = useFormik({
    initialValues: {
      token: "",
      password: "",
      c_password: "",
    },
    validateOnBlur: true,
    validationSchema: resetSchema,
    onSubmit: (values: any) => {
      resetPassword(
        { token: values.token, new_password: values.password },
        {
          onError: (err: any) => notify({ type: "error", text: err?.message }),
          onSuccess: () => {
            notify({
              type: "success",
              text: "You have successfully reset your password! Please login to continue.",
            });
            router.push("/auth/login");
          },
        }
      );
    },
  });

  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (seconds > 0 && page === 2) {
      setTimeout(() => setSeconds(seconds - 1), 1000);
    } else if (seconds === 0 && page === 2) {
      setPage(2);
      setSeconds(60);
    } else {
      setSeconds(60);
    }
  }, [page, seconds]);

  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);

  return (
    <div className="h-full w-full flex flex-col xl:px-[140px] px-[20px]">
      {page === 1 && (
        <div className="w-full relative h-[unset] md:h-full  pt-[50px] lg:pt-[112px]">
          <div className="text-[24px] leading-[168.5%] text-brand-1650 font-semibold text-center mb-[31px]">
            Reset your Password
          </div>

          <p className="mt-[65px] mb-[37px] text-[16px] text-[#0074D9] font-medium text-center">
            To reset your password, please provide your account email address
          </p>

          <form onSubmit={formik.handleSubmit}>
            <div>
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
                  {formik.errors.email as string}
                </p>
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-[15px] w-full mt-[30px]">
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
                {isSendingResetPasswordToken ? (
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
            <div className="mt-[140px] w-full">
              <p className="text-center text-[#94AEC5] text-[14px] mb-[24px]">
                Or login with
              </p>
              <div className="flex w-full justify-center items-center gap-[20px] mb-[25px] md:mb-[unset]">
                <NextImage
                  src={GmailIcon}
                  alt="gmail"
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
            <div className="relative md:absolute md:bottom-[86px] w-full">
              <p className="text-[#94AEC5] text-[14px] font-medium leading-[21px] text-center">
                {"If you don’t have an account, "}
                <a href="/auth/signup" className="text-[#003D72] underline">
                  Sign up
                </a>
              </p>
            </div>
          </form>
        </div>
      )}
      {page === 2 && (
        <div className="w-full relative h-[unset] md:h-full  pt-[60px] lg:pt-[191px] xl:px-[20px]">
          <div className="text-[24px] leading-[168.5%] text-brand-1650 font-semibold text-center mb-[31px]">
            Password Reset Code sent to your Email
          </div>

          <p className="mt-[30px] lg:mt-[64px] text-[#0074D9] text-[14px] font-medium leading-[21px] text-center">
            Please check your email inbox for a{"  "}
            <b className="text-[#003D72] font-medium">code</b>
            {"  "}sent to{"  "}
            <b className="text-[#003D72] font-medium">
              {formik.values.email}.
            </b>{" "}
            Click continue to enter the code and reset your password.
          </p>

          <div className="flex flex-col md:flex-row gap-[15px] lg:px-[20%] w-full mt-[64px]">
            <div
              onClick={() => setPage(1)}
              className="md:basis-1/2 flex justify-center items-center border-[1.5px] border-brand-1650 h-[37px] rounded-[4px] text-brand-1650 font-medium text-[14px]"
            >
              <button type="button">Back</button>
            </div>
            <button
              onClick={() => setPage(3)}
              className="md:basis-1/2 h-[37px] bg-brand-600 rounded-[4px] font-light font-medium text-[14px] text-white border border-[rgba(217, 217, 217, 0.97)] mb-[12px]"
            >
              Continue
            </button>
          </div>

          <div className="relative md:absolute md:bottom-[62px] mt-[130px] pb-[50px] md:mt-[unset] w-full">
            <p className="text-[#0074D9] text-[14px] font-medium leading-[21px] text-center">
              Didn’t receive the verification link email?{" "}
              <b
                onClick={() =>
                  sendResetPasswordToken(formik.values.email, {
                    onError: (err: any) =>
                      notify({ type: "error", text: err?.message }),
                    onSuccess: () => {
                      notify({
                        type: "success",
                        text: `Reset password has been successfully sent to ${formik.values.email}!`,
                      });
                    },
                  })
                }
                className="text-[#003D72] underline cursor-pointer"
              >
                Resend
              </b>{" "}
              in {seconds}
            </p>
          </div>
        </div>
      )}
      {page === 3 && (
        <div className="w-full relative h-[unset] md:h-full flex flex-col justify-center pt-[0px] xl:px-[20px]">
          <div className="text-[24px] leading-[168.5%] text-brand-1650 font-semibold text-center mb-[31px]">
            Reset your password
          </div>
          <form onSubmit={resetFormik?.handleSubmit}>
            <div>
              <CustomInputBox
                placeholder="Enter code sent to your email"
                name="token"
                onChange={resetFormik.handleChange}
                onBlur={resetFormik.handleBlur}
              />
              {resetFormik.errors.token && resetFormik.touched.token && (
                <p className="text-brand-warning text-[10px]">
                  {resetFormik.errors.token as string}
                </p>
              )}
            </div>

            <div className="mt-[15px] mb-[15px]">
              <CustomInputBox
                type={hidePassword ? "password" : "text"}
                placeholder="Password"
                icon={
                  <NextImage
                    src={HiddenPasswordIcon}
                    alt="password"
                    className="cursor-pointer"
                    onClick={() => setHidePassword(!hidePassword)}
                  />
                }
                name="password"
                onChange={resetFormik.handleChange}
                onBlur={resetFormik.handleBlur}
              />
              {resetFormik.errors.password && resetFormik.touched.password && (
                <p className="text-brand-warning text-[10px]">
                  {resetFormik.errors.password as string}
                </p>
              )}
            </div>
            <div className="mb-[25px]">
              <CustomInputBox
                type={hideConfirmPassword ? "password" : "text"}
                placeholder="Confirm Password"
                icon={
                  <NextImage
                    src={HiddenPasswordIcon}
                    alt="c_password"
                    className="cursor-pointer"
                    onClick={() => setHideConfirmPassword(!hidePassword)}
                  />
                }
                name="password"
                onChange={resetFormik.handleChange}
                onBlur={resetFormik.handleBlur}
              />
              {resetFormik.errors.c_password &&
                resetFormik.touched.c_password && (
                  <p className="text-brand-warning text-[10px]">
                    {resetFormik.errors.c_password as string}
                  </p>
                )}
            </div>
            <button
              type="submit"
              className="w-full h-[37px] bg-brand-600 rounded-[4px] md:basis-1/2 font-light font-medium text-[14px] text-white border border-[rgba(217, 217, 217, 0.97)] mb-[12px]"
            >
              {isResettingPassword ? (
                <BeatLoader
                  color={"white"}
                  size={10}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              ) : (
                "Save password"
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Index;
