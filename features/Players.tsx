import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Country } from "country-state-city";

import TitleBar from "@/components/TitleBar";
import PlayersSearchBar from "@/components/DashboardSearchbar";
import PlayerDropdown from "@/components/DashboardFilterDropdown";
import ProfileCard from "@/components/ProfileCard";
import { DashboardLayout } from "@/layout/Dashboard";
import { useGetAllPlayers } from "@/api/players";
import SkeletonLoader from "@/components/SkeletonLoader";

const Index = () => {
  const { data: session } = useSession();
  const TOKEN = session?.user?.access;

  const sportFilterOptions = [
    "no filter",
    "Football",
    "Basketball",
    "Volleyball",
    "Tennis",
    "Running",
    "Rugby",
    "Long jump",
    "Cricket",
  ];
  const [chosenSportFilters, setChosenSportFilters] = useState<string[]>([]);

  const positionsFilterOptions: string[] = [];
  const [chosenPositionFilters, setChosenPositionFilters] = useState<string[]>(
    []
  );

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

  const { data: playersData, isLoading: isLoadingAllPlayers } =
    useGetAllPlayers({
      token: TOKEN as string,
      age: chosenAgeFilters?.join(","),
      location: chosenCountryFilters?.join(","),
      gender: chosenGenderFilters?.join(","),
      sport: chosenSportFilters?.join(","),
    });

  return (
    <DashboardLayout>
      <div className="w-full md:rounded-tl-[15px] md:rounded-tr-[15px] min-h-[100vh] bg-brand-1000 py-[28px] px-[15px] lg:px-[31px]">
        <TitleBar
          titleBarColor="bg-[#D1E6F8]"
          text="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        />
        <div className="-mt-[27px]">
          <PlayersSearchBar>
            <div className="w-full h-full flex flex-col md:flex-row gap-y-[13px] md:gap-x-[13px]">
              <PlayerDropdown
                label="Sport"
                placeholder="Select sport"
                filterOptions={sportFilterOptions}
                onChange={(e) =>
                  e?.target?.value === "no filter"
                    ? setChosenSportFilters([""])
                    : setChosenSportFilters([e?.target?.value])
                }
              />
              <PlayerDropdown
                label="Position"
                placeholder="Select position"
                filterOptions={positionsFilterOptions}
                onChange={(e) =>
                  e?.target?.value === "no filter"
                    ? setChosenPositionFilters([""])
                    : setChosenPositionFilters([e?.target?.value])
                }
              />
              <PlayerDropdown
                label="Country"
                placeholder="Select country"
                filterOptions={countryFilterOptions}
                onChange={(e) =>
                  e?.target?.value === "no filter"
                    ? setChosenCountryFilters([""])
                    : setChosenCountryFilters([e?.target?.value])
                }
              />
              <PlayerDropdown
                label="Age"
                placeholder="Select age range"
                filterOptions={ageFilterOptions}
                onChange={(e) =>
                  e?.target?.value === "no filter"
                    ? setChosenAgeFilters([""])
                    : setChosenAgeFilters([e?.target?.value])
                }
              />
              <PlayerDropdown
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
          </PlayersSearchBar>
        </div>
        <div className="w-full mt-[23px] flex justify-center pb-[100px] lg:pb-0">
          <div className="flex flex-wrap gap-y-[25px] gap-x-[25px]">
            {isLoadingAllPlayers ? (
              <SkeletonLoader />
            ) : (
              playersData?.results?.map((player: any, index: number) => (
                <div key={index}>
                  <ProfileCard
                    id={player?.user?.id}
                    img={player?.user?.image}
                    skillsArray={player?.specialties || ["N/A"]}
                    name={`${player?.user?.firstname} ${player?.user?.lastname}`}
                    position={player?.position}
                    isPlayer={true}
                    rating={player?.rating || "4.3"}
                    location={player?.location?.join(", ") || "N/A"}
                    experience={player?.years_of_experience}
                    appearances={player?.appearances || 0}
                    friend={player?.is_following}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
