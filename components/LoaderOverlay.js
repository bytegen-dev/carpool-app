// components/LoaderOverlay.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Portal, Modal } from 'react-native-paper';

export default function LoaderOverlay({ visible }) {
  return (
    <Portal>
      <Modal visible={visible} dismissable={false} contentContainerStyle={styles.modal}>
        <ActivityIndicator size="large" color='#fff' />
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: "100%",
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});
