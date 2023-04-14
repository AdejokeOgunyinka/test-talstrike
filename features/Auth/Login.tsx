/* eslint-disable no-unused-vars */

import { useFormik } from "formik";
import { useState } from "react";
import NextImage from "next/image";
import * as yup from "yup";
import { useRouter } from "next/router";
import { getCsrfToken, signIn } from "next-auth/react";
import BeatLoader from "react-spinners/BeatLoader";

import TalstrikeLogo from "@/assets/TalstrikeLogo.svg";
import EmailIcon from "@/assets/emailIcon.svg";
import HiddenPasswordIcon from "@/assets/hiddenPasswordIcon.svg";
import GmailIcon from "@/assets/gmailIcon.svg";
import FacebookIcon from "@/assets/facebookIcon.svg";
import notify from "@/libs/toast";
import { LoginInfo } from "@/libs/types/user";
import CustomInputBox from "@/components/Inputbox";
import { CtxOrReq } from "next-auth/client/_utils";

type LoginProps = {
  providers?: any;
  csrfToken?: string;
};

const Index = ({ providers, csrfToken }: LoginProps) => {
  const router = useRouter();

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
    return signIn("google", { callbackUrl: "https://app.talstrike.com/" });
  };

  return (
    <div className="max-w-md pt-[50px] w-full lg:pt-[102px] pl-[20px] lg:pl-[50px] pr-[20px] lg:pr-[unset]">
      <div className="w-full">
        <div className="w-[74px] h-[48px]">
          <NextImage src={TalstrikeLogo} alt="talstrike" />
        </div>
        <div className="mt-[47px] text-[32px] leading-[48px] text-brand-70 font-bold">
          Hey, Hello 👋
        </div>
        <p className="text-[11px] text-brand-50 font-light">
          Lorem Ipsum is simply dummy text of the printing{" "}
        </p>
        <div className="flex mt-[24px] mb-[29px] gap-x-[16px] w-full">
          <div
            onClick={() => GoogleHandlerFunction()}
            className="flex items-center basis-1/2 cursor-pointer rounded-[18px] border py-[9px] px-[19px] border-[rgba(217, 217, 217, 0.97)]"
          >
            <NextImage src={GmailIcon} alt="gmail" />
            <p className="ml-[7px] text-brand-50 text-[10px] font-light leading-[15px]">
              Sign in with Google
            </p>
          </div>
          <div className="flex items-center basis-1/2 cursor-pointer rounded-[18px] border py-[9px] px-[19px] border-[rgba(217, 217, 217, 0.97)]">
            <NextImage src={FacebookIcon} alt="gmail" />
            <p className="ml-[7px] text-brand-50 text-[10px] font-light leading-[15px]">
              Sign in with Facebook
            </p>
          </div>
        </div>
        <div className="relative w-full border-b-[rgba(217, 217, 217, 0.97)] border border-t-0 border-l-0 border-r-0">
          <p className="text-center absolute pl-[20px] pr-[20px] -top-[10px] bg-white left-[25%] text-[12px] leading-[18px] text-brand-50 font-normal">
            or Login with Email
          </p>
        </div>
        <form onSubmit={formik.handleSubmit}>
          {/* <input name="csrfToken" type="hidden" defaultValue={csrfToken} /> */}
          <div className="mt-[27px]">
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
          <div className="mt-[27px] mb-[22px]">
            <CustomInputBox
              label="Password"
              type={hidePassword ? "password" : "text"}
              placeholder="Password (minimum of 6 characters)"
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
          <div className="flex justify-between w-full mb-[20px]">
            <CustomInputBox label="Keep me logged in" type="checkbox" />
            <a className="underline decoration-solid text-brand-100 text-[11px] font-light basis-1/2 text-right">
              Forgot my password?
            </a>
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
              "Login"
            )}
          </button>
          <p className="text-[11px] text-center text-brand-50 text-light">
            {`Don't have an account?`}{" "}
            <a
              href="/auth/signup"
              className="underline decoration-solid text-brand-100"
            >
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Index;

export async function getServerSideProps(context: CtxOrReq | undefined) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
