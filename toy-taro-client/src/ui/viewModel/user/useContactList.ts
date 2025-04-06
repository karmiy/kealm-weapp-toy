import { useMemo } from 'react';
import { ROLE, STORE_NAME } from '@core';
import { useSingleStore, useStoreList } from '../base';

export function useContactList() {
  // 获取当前用户信息
  const user = useSingleStore(STORE_NAME.USER);
  const currentUserId = user?.id;

  // 获取联系人列表
  const contactList = useStoreList(STORE_NAME.CONTACT);

  // 获取管理员联系人列表（排除自己）
  const adminContacts = useMemo(() => {
    return contactList.filter(
      contact => contact.role === ROLE.ADMIN && contact.id !== currentUserId,
    );
  }, [contactList, currentUserId]);

  // 获取普通用户联系人列表（排除自己）
  const userContacts = useMemo(() => {
    return contactList.filter(
      contact => contact.role === ROLE.USER && contact.id !== currentUserId,
    );
  }, [contactList, currentUserId]);

  return {
    adminContacts,
    userContacts,
  };
}
