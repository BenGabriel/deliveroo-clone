import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { ArrowRightIcon } from "react-native-heroicons/outline";
import RestaurantCard from "./RestaurantCard";
import sanityClient from "../sanity";

const FeaturedRow = ({ id, title, description }) => {
  const [restaurants, setRestaurants] = useState([]);
  useEffect(() => {
    sanityClient
      .fetch(
        `
        *[_type == "featured" && _id == $id] {
            ...,
            restaurants[] -> {
                ...,
                dishes[]->,
                type-> {
                    name
                } 
            }
        }[0]
        `,
        { id }
      )
      .then((data) => setRestaurants(data?.restaurants));
  }, []);
  return (
    <View>
      <View className="mt-4 flex-row items-center justify-between px-5">
        <Text className="font-bold text-lg">{title}</Text>
        <ArrowRightIcon color="#00CCBB" />
      </View>
      <Text className="text-xs text-gray-500 px-5">{description}</Text>
      <ScrollView
        horizontal
        contentContainerStyle={{
          paddingHorizontal: 20
        }}
        showsHorizontalScrollIndicator={false}
        className="pt-4"
      >
        {/* restaurant cards */}
        {restaurants?.map((restaurant) => (
          <RestaurantCard
            key={restaurant._id}
            id={restaurant._id}
            imgUrl={restaurant.image}
            title={restaurant.name}
            rating={restaurant.rating}
            genre={restaurant.type?.name}
            address={restaurant.address}
            short_description={restaurant.short_description}
            dishes={restaurant.dishes}
            long={restaurant.long}
            lat={restaurant.lat}
          />
        ))}
        {/* <RestaurantCard
          id="123"
          imgUrl="https://links.papareact.com/gn7"
          title="Yo! Sushi"
          rating="4.5"
          genre="Japanese"
          address="123 Main st"
          short_description="This is a short description"
          dishes={[]}
          long={20}
          lat={0}
        /> */}
      </ScrollView>
    </View>
  );
};

export default FeaturedRow;
