import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Country } from "country-state-city";
import { useInView } from "react-intersection-observer";

import TitleBar from "@/components/TitleBar";
import AgentsSearchBar from "@/components/DashboardSearchbar";
import AgentsDropdown from "@/components/DashboardFilterDropdown";
import ProfileCard from "@/components/ProfileCard";
import { DashboardLayout } from "@/layout/Dashboard";
import { useGetAllAgents } from "@/api/agents";
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
    data: agentsData,
    isLoading: isLoadingAllAgents,
    hasNextPage,
    fetchNextPage,
  } = useGetAllAgents({
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
          titleBarColor="bg-brand-blue2-rgba"
          text="Connect with Experienced Agents Dedicated to Crafting Opportunities, Negotiating, and Guiding You Towards Achieving Greatness."
          header="Agents"
        />
        <div className="-mt-[27px]">
          <AgentsSearchBar onChangeSearchInput={setSearchValue}>
            <div className="w-full h-full flex flex-col md:flex-row gap-y-[13px] md:gap-x-[13px]">
              <AgentsDropdown
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
              <AgentsDropdown
                label="Country"
                placeholder="Select country"
                filterOptions={countryFilterOptions}
                onChange={(e) =>
                  e?.target?.value === "no filter"
                    ? setChosenCountryFilters([""])
                    : setChosenCountryFilters([e?.target?.value])
                }
              />
              <AgentsDropdown
                label="Age"
                placeholder="Select age range"
                filterOptions={ageFilterOptions}
                onChange={(e) =>
                  e?.target?.value === "no filter"
                    ? setChosenAgeFilters([""])
                    : setChosenAgeFilters([e?.target?.value])
                }
              />
              <AgentsDropdown
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
          </AgentsSearchBar>
        </div>
        <div className="mt-[23px] gap-x-[25px] flex flex-wrap justify-center md:justify-start gap-y-[25px] px-[5%] md:px-[2.5%] 2xl:px-[5%]">
          {isLoadingAllAgents ? (
            Array(6)
              ?.fill("")
              ?.map((_, index) => <LoadingProfileCards key={index} />)
          ) : agentsData?.pages?.flat(1)?.length === 0 ? (
            <div className="w-full h-[60vh] flex justify-center items-center">
              <p className="text-[#343D45] font-medium text-[18px]">
                No agent found! Try and search for something else
              </p>
            </div>
          ) : (
            agentsData?.pages?.flat(1)?.map((agent: any, index: number) => (
              <div key={index} className="w-full md:w-[unset]">
                <ProfileCard
                  id={agent?.user?.id}
                  img={agent.user?.image}
                  skillsArray={agent.interests || []}
                  name={`${agent.user?.firstname} ${agent.user?.lastname}`}
                  isPlayer={agent.isPlayer}
                  rating={agent.rating || "1.6"}
                  location={agent.location?.join(", ") || "N/A"}
                  experience={agent.years_of_experience}
                  appearances={agent.appearances || 0}
                  friend={agent?.is_following}
                />
              </div>
            ))
          )}
        </div>

        {!isLoadingAllAgents && hasNextPage && (
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
