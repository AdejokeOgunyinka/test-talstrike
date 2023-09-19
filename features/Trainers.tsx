import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Country } from "country-state-city";
import { useInView } from "react-intersection-observer";

import TitleBar from "@/components/TitleBar";
import TrainersSearchBar from "@/components/DashboardSearchbar";
import TrainersDropdown from "@/components/DashboardFilterDropdown";
import ProfileCard from "@/components/ProfileCard";
import { DashboardLayout } from "@/layout/Dashboard";
import { useGetAllTrainers } from "@/api/trainers";
import { useGetSports } from "@/api/auth";
import LoadingProfileCards from "@/components/LoadingStates/loadingProfileCards";

const Index = () => {
  const { data: session } = useSession();
  const TOKEN = session?.user?.access;

  const { ref, inView } = useInView();
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

  const [searchValue, setSearchValue] = useState("");

  const {
    data: trainersData,
    isLoading: isLoadingAllTrainers,
    hasNextPage,
    fetchNextPage,
  } = useGetAllTrainers({
    token: TOKEN as string,
    age: chosenAgeFilters?.join(","),
    location: chosenCountryFilters?.join(","),
    gender: chosenGenderFilters?.join(","),
    sport: chosenSportFilters?.join(","),
    search: searchValue,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  return (
    <DashboardLayout>
      <div className="w-full md:rounded-tl-[15px] md:rounded-tr-[15px] min-h-[100vh] bg-brand-1000 py-[28px] px-[15px] lg:px-[31px]">
        <TitleBar
          titleBarColor="bg-brand-pink-rgba"
          text="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
          header="Trainers"
        />
        <div className="-mt-[27px]">
          <TrainersSearchBar onChangeSearchInput={setSearchValue}>
            <div className="w-full h-full flex flex-col md:flex-row gap-y-[13px] md:gap-x-[13px]">
              <TrainersDropdown
                label="Sport"
                placeholder="Select sport"
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
              <TrainersDropdown
                label="Country"
                placeholder="Select country"
                filterOptions={countryFilterOptions}
                onChange={(e) =>
                  e?.target?.value === "no filter"
                    ? setChosenCountryFilters([""])
                    : setChosenCountryFilters([e?.target?.value])
                }
              />
              <TrainersDropdown
                label="Age"
                placeholder="Select age range"
                filterOptions={ageFilterOptions}
                onChange={(e) =>
                  e?.target?.value === "no filter"
                    ? setChosenAgeFilters([""])
                    : setChosenAgeFilters([e?.target?.value])
                }
              />
              <TrainersDropdown
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
          </TrainersSearchBar>
        </div>
        <div className="mt-[23px] gap-x-[25px] flex flex-wrap justify-center md:justify-start px-[5%] md:px-[2.5%] 2xl:px-[5%] gap-y-[25px]">
          {isLoadingAllTrainers ? (
            Array(6)
              ?.fill("")
              ?.map((_, index) => <LoadingProfileCards key={index} />)
          ) : trainersData?.pages?.flat(1)?.length === 0 ? (
            <div className="w-full h-[60vh] flex justify-center items-center">
              <p className="text-[#343D45] font-medium text-[18px]">
                No trainer found! Try and search for something else
              </p>
            </div>
          ) : (
            trainersData?.pages?.flat(1)?.map((trainer: any, index: number) => (
              <div key={index} className="w-full md:w-[unset]">
                <ProfileCard
                  id={trainer?.user?.id}
                  img={trainer.user?.image}
                  skillsArray={trainer.interests || []}
                  name={`${trainer.user?.firstname} ${trainer.user?.lastname}`}
                  isPlayer={trainer.isPlayer}
                  rating={trainer.rating || "2.3"}
                  location={trainer.location?.join(", ") || "N/A"}
                  experience={trainer.years_of_experience}
                  appearances={trainer.appearances || 0}
                  friend={trainer?.is_following}
                />
              </div>
            ))
          )}
        </div>

        {!isLoadingAllTrainers && hasNextPage && (
          <div
            ref={ref}
            className="flex w-full justify-center items-center mt-[30px]"
          >
            <button className="flex justify-center items-center w-[188px] h-[47px] bg-brand-600 text-brand-500">
              Loading More...
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Index;
