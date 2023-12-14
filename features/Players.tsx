import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Country } from "country-state-city";
import { useInView } from "react-intersection-observer";

import TitleBar from "@/components/TitleBar";
import PlayersSearchBar from "@/components/DashboardSearchbar";
import PlayerDropdown from "@/components/DashboardFilterDropdown";
import ProfileCard from "@/components/ProfileCard";
import { DashboardLayout } from "@/layout/Dashboard";
import { useGetSports } from "@/api/auth";
import { useGetAllPlayers } from "@/api/players";
import LoadingProfileCards from "@/components/LoadingStates/loadingProfileCards";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const Index = () => {
  const { data: session } = useSession();
  const TOKEN = session?.user?.access;

  const { ref, inView } = useInView();
  const { data: sports } = useGetSports();

  const [chosenSportFilters, setChosenSportFilters] = useState<string[]>([]);

  const [positionFilterOptions, setPositionFilterOptions] = useState<string[]>(
    []
  );
  const [chosenPositionFilter, setChosenPositionFilter] = useState<string[]>(
    []
  );

  useEffect(() => {
    if (chosenSportFilters?.length === 0) {
      setPositionFilterOptions(sports?.results[0]?.positions);
    } else if (
      chosenSportFilters &&
      chosenSportFilters[0] !== "no filter" &&
      chosenSportFilters[0] !== ""
    ) {
      setPositionFilterOptions(
        sports?.results?.filter(
          (sport: any) => sport?.id === chosenSportFilters[0]
        )[0]?.positions
      );
    }
  }, [sports, chosenSportFilters]);

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
    data: playersData,
    isLoading: isLoadingAllPlayers,
    hasNextPage,
    fetchNextPage,
  } = useGetAllPlayers({
    token: TOKEN as string,
    age: chosenAgeFilters?.join(","),
    location: chosenCountryFilters?.join(","),
    gender: chosenGenderFilters?.join(","),
    sport: chosenSportFilters?.join(","),
    position: chosenPositionFilter?.join(","),
    search: searchValue,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  return (
    <DashboardLayout>
      <div className="w-full md:rounded-tl-[15px] md:rounded-tr-[15px] min-h-[100vh] bg-brand-1000 pt-[80px] lg:py-[25px] px-[15px] lg:px-[31px]">
        <TitleBar
          titleBarColor="bg-[#D1E6F8]"
          text="Interact, engage, and connect with athletes from diverse disciplines."
          header="Players"
        />
        <div className="-mt-[27px]">
          <PlayersSearchBar onChangeSearchInput={setSearchValue}>
            <div className="w-full h-full flex flex-col md:flex-row gap-y-[13px] md:gap-x-[13px]">
              <PlayerDropdown
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
              <PlayerDropdown
                label="Position"
                placeholder="Select position"
                filterOptions={["no filter"]?.concat(positionFilterOptions)}
                onChange={(e) =>
                  e?.target?.value === "no filter"
                    ? setChosenPositionFilter([""])
                    : setChosenPositionFilter([e?.target?.value])
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
        <div className="w-full mt-[23px] flex justify-center h-full">
          <div className="w-full h-full flex flex-wrap gap-y-[25px] gap-x-[25px]">
            {isLoadingAllPlayers ? (
              Array(3)
                ?.fill("")
                ?.map((_, index) => <LoadingProfileCards key={index} />)
            ) : playersData?.pages?.flat(1)?.length === 0 ? (
              <div className="w-full h-[60vh] flex justify-center items-center">
                <p className="text-[#343D45] font-medium text-[18px]">
                  No player found! Try and search for something else
                </p>
              </div>
            ) : (
              <ResponsiveMasonry
                columnsCountBreakPoints={{ 350: 1, 750: 2, 1250: 3 }}
                className="w-full gap-[16px]"
              >
                <Masonry
                  columnsCount={3}
                  style={{ gap: "9px" }}
                  className="profile-masonry"
                >
                  {playersData?.pages
                    ?.flat(1)
                    ?.map((player: any, index: number) => (
                      <div className="w-full" key={index}>
                        <ProfileCard
                          id={player?.user?.id}
                          img={player?.user?.image}
                          skillsArray={player?.interests || []}
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
                    ))}
                </Masonry>
              </ResponsiveMasonry>
            )}
          </div>
        </div>

        {!isLoadingAllPlayers && hasNextPage && (
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
