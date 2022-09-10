// import { isValidArray } from "../../../../../../common/utils";
import citiesGeodata from "../../assets/world_cities.json";

export const cleanData = (tweetData) => {
  //   if (!isValidArray(tweetData, true)) {
  //     return [[], []];
  //   }

  // Get lists of the country codes, cities and countries.
  const iso2List = citiesGeodata.map((item) => {
    return item?.iso2.toUpperCase();
  });
  const iso3List = citiesGeodata.map((item) => {
    return item?.iso3.toUpperCase();
  });
  const cityList = citiesGeodata.map((item) => {
    return item?.city.toUpperCase();
  });
  const countryList = citiesGeodata.map((item) => {
    return item?.country.toUpperCase();
  });

  // Filter tweets based on valid locations (cities)
  var filteredData = tweetData.filter((data) => {
    return (
      data.location !== "" && // Check if any word in the tweet location string is a valid country using four checks against '2 character country acronyms', '3 character country acronyms', 'country name', & 'city name' and introduce a new parameter 'locationCode' into the tweets object to contain the country
      data.location
        .split(", ")
        .map((el) => {
          return {
            iso2List: iso2List.includes(el?.toUpperCase()),
            iso3List: iso3List.includes(el?.toUpperCase()),
            cityList: cityList.includes(el?.toUpperCase()),
            countryList: countryList.includes(el?.toUpperCase()),
          };
        })
        .map(({ iso2List, iso3List, cityList, countryList }, id) => {
          if (iso2List) {
            data.locationCode = citiesGeodata.find(
              (co) => co.iso2 === data.location.split(", ")[id]
            )?.city;
          } else if (iso3List) {
            data.locationCode = citiesGeodata.find(
              (co) => co.iso3 === data.location.split(", ")[id]
            )?.city;
          } else if (cityList) {
            data.locationCode = citiesGeodata.find(
              (co) => co.city === data.location.split(", ")[id]
            )?.city;
          } else if (countryList) {
            data.locationCode = citiesGeodata.find(
              (co) => co.country === data.location.split(", ")[id]
            )?.city;
          }
          return iso2List || iso3List || cityList || countryList ? 1 : 0;
        })
        .reduce((a, b) => {
          return a + b;
        })
    );
  });

  const filteredDataLocations = filteredData.map((item) => {
    return item.locationCode;
  });

  // Reshape tweets data
  let locationCountList = [];

  // Identify unique items in the filtered list and count there number of occurence. Store their sentiment polarity as an array to be reduced later
  for (let [key, filteredDataLocation] of Object.entries(
    filteredDataLocations
  )) {
    // If locationList is empty, add and object and continue along the loop
    if (locationCountList.length === 0) {
      citiesGeodata.find((d) => {
        return d === filteredDataLocation;
      });
      locationCountList.push({
        locationCode: filteredDataLocation,
        location: citiesGeodata.find((d) => d.city === filteredDataLocation)
          ?.name,
        latitude: citiesGeodata.find((d) => d.city === filteredDataLocation)
          ?.lat,
        longitude: citiesGeodata.find((d) => d.city === filteredDataLocation)
          ?.lng,
        count: 1,
        average: [filteredData[key].sentimentPolarity],
      });
      continue;
    }

    // Increment the count for recurring locations
    const location = locationCountList.map((el) => el.locationCode);
    if (location.includes(filteredDataLocation)) {
      const data = locationCountList.find((item) => {
        return item.locationCode === filteredDataLocation;
      });
      data.count += 1;
      data.average = [...data.average, filteredData[key].sentimentPolarity];
    } else {
      // Create new location object if it doesn't exist already in the locationCountList array
      locationCountList.push({
        locationCode: filteredDataLocation,
        location: citiesGeodata.find((d) => d.city === filteredDataLocation)
          ?.name,
        latitude: citiesGeodata.find((d) => d.city === filteredDataLocation)
          ?.lat,
        longitude: citiesGeodata.find((d) => d.city === filteredDataLocation)
          ?.lng,
        count: 1,
        average: [filteredData[key].sentimentPolarity],
      });
    }
  }

  // Calculate average of sentiments.
  locationCountList = locationCountList.map((item) => {
    return {
      ...item,
      average:
        item.average.reduce((prev, curr) => {
          return prev + curr;
        }, 0) / item.average.length,
    };
  });

  return [locationCountList, filteredData];
};
