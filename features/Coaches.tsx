import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Country } from "country-state-city";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/solid";

import TitleBar from "@/components/TitleBar";
import CoachesSearchBar from "@/components/DashboardSearchbar";
import CoachesDropdown from "@/components/DashboardFilterDropdown";
import ProfileCard from "@/components/ProfileCard";
import { DashboardLayout } from "@/layout/Dashboard";
import { useGetAllCoaches } from "@/api/coaches";
import { useGetSports } from "@/api/auth";
import SkeletonLoader from "@/components/SkeletonLoader";

const Index = () => {
  const { data: session } = useSession();
  const TOKEN = session?.user?.access;

  const { data: sports } = useGetSports();

  const [chosenSportFilters, setChosenSportFilters] = useState<string[]>([]);

  const countries = Country.getAllCountries()?.map((country) => {
    return country?.name;
  });

  const [countryFilterOptions, setCountryFilterOptions] = useState<string[]>(
    []
  );
  const [chosenCountryFilters, setChosenCountryFilters] = useState<string[]>(
    []
  );

  useEffect(() => {
    if (countries) {
      setCountryFilterOptions(["no filter", ...countries]);
    }
  }, []);

  const ageFilterOptions = [
    "no filter",
    "15-25",
    "25-35",
    "35-45",
    "45-55",
    "55-65",
    "65-75",
    "75-85",
  ];
  const [chosenAgeFilters, setChosenAgeFilters] = useState<string[]>([]);

  const genderFilterOptions = ["no filter", "Male", "Female", "Other"];
  const [chosenGenderFilters, setChosenGenderFilters] = useState<string[]>([]);

  const [page, setPage] = useState(1);

  const { data: coachesData, isLoading: isLoadingAllCoaches } =
    useGetAllCoaches({
      token: TOKEN as string,
      age: chosenAgeFilters?.join(","),
      location: chosenCountryFilters?.join(","),
      gender: chosenGenderFilters?.join(","),
      sport: chosenSportFilters?.join(","),
      page: page,
    });

  return (
    <DashboardLayout>
      <div className="w-full md:rounded-tl-[15px] md:rounded-tr-[15px] min-h-[100vh] bg-brand-1000 py-[28px] px-[15px] lg:px-[31px]">
        <TitleBar
          titleBarColor="bg-brand-blue-rgba"
          text="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        />
        <div className="-mt-[27px]">
          <CoachesSearchBar>
            <div className="w-full h-full flex flex-col md:flex-row gap-y-[13px] md:gap-x-[13px]">
              <CoachesDropdown
                label="Sport"
                placeholder="Select sport(s)"
                filterOptions={["no filter"]?.concat(
                  sports?.results?.map((sport: any) => sport.name)
                )}
                onChange={(e) =>
                  e?.target?.value === "no filter"
                    ? setChosenSportFilters([""])
                    : setChosenSportFilters([
                        sports?.results?.filter(
                          (sport: any) => sport?.name === e?.target?.value
                        )[0]?.id,
                      ])
                }
              />
              <CoachesDropdown
                label="Country"
                placeholder="Select country"
                filterOptions={countryFilterOptions}
                onChange={(e) =>
                  e?.target?.value === "no filter"
                    ? setChosenCountryFilters([""])
                    : setChosenCountryFilters([e?.target?.value])
                }
              />
              <CoachesDropdown
                label="Age"
                placeholder="Select age range"
                filterOptions={ageFilterOptions}
                onChange={(e) =>
                  e?.target?.value === "no filter"
                    ? setChosenAgeFilters([""])
                    : setChosenAgeFilters([e?.target?.value])
                }
              />
              <CoachesDropdown
                label="Gender"
                placeholder="Select gender"
                filterOptions={genderFilterOptions}
                onChange={(e) =>
                  e?.target?.value === "no filter"
                    ? setChosenGenderFilters([""])
                    : setChosenGenderFilters([e?.target?.value])
                }
              />
            </div>
          </CoachesSearchBar>
        </div>
        <div className="mt-[23px] gap-x-[25px] flex flex-wrap justify-center md:justify-start gap-y-[25px] px-[5%] md:px-[2.5%] lg:px-[5%]">
          {isLoadingAllCoaches ? (
            <SkeletonLoader />
          ) : (
            coachesData?.results?.map((coach: any, index: number) => (
              <div key={index} className="w-full md:w-[unset]">
                <ProfileCard
                  id={coach?.user?.id}
                  img={coach?.user?.image}
                  skillsArray={coach?.specialties || ["N/A"]}
                  name={`${coach?.user?.firstname} ${coach?.user?.lastname}`}
                  isPlayer={false}
                  rating={coach?.rating || "3.5"}
                  location={coach?.location?.join(", ") || "N/A"}
                  experience={coach?.years_of_experience}
                  appearances={coach?.appearances || 0}
                  friend={coach?.is_following}
                />
              </div>
            ))
          )}
        </div>

        {!isLoadingAllCoaches && (
          <div className="flex justify-between items-center w-full mt-[20px] pb-[100px] lg:pb-0">
            <div>
              {coachesData?.current_page > 1 && (
                <ArrowLeftCircleIcon
                  color="#0074D9"
                  height="30px"
                  onClick={() => {
                    if (page === 1) {
                      setPage(1);
                    } else {
                      setPage(page - 1);
                    }
                  }}
                  className="cursor-pointer"
                />
              )}
            </div>
            <div className="flex gap-[20px] items-center">
              <div className="border border-brand-600 w-[55px] rounded-[5px] flex justify-end pr-[10px]">
                {page}
              </div>
              {coachesData?.current_page < coachesData?.total_pages && (
                <ArrowRightCircleIcon
                  color="#0074D9"
                  height="30px"
                  aria-disabled={coachesData?.links?.next === null}
                  onClick={() => {
                    if (coachesData?.links?.next === null) {
                      setPage(page);
                    } else setPage(page + 1);
                  }}
                  className="cursor-pointer"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Index;
