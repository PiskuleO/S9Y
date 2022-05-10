import React, {ReactNode} from 'react';
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

interface Props {
  item: string;
  poster: string;
  title: string;
  episode_number: string;
}

const Item = (props: Props) => (
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
  const renderItem: ListRenderItem<Props> = ({item}) => (
    <Item
      item={item.item}
      title={item.title}
      poster={item.poster}
      episode_number={item.episode_number}
    />
  );

  const [isLoading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Props[]>();
  const [sortedby, setSortedby] = useState<string>('Asc');

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
          if (data === undefined) {
            return;
          }
          if (sortedby === 'Desc') {
            setSortedby('Asc');
            setData(
              data.sort((a, b) => {
                const nameA = parseInt(a.episode_number);
                const nameB = parseInt(b.episode_number);

                if (nameA < nameB) {
                  return -1;
                }
                if (nameA > nameB) {
                  return 1;
                }
                return 0;
              }),
            );
          } else {
            setSortedby('Desc');
            setData(
              data.sort((a, b) => {
                const nameA = parseInt(a.episode_number);
                const nameB = parseInt(b.episode_number);

                if (nameA < nameB) {
                  return 1;
                }
                if (nameA > nameB) {
                  return -1;
                }
                return 0;
              }),
            );
          }
        }}
        title="Sort"
      />
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data}
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
