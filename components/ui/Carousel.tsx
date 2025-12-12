import React from 'react';
import { View, Image, FlatList } from 'react-native';
import { theme } from './theme';
import { Ionicons } from '@expo/vector-icons';

interface CarouselProps {
  images: string[];
}

const Carousel = ({ images }: CarouselProps) => {
  if (images.length === 0) {
    return (
      <View
        style={{
          width: 300,
          height: 300,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Ionicons name="image-outline" size={100} color={theme.foreground} />
      </View>
    );
  }
  return (
    <FlatList
      data={images}
      keyExtractor={(item) => item}
      horizontal
      showsHorizontalScrollIndicator
      renderItem={({ item }) => (
        <Image
          source={{ uri: item }}
          style={{
            width: 300,
            height: 300,
            borderRadius: theme.radius,
            marginHorizontal: 10,
          }}
        />
      )}
    />
  );
};

export default Carousel;
