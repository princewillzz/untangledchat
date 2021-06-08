import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {FAB, Header, Icon, ListItem, Text} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {users} from '../api/users';
import AuthContext from '../auth/auth';
import HomeHeaderLeftView from '../components/HomeHeaderLeftView';
import HomeHeaderRightView from '../components/HomeHeaderRightView';
import ImageModal from '../components/ImageModal';
import RecentChat from '../components/RecentChat';
import SearchBox from '../components/SearchBox';
import {fetchAllRecentChatUsers} from '../db/recent_chat_users';

// import {createDrawerNavigator} from '@react-navigation/drawer';

// const Drawer = createDrawerNavigator();

export default function HomeScreen({navigation}) {
  const {currentUserInfo} = React.useContext(AuthContext);

  const [recentChatUsers, setRecentChatUsers] = useState([]);

  const [showSearchBox, setShowSearchBox] = useState(false);
  const [searchResultUsers, setSearchResultUsers] = useState([]);

  // seach text
  const [seachChatText, setSearchChatText] = useState(null);

  // Zoom on the profile picture of all your contact
  const [imageToBeShownOnModal, setImageToBeShownOnModal] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const handleCloseImageModal = useCallback(() => setShowImageModal(false), []);
  const handleOpenImageModal = useCallback(image => {
    setShowImageModal(true);
    setImageToBeShownOnModal(image);
  }, []);

  // Search box
  const toggleShowSearchBox = state => {
    if (showSearchBox !== state) {
      setShowSearchBox(state);
      if (!state) {
        setSearchChatText(null);
      }
    }
  };

  // handle Search
  const handleSearchOnChange = value => {
    setSearchChatText(value);

    setSearchResultUsers(
      users.filter(user => user.username.toLowerCase().includes(value)),
    );
  };

  useEffect(() => {
    fetchAllRecentChatUsers()
      .then(recentChatUsers => {
        console.log(recentChatUsers);
        // setRecentChatUsers(recentChatUsers);
        setRecentChatUsers(users);
      })
      .catch(e => {
        console.log(e);
      });
  }, []);

  return (
    <>
      <Header
        containerStyle={{
          backgroundColor: '#ECECEC',
        }}
        leftComponent={
          <HomeHeaderLeftView
            image={currentUserInfo?.image}
            handleOpenImageModal={handleOpenImageModal}
          />
        }
        rightComponent={
          <HomeHeaderRightView
            navigation={navigation}
            showSearchBox={showSearchBox}
            toggleShowSearchBox={toggleShowSearchBox}
          />
        }
      />

      {showSearchBox && (
        <SearchBox
          handleSearchOnChange={handleSearchOnChange}
          seachChatText={seachChatText}
          toggleShowSearchBox={toggleShowSearchBox}
        />
      )}

      {recentChatUsers?.length <= 0 && (
        <View>
          <View style={styles.NoRecetChatsContainer}>
            <Text style={styles.NoRecetChatsText}>No Recent Chats!!</Text>
          </View>
        </View>
      )}

      <View
        style={styles.container}
        onTouchStart={() => toggleShowSearchBox(false)}>
        {!seachChatText ? (
          <FlatList
            style={styles.recentChats}
            data={recentChatUsers}
            renderItem={({item}) => (
              <RecentChat
                handleOpenImageModal={handleOpenImageModal}
                navigation={navigation}
                userInfo={item}
                key={item.user_id}
              />
            )}
            keyExtractor={_ => _.user_id}
          />
        ) : (
          <>
            <FlatList
              style={styles.recentChats}
              data={searchResultUsers}
              renderItem={({item}) => (
                <RecentChat
                  handleOpenImageModal={handleOpenImageModal}
                  navigation={navigation}
                  userInfo={item}
                  key={item.id}
                />
              )}
              keyExtractor={_ => _.id}
            />
            {searchResultUsers?.length <= 0 && (
              <ListItem
                style={styles.nothingFoundSearch}
                containerStyle={{
                  backgroundColor: '#ECECEC',
                }}
                bottomDivider>
                <ListItem.Content
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <Icon
                    name="alert-circle-outline"
                    type="ionicon"
                    style={{marginRight: 5}}
                  />
                  <ListItem.Title>Nothing Found</ListItem.Title>
                </ListItem.Content>
              </ListItem>
            )}
          </>
        )}
      </View>

      <FAB
        color="#CCE5FF"
        icon={() => <Icon name="add" type="ionicon" />}
        placement="right"
        style={{padding: 5}}
      />

      <ImageModal
        images={{uri: imageToBeShownOnModal}}
        showImageModal={showImageModal}
        handleOpenImageModal={handleOpenImageModal}
        handleCloseImageModal={handleCloseImageModal}
      />
    </>
  );
}

const styles = StyleSheet.create({
  NoRecetChatsContainer: {
    height: 45,
    backgroundColor: '#CCE5FF',
    flexDirection: 'column',
    justifyContent: 'center',
    elevation: 4,
  },
  NoRecetChatsText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#596998',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  recentChats: {
    flex: 1,
    // backgroundColor: "blue",
    // flexDirection: "column",
  },
  searchBarContainer: {
    elevation: 30,
    top: 0,
  },
  searchBar: {
    width: '95%',
    alignSelf: 'center',
    height: 40,
    borderRadius: 10,
    // backgroundColor: "silver",
  },
  nothingFoundSearch: {
    position: 'absolute',
    width: '100%',
  },
});
