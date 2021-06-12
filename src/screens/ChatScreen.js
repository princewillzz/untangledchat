import moment from 'moment';
import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Header, Icon} from 'react-native-elements';
import AuthContext from '../auth/auth';
import ChatBox from '../components/ChatBox';
import ChatScreenHeaderLeft from '../components/ChatScreenHeaderLeft';
import ChatScreenHeaderRight from '../components/ChatScreenHeaderRight';
import ImageModal from '../components/ImageModal';

import Realm from 'realm';
import {ChatsSchema, CHATS_SCHEMA} from '../db/allSchemas';
import {
  chatSchemaRealmObject,
  deleteAllChats,
  insertChats,
} from '../db/chatsSchema';

export default function ChatScreen({route, navigation}) {
  // const meUserInfo?.id = "12"; // to be removed later on

  const {currentUserInfo: meUserInfo} = React.useContext(AuthContext);

  const [userInfo, setUserInfo] = useState({});

  // console.log('userinfo------', userInfo);

  // show image modal
  const [showImageModal, setShowImageModal] = useState(false);
  const handleOpenImageModal = useCallback(() => {
    setShowImageModal(true);
  }, []);
  const handleCloseImageModal = useCallback(() => setShowImageModal(false), []);

  // end of show image modal

  const [chats, setChats] = useState([
    {
      id: '1',
      textMessage: 'lorem ipsum',
      time: '12:90',
      sentByUserId: '123',
    },
    {
      id: '2',
      textMessage: ' not ipsum',
      time: '12:90',
      sentByUserId: '12',
    },
  ]);

  const [textMessageToBeSent, setTextMessageToBeSent] = useState('');

  useEffect(() => {
    const {userInfo} = route.params;
    setUserInfo(JSON.parse(userInfo));
    // deleteAllChats();
    console.log('useeffect');
    // realm = new Realm({schema: [ChatsSchema]});

    // add a listener to chatschema
    chatSchemaRealmObject.addListener('change', () => {
      console.log('listened changes');
    });

    let index = 0;
    // const have = setInterval(() => {
    //   insertChats({
    //     uid: 'string' + (Math.random() * 1000).toString(),
    //     type: 'string',
    //     text: 'string?',
    //     link: 'string?',
    //     timestamp: new Date(),
    //     // Is me
    //     isMe: false,
    //     // sent info
    //     send_to_id: 'string',
    //   })
    //     .then(() => {
    //       console.log('chats');
    //     })
    //     .catch(e => {
    //       console.log('error' + e);
    //     });

    //   index++;
    //   if (index === 5) {
    //     clearInterval(have);
    //   }
    // }, 1000);
  }, []);

  const handleSendMessage = async () => {
    setChats([
      {
        id: Math.random().toString(),
        textMessage: textMessageToBeSent.trim(),
        time: moment().format('HH:mm'),
        sentByUserId: meUserInfo?.user_id,
        isMe: true,
      },
      ...chats,
    ]);

    setTextMessageToBeSent('');
  };

  return (
    <>
      <Header
        containerStyle={{
          backgroundColor: '#ECECEC',
        }}
        leftComponent={
          <ChatScreenHeaderLeft
            userImage={userInfo?.user_image}
            displayName={userInfo?.displayName}
            handleOpenImageModal={handleOpenImageModal}
            navigation={navigation}
          />
        }
        rightComponent={<ChatScreenHeaderRight />}
      />
      <KeyboardAvoidingView style={styles.container}>
        <FlatList
          style={styles.chatList}
          data={chats}
          renderItem={({item}) => (
            <ChatBox data={item} isMe={item.isMe} key={item.id} />
          )}
          keyExtractor={_ => _.id}
          inverted
        />
        <View style={styles.messageInputContainer}>
          <TextInput
            multiline
            style={styles.messageInput}
            placeholder="Enter Text"
            value={textMessageToBeSent}
            onChangeText={setTextMessageToBeSent}
            // onSubmitEditing={handleSendMessage}
          />
          <TouchableOpacity onPress={handleSendMessage} style={styles.sendIcon}>
            <Icon name="send-outline" type="ionicon" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <ImageModal
        handleCloseImageModal={handleCloseImageModal}
        showImageModal={showImageModal}
        images={{uri: userInfo?.user_image}}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatList: {
    marginVertical: 10,
  },
  messageInputContainer: {
    // height: 50,
    // maxWidth: "100%",
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  messageInput: {
    // flexGrow: 1,
    width: '90%',
    marginRight: 10,
    paddingVertical: 10,
    paddingHorizontal: 25,
    maxHeight: 100,
    bottom: 6,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: '#ECECEC',
    color: 'black',
  },
  sendIcon: {
    // backgroundColor: 'yellow',
    // flex: 1,
    alignSelf: 'flex-end',
    bottom: 18,
    // position: 'relative',
    // position: 'absolute',
    // bottom: 0,
    // right: 0,
  },
});
