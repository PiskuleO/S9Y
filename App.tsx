import React, {ReactNode, useMemo} from 'react';
import {useEffect, useState} from 'react';
import {
  ScrollView,
  Text,
  Image,
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Button,
  ListRenderItem,
  Alert,
  TouchableOpacity,
} from 'react-native';

interface Movie {
  item: string;
  poster: string;
  title: string;
  episode_number: string;
}

const Item = (props: Movie) => (
  <View style={styles.container}>
    <Image
      style={styles.poster}
      source={{
        uri: `https://raw.githubusercontent.com/RyanHemrick/star_wars_movie_app/master/public/images/${encodeURIComponent(
          props.poster,
        )}`,
      }}
    />
    <Text>{props.title}</Text>
    <Text>Episode Number: {props.episode_number}</Text>
  </View>
);

const App = () => {
  const renderItem: ListRenderItem<Movie> = ({item}) => (
    <Item
      item={item.item}
      title={item.title}
      poster={item.poster}
      episode_number={item.episode_number}
    />
  );

  const [isLoading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Movie[]>();
  const [isAscending, setisAscending] = useState<boolean>(true);
  const mSorter = useMemo(() => {
    if (data === undefined) {
      return;
    } else {
      return [...data].sort((a, b) => {
        function compareBy(data: Movie) {
          return data.episode_number;
        }
        const lgc = parseInt(compareBy(b)) < parseInt(compareBy(a)) ? 1 : -1;
        return isAscending === true ? lgc : lgc * -1;
      });
    }
  }, [data, isAscending]);

  const getMovies = async () => {
    try {
      const data = await fetch(
        'https://raw.githubusercontent.com/RyanHemrick/star_wars_movie_app/master/movies.json',
      );
      const jsonData = await data.json();
      setData(jsonData.movies);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <View>
      <Button
        onPress={() => {
          setisAscending(!isAscending);
        }}
        title="Sort"
      />
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={mSorter}
          renderItem={renderItem}
          keyExtractor={item => item.title}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  poster: {
    width: 100,
    height: 100,
    marginBottom: 25,
  },

  container: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: 'grey',
    padding: 50,
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
  },
});
export default App;
