import Realm from 'realm';
import {RecentChatUsersSchema, RECENT_CHAT_USERS_SCHEMA} from './allSchemas';

const RecentChatUserdatabaseOptions = {
  path: 'untangledchat.recent_chat_users.realm',
  schema: [RecentChatUsersSchema],
  schemaVersion: 1,
};

export const fetchAllRecentChatUsers = () =>
  new Promise((resolve, reject) => {
    Realm.open(RecentChatUserdatabaseOptions)
      .then(realm => {
        const recentChatUsers = realm.objects(RECENT_CHAT_USERS_SCHEMA);
        resolve(recentChatUsers);
      })
      .catch(error => reject(error));
  });
